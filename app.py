import os
import json
from datetime import datetime
from functools import wraps

from flask import Flask, render_template, redirect, url_for, request, flash, abort, send_from_directory, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_user, logout_user, login_required, current_user, UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['SECRET_KEY'] = 'change-this-secret-key'  # غيّرها قبل النشر
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///store.db'
app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'uploads')
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024  # 5 ميجا لكل ملف

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message = 'الرجاء تسجيل الدخول للمتابعة'

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# ==================== بيانات التمهيد (تُستخدم مرة واحدة فقط أول تشغيل) ====================
# بعد كده الفئات والبانرات تُدار بالكامل من لوحة التحكم (admin/categories و admin/banners)

SEED_CATEGORIES = [
    {"id": "gift-cards", "label": "بطاقات هدايا", "labelEn": "Gift Cards",
     "image": "https://i.ibb.co/DPj8GzcL/20260702-131510.png"},
    {"id": "subscriptions", "label": "اشتراكات", "labelEn": "Subscriptions",
     "image": "https://i.ibb.co/MkHjNSKD/20260702-132134.png"},
    {"id": "xbox-games", "label": "ألعاب Xbox", "labelEn": "Xbox Games",
     "image": "https://i.ibb.co/JRD9xQVd/images-3.jpg"},
    {"id": "playstation-games", "label": "ألعاب PlayStation", "labelEn": "PlayStation Games",
     "image": "https://i.ibb.co/5XBCN79z/images.png"},
]

SEED_BANNERS = [
    {"image": "https://i.ibb.co/nNt0rrRq/20260611-213617.png", "link": ""},
    {"image": "https://i.ibb.co/5XRS3gCF/20260703-165847.png", "link": ""},
    {"image": "https://i.ibb.co/wh7fP95G/200w.webp", "link": ""},
    {"image": "https://i.ibb.co/6crxZmhF/200w-1.webp", "link": ""},
]


# ==================== الموديلات (جداول قاعدة البيانات) ====================

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(30))
    password_hash = db.Column(db.String(255), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    orders = db.relationship('Order', backref='customer', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Category(db.Model):
    id = db.Column(db.String(50), primary_key=True)  # slug مثل xbox-games
    label = db.Column(db.String(100), nullable=False)
    label_en = db.Column(db.String(100))
    image = db.Column(db.String(400))
    sort_order = db.Column(db.Integer, default=0)

    def to_js_dict(self):
        return {
            "id": self.id,
            "label": self.label,
            "labelEn": self.label_en or self.label,
            "image": self.image,
            "link": f"/category.html?cat={self.id}",
        }


class Banner(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image = db.Column(db.String(400), nullable=False)
    link = db.Column(db.String(400))
    sort_order = db.Column(db.Integer, default=0)

    def to_js_dict(self):
        return {"image": self.image, "link": self.link or ""}


class Product(db.Model):
    id = db.Column(db.String(80), primary_key=True)  # slug مثل batman-arkham-knight-xb
    name = db.Column(db.String(150), nullable=False)
    name_en = db.Column(db.String(150))
    category = db.Column(db.String(50), nullable=False)
    platform_tag = db.Column(db.String(30))
    note = db.Column(db.String(100))
    note_en = db.Column(db.String(100))
    price = db.Column(db.Float, nullable=False)
    old_price = db.Column(db.Float)
    currency_ar = db.Column(db.String(20), default='ج.م')
    currency_en = db.Column(db.String(20), default='EGP')
    image = db.Column(db.String(400))
    description = db.Column(db.Text)
    description_en = db.Column(db.Text)
    is_new = db.Column(db.Boolean, default=False)
    in_stock = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_js_dict(self):
        return {
            "name": self.name,
            "nameEn": self.name_en or self.name,
            "platformTag": self.platform_tag or "",
            "category": self.category,
            "note": self.note or "",
            "noteEn": self.note_en or self.note or "",
            "price": self.price,
            "oldPrice": self.old_price,
            "isNew": self.is_new,
            "inStock": self.in_stock,
            "currency": {"ar": self.currency_ar, "en": self.currency_en},
            "image": self.image,
            "description": self.description or "",
            "descriptionEn": self.description_en or self.description or "",
        }


class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending / completed / failed
    payment_proof = db.Column(db.String(300))
    admin_note = db.Column(db.Text)
    customer_name = db.Column(db.String(100))
    customer_phone = db.Column(db.String(30))
    customer_email = db.Column(db.String(120))
    payment_method = db.Column(db.String(30))
    total = db.Column(db.Float, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    items = db.relationship('OrderItem', backref='order', lazy=True, cascade='all, delete-orphan')


class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    product_id = db.Column(db.String(80))
    product_name = db.Column(db.String(150))
    unit_price = db.Column(db.Float)
    quantity = db.Column(db.Integer, default=1)
    subtotal = db.Column(db.Float)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


def admin_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.is_admin:
            abort(403)
        return f(*args, **kwargs)
    return wrapper


# ==================== دوال مساعدة للقوالب ====================

def products_json():
    products = Product.query.all()
    return json.dumps({p.id: p.to_js_dict() for p in products}, ensure_ascii=False)


def get_categories():
    return Category.query.order_by(Category.sort_order.asc(), Category.label.asc()).all()


def get_banners():
    return Banner.query.order_by(Banner.sort_order.asc(), Banner.id.asc()).all()


def base_context():
    categories = [c.to_js_dict() for c in get_categories()]
    banners = [b.to_js_dict() for b in get_banners()]
    return {
        "categories_json": json.dumps(categories, ensure_ascii=False),
        "banners_json": json.dumps(banners, ensure_ascii=False),
        "products_json": products_json(),
    }


# ==================== صفحات المتجر ====================

@app.route('/')
@app.route('/index.html')
def index():
    return render_template('index.html', **base_context())


@app.route('/category.html')
def category_page():
    cat_id = request.args.get('cat')
    return render_template('category.html', cat_id=cat_id, **base_context())


@app.route('/product.html')
def product_page():
    product_id = request.args.get('id')
    product = Product.query.get(product_id) if product_id else None
    return render_template('product_detail.html', product=product, current_product_id=product_id, **base_context())


@app.route('/privacy.html')
def privacy():
    return render_template('privacy.html')


@app.route('/returns.html')
def returns():
    return render_template('returns.html')


# ==================== الحسابات ====================

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip().lower()
        phone = request.form.get('phone', '').strip()
        password = request.form.get('password', '')

        if not name or not email or not password:
            flash('الرجاء تعبئة جميع الحقول المطلوبة', 'error')
            return redirect(url_for('register'))

        if User.query.filter_by(email=email).first():
            flash('هذا البريد الإلكتروني مسجل بالفعل', 'error')
            return redirect(url_for('register'))

        user = User(name=name, email=email, phone=phone)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        login_user(user)
        flash('تم إنشاء الحساب بنجاح', 'success')
        return redirect(request.args.get('next') or url_for('index'))

    return render_template('register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        user = User.query.filter_by(email=email).first()

        if user and user.check_password(password):
            login_user(user)
            next_page = request.form.get('next') or request.args.get('next')
            return redirect(next_page or url_for('index'))

        flash('بريد إلكتروني أو كلمة مرور غير صحيحة', 'error')

    return render_template('login.html', next=request.args.get('next', ''))


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))


@app.route('/account')
@login_required
def account():
    orders = Order.query.filter_by(user_id=current_user.id).order_by(Order.created_at.desc()).all()
    return render_template('account.html', orders=orders)


# ==================== الطلب (من السلة) ====================

@app.route('/api/checkout', methods=['POST'])
@login_required
def api_checkout():
    data = request.get_json(silent=True) or {}
    items = data.get('items') or []
    if not items:
        return jsonify({"error": "السلة فارغة"}), 400

    order = Order(
        user_id=current_user.id,
        status='pending',
        customer_name=data.get('name', current_user.name),
        customer_phone=data.get('phone', current_user.phone or ''),
        customer_email=data.get('email', current_user.email),
        payment_method=data.get('payment', ''),
        total=0,
    )
    db.session.add(order)
    db.session.flush()  # عشان ناخد order.id قبل الحفظ النهائي

    total = 0
    for it in items:
        product = Product.query.get(it.get('productId'))
        if not product:
            continue
        qty = max(1, int(it.get('quantity', 1)))
        subtotal = product.price * qty
        total += subtotal
        db.session.add(OrderItem(
            order_id=order.id,
            product_id=product.id,
            product_name=product.name,
            unit_price=product.price,
            quantity=qty,
            subtotal=subtotal,
        ))

    order.total = total
    db.session.commit()

    return jsonify({"orderId": order.id})


@app.route('/order/<int:order_id>/payment', methods=['GET', 'POST'])
@login_required
def order_payment(order_id):
    order = Order.query.get_or_404(order_id)
    if order.user_id != current_user.id:
        abort(403)

    if request.method == 'POST':
        file = request.files.get('payment_proof')

        if not file or file.filename == '':
            flash('الرجاء رفع إثبات الدفع', 'error')
            return redirect(url_for('order_payment', order_id=order.id))

        if not allowed_file(file.filename):
            flash('صيغة الملف غير مدعومة (المسموح: png, jpg, jpeg, pdf)', 'error')
            return redirect(url_for('order_payment', order_id=order.id))

        filename = secure_filename(
            f"{current_user.id}_{order.id}_{int(datetime.utcnow().timestamp())}_{file.filename}"
        )
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        order.payment_proof = filename
        db.session.commit()

        flash('تم استلام إثبات الدفع، سيتم مراجعة طلبك والتواصل معك قريباً', 'success')
        return redirect(url_for('account'))

    return render_template('order_payment.html', order=order)


# ==================== لوحة تحكم الأدمن ====================

@app.route('/admin')
@login_required
@admin_required
def admin_dashboard():
    stats = {
        'products_count': Product.query.count(),
        'pending_count': Order.query.filter_by(status='pending').count(),
        'completed_count': Order.query.filter_by(status='completed').count(),
        'failed_count': Order.query.filter_by(status='failed').count(),
    }
    return render_template('admin/dashboard.html', stats=stats)


@app.route('/admin/products')
@login_required
@admin_required
def admin_products():
    products = Product.query.order_by(Product.created_at.desc()).all()
    return render_template('admin/products.html', products=products)


@app.route('/admin/products/new', methods=['GET', 'POST'])
@login_required
@admin_required
def admin_new_product():
    if request.method == 'POST':
        slug = request.form.get('id', '').strip()
        if not slug or Product.query.get(slug):
            flash('المعرّف (id) فارغ أو مستخدم من قبل، اختر معرّف مختلف', 'error')
            return redirect(url_for('admin_new_product'))

        try:
            price = float(request.form.get('price', '0'))
            old_price = request.form.get('old_price', '').strip()
            old_price = float(old_price) if old_price else None
        except ValueError:
            flash('السعر غير صحيح', 'error')
            return redirect(url_for('admin_new_product'))

        product = Product(
            id=slug,
            name=request.form.get('name', '').strip(),
            name_en=request.form.get('name_en', '').strip(),
            category=request.form.get('category'),
            platform_tag=request.form.get('platform_tag', '').strip(),
            note=request.form.get('note', '').strip(),
            note_en=request.form.get('note_en', '').strip(),
            price=price,
            old_price=old_price,
            image=request.form.get('image', '').strip(),
            description=request.form.get('description', '').strip(),
            description_en=request.form.get('description_en', '').strip(),
            is_new='is_new' in request.form,
            in_stock='in_stock' in request.form,
        )
        db.session.add(product)
        db.session.commit()
        flash('تمت إضافة المنتج بنجاح', 'success')
        return redirect(url_for('admin_products'))

    return render_template('admin/product_form.html', product=None, categories=get_categories())


@app.route('/admin/products/<product_id>/edit', methods=['GET', 'POST'])
@login_required
@admin_required
def admin_edit_product(product_id):
    product = Product.query.get_or_404(product_id)

    if request.method == 'POST':
        product.name = request.form.get('name', '').strip()
        product.name_en = request.form.get('name_en', '').strip()
        product.category = request.form.get('category')
        product.platform_tag = request.form.get('platform_tag', '').strip()
        product.note = request.form.get('note', '').strip()
        product.note_en = request.form.get('note_en', '').strip()
        product.image = request.form.get('image', '').strip()
        product.description = request.form.get('description', '').strip()
        product.description_en = request.form.get('description_en', '').strip()
        product.is_new = 'is_new' in request.form
        product.in_stock = 'in_stock' in request.form

        try:
            product.price = float(request.form.get('price', '0'))
            old_price = request.form.get('old_price', '').strip()
            product.old_price = float(old_price) if old_price else None
        except ValueError:
            flash('السعر غير صحيح', 'error')
            return redirect(url_for('admin_edit_product', product_id=product_id))

        db.session.commit()
        flash('تم تعديل المنتج بنجاح', 'success')
        return redirect(url_for('admin_products'))

    return render_template('admin/product_form.html', product=product, categories=get_categories())


@app.route('/admin/products/<product_id>/delete', methods=['POST'])
@login_required
@admin_required
def admin_delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    flash('تم حذف المنتج', 'success')
    return redirect(url_for('admin_products'))


@app.route('/admin/categories')
@login_required
@admin_required
def admin_categories():
    categories = get_categories()
    return render_template('admin/categories.html', categories=categories)


@app.route('/admin/categories/new', methods=['POST'])
@login_required
@admin_required
def admin_new_category():
    slug = request.form.get('id', '').strip()
    if not slug or Category.query.get(slug):
        flash('المعرّف فارغ أو مستخدم من قبل، اختر معرّف مختلف', 'error')
        return redirect(url_for('admin_categories'))

    max_order = db.session.query(db.func.max(Category.sort_order)).scalar() or 0
    category = Category(
        id=slug,
        label=request.form.get('label', '').strip(),
        label_en=request.form.get('label_en', '').strip(),
        image=request.form.get('image', '').strip(),
        sort_order=max_order + 1,
    )
    db.session.add(category)
    db.session.commit()
    flash('تمت إضافة الفئة بنجاح', 'success')
    return redirect(url_for('admin_categories'))


@app.route('/admin/categories/<cat_id>/edit', methods=['POST'])
@login_required
@admin_required
def admin_edit_category(cat_id):
    category = Category.query.get_or_404(cat_id)
    category.label = request.form.get('label', '').strip()
    category.label_en = request.form.get('label_en', '').strip()
    category.image = request.form.get('image', '').strip()
    try:
        category.sort_order = int(request.form.get('sort_order', category.sort_order))
    except ValueError:
        pass
    db.session.commit()
    flash('تم تعديل الفئة بنجاح', 'success')
    return redirect(url_for('admin_categories'))


@app.route('/admin/categories/<cat_id>/delete', methods=['POST'])
@login_required
@admin_required
def admin_delete_category(cat_id):
    category = Category.query.get_or_404(cat_id)
    if Product.query.filter_by(category=cat_id).count() > 0:
        flash('لا يمكن حذف فئة فيها منتجات، احذف أو انقل المنتجات أولاً', 'error')
        return redirect(url_for('admin_categories'))
    db.session.delete(category)
    db.session.commit()
    flash('تم حذف الفئة', 'success')
    return redirect(url_for('admin_categories'))


@app.route('/admin/banners')
@login_required
@admin_required
def admin_banners():
    banners = get_banners()
    return render_template('admin/banners.html', banners=banners)


@app.route('/admin/banners/new', methods=['POST'])
@login_required
@admin_required
def admin_new_banner():
    image = request.form.get('image', '').strip()
    if not image:
        flash('رابط الصورة مطلوب', 'error')
        return redirect(url_for('admin_banners'))

    max_order = db.session.query(db.func.max(Banner.sort_order)).scalar() or 0
    banner = Banner(image=image, link=request.form.get('link', '').strip(), sort_order=max_order + 1)
    db.session.add(banner)
    db.session.commit()
    flash('تمت إضافة البانر بنجاح', 'success')
    return redirect(url_for('admin_banners'))


@app.route('/admin/banners/<int:banner_id>/edit', methods=['POST'])
@login_required
@admin_required
def admin_edit_banner(banner_id):
    banner = Banner.query.get_or_404(banner_id)
    banner.image = request.form.get('image', '').strip()
    banner.link = request.form.get('link', '').strip()
    try:
        banner.sort_order = int(request.form.get('sort_order', banner.sort_order))
    except ValueError:
        pass
    db.session.commit()
    flash('تم تعديل البانر بنجاح', 'success')
    return redirect(url_for('admin_banners'))


@app.route('/admin/banners/<int:banner_id>/delete', methods=['POST'])
@login_required
@admin_required
def admin_delete_banner(banner_id):
    banner = Banner.query.get_or_404(banner_id)
    db.session.delete(banner)
    db.session.commit()
    flash('تم حذف البانر', 'success')
    return redirect(url_for('admin_banners'))


@app.route('/admin/orders')
@login_required
@admin_required
def admin_orders():
    status_filter = request.args.get('status')
    query = Order.query
    if status_filter in ('pending', 'completed', 'failed'):
        query = query.filter_by(status=status_filter)
    orders = query.order_by(Order.created_at.desc()).all()
    return render_template('admin/orders.html', orders=orders, status_filter=status_filter)


@app.route('/admin/orders/<int:order_id>/update', methods=['POST'])
@login_required
@admin_required
def admin_update_order(order_id):
    order = Order.query.get_or_404(order_id)
    new_status = request.form.get('status')
    note = request.form.get('note', '').strip()

    if new_status in ('pending', 'completed', 'failed'):
        order.status = new_status
        order.admin_note = note
        db.session.commit()
        flash('تم تحديث حالة الطلب', 'success')

    return redirect(url_for('admin_orders'))


@app.route('/uploads/<path:filename>')
@login_required
def uploaded_file(filename):
    order = Order.query.filter_by(payment_proof=filename).first()
    if not order:
        abort(404)
    if not current_user.is_admin and order.user_id != current_user.id:
        abort(403)
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


# ==================== أوامر تيرمنال ====================

@app.cli.command('create-admin')
def create_admin():
    """إنشاء حساب أدمن جديد: flask create-admin"""
    import getpass
    name = input('الاسم: ')
    email = input('البريد الإلكتروني: ').strip().lower()
    password = getpass.getpass('كلمة المرور: ')

    if User.query.filter_by(email=email).first():
        print('هذا البريد مستخدم بالفعل')
        return

    user = User(name=name, email=email, is_admin=True)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    print(f'تم إنشاء حساب الأدمن بنجاح: {email}')


def seed_products():
    """تعبئة المنتجات الأولية مرة واحدة فقط لو الجدول فاضي"""
    if Product.query.count() > 0:
        return

    from seed_data import PRODUCTS_SEED
    for slug, p in PRODUCTS_SEED.items():
        db.session.add(Product(
            id=slug,
            name=p['name'],
            name_en=p.get('nameEn', p['name']),
            category=p['category'],
            platform_tag=p.get('platformTag', ''),
            note=p.get('note', ''),
            note_en=p.get('noteEn', ''),
            price=p['price'],
            old_price=p.get('oldPrice'),
            currency_ar=p.get('currency', {}).get('ar', 'ج.م'),
            currency_en=p.get('currency', {}).get('en', 'EGP'),
            image=p.get('image', ''),
            description=p.get('description', ''),
            description_en=p.get('descriptionEn', ''),
            is_new=bool(p.get('isNew')),
            in_stock=p.get('inStock', True),
        ))
    db.session.commit()
    print(f"تمت تعبئة {len(PRODUCTS_SEED)} منتج بنجاح")


def seed_categories_and_banners():
    """تعبئة الفئات والبانرات الأولية مرة واحدة فقط لو الجداول فاضية"""
    if Category.query.count() == 0:
        for i, c in enumerate(SEED_CATEGORIES):
            db.session.add(Category(
                id=c['id'], label=c['label'], label_en=c.get('labelEn', c['label']),
                image=c.get('image', ''), sort_order=i,
            ))
    if Banner.query.count() == 0:
        for i, b in enumerate(SEED_BANNERS):
            db.session.add(Banner(image=b['image'], link=b.get('link', ''), sort_order=i))
    db.session.commit()


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        seed_products()
        seed_categories_and_banners()
    app.run(debug=True)
