let products = [
    {
        id: "Product-TTU_Batman_arkham_knight_Xbox",
        title: "Batman Arkham Knight Full account",
        price: 200,
        priceText: "200 جنيه",
        image: "https://i.ibb.co/gLBtLMZ6/d550f93b3de7b68015516483344066ec.jpg",
        category: "accounts",
        rating: 4.6,
        ratingCount: 11
    },
    
        {
        id: "Product-TTU_Assetto_corsa_ultimate_Xbox",
        title: "Assetto Corsa Ultimate  Full account",
        price: 200,
        priceText: "200 جنيه",
        image: "https://i.ibb.co/ym8M8fy4/images-4.jpg",
        category: "accounts",
        rating: 4.1,
        ratingCount: 16
    },
  
          {
        id: "Product-TTU_Hollow_knight_voidheart_edition_Xbox",
        title: "Hollow Knight voidheart edition  Full account",
        price: 200,
        priceText: "200 جنيه",
        image: "https://i.ibb.co/gMPX5W7k/images-5.jpg",
        category: "accounts",
        rating: 4.7,
        ratingCount: 25
    },
  
            {
        id: "Product-TTUGears_Of_War_4_Xbox",
        title: "Gears Of War 4  Full account",
        price: 100,
        priceText: "100 جنيه",
        image: "https://i.ibb.co/Rk8msdP0/images-6.jpg",
        category: "accounts",
        rating: 5,
        ratingCount: 20
    },
    
              {
        id: "Product-TTU_Hollow_Knight_Silksong_Xbox",
        title: "Hollow Knight Silksong  Full account",
        price: 600,
        priceText: "600 جنيه",
        image: "https://i.ibb.co/PGfQC94R/3.jpg",
        category: "accounts",
        rating: 5,
        ratingCount: 35
    },
    
    
];

function getStarsHtml(rating) {
    let fullStars = Math.floor(rating);
    let halfStar = (rating % 1) >= 0.5;
    let emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    let stars = '★'.repeat(fullStars);
    if (halfStar) stars += '½';
    stars += '☆'.repeat(emptyStars);
    return stars;
}

const PRODUCTS_PER_LOAD = 12;
let currentProducts = [];
let currentIndex = 0;
let currentFilter = "all";
let currentPriceFilter = "all";
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountSpan = document.getElementById('cartCount');
    if (cartCountSpan) cartCountSpan.textContent = count;
}

function showNotification(msg) {
    const notif = document.createElement('div');
    notif.textContent = msg;
    notif.style.cssText = `
        position:fixed; bottom:20px; left:50%; transform:translateX(-50%);
        background:red; color:white; padding:10px 20px; border-radius:10px;
        z-index:10000; font-size:14px; animation:fadeOut 2s forwards;
    `;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2000);
}

function addToCart(product) {
    if (!product.image) {
        const originalProduct = products.find(p => p.id === product.id);
        if (originalProduct) product.image = originalProduct.image;
    }
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    showNotification('✅ تم إضافة المنتج إلى السلة');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    showNotification('🗑️ تم إزالة المنتج من السلة');
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.remove();
        showCheckoutPopup();
    }
}

function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            saveCart();
            const modal = document.getElementById('checkoutModal');
            if (modal) {
                modal.remove();
                showCheckoutPopup();
            }
        }
    }
}

window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;

function display(items, reset = true) {
    const container = document.getElementById("productsContainer");
    if (reset) {
        container.innerHTML = "";
        currentIndex = 0;
        currentProducts = [...items];
    }
    const nextProducts = currentProducts.slice(currentIndex, currentIndex + PRODUCTS_PER_LOAD);
    nextProducts.forEach(p => {
        container.innerHTML += `
        <div class="product-card" data-product-id="${p.id}">
            <img src="${p.image}" loading="lazy">
            <div class="product-info">
                <div class="product-title">${p.title}</div>
                <div class="product-price">${p.priceText}</div>
                <div class="product-rating">
                    <div class="stars">${getStarsHtml(p.rating)}</div>
                    <div class="rating-count">(${p.ratingCount})</div>
                </div>
                <button class="add-to-cart-btn" data-id="${p.id}" data-title="${p.title.replace(/'/g, "\\'")}" data-price="${p.price}" data-price-text="${p.priceText}">
                    🛒 أضف إلى السلة
                </button>
            </div>
        </div>`;
    });
    document.querySelectorAll('.product-card').forEach(card => {
        card.removeEventListener('click', handleProductCardClick);
        card.addEventListener('click', handleProductCardClick);
    });
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.removeEventListener('click', handleAddToCartClick);
        btn.addEventListener('click', handleAddToCartClick);
    });
    currentIndex += PRODUCTS_PER_LOAD;
    updateLoadMoreButton();
}

function handleProductCardClick(e) {
    const productId = this.getAttribute('data-product-id');
    window.location.href = `${productId}.html`;
}

function handleAddToCartClick(e) {
    e.stopPropagation();
    addToCart({
        id: this.getAttribute('data-id'),
        title: this.getAttribute('data-title'),
        price: parseFloat(this.getAttribute('data-price')),
        priceText: this.getAttribute('data-price-text')
    });
}

function filterProducts() {
    let filtered = [...products];
    if (currentFilter !== "all") filtered = filtered.filter(p => p.category === currentFilter);
    if (currentPriceFilter !== "all") {
        if (currentPriceFilter === "0-200") filtered = filtered.filter(p => p.price >= 0 && p.price <= 200);
        else if (currentPriceFilter === "200-500") filtered = filtered.filter(p => p.price > 200 && p.price <= 500);
        else if (currentPriceFilter === "500-1000") filtered = filtered.filter(p => p.price > 500 && p.price <= 1000);
        else if (currentPriceFilter === "1000+") filtered = filtered.filter(p => p.price > 1000);
    }
    display(filtered);
}

let loadMoreBtn, loadMoreBox;
function initLoadMoreButton() {
    if (document.querySelector('.load-more-box')) return;
    loadMoreBtn = document.createElement("button");
    loadMoreBtn.className = "load-more-btn";
    loadMoreBtn.innerText = "تحميل المزيد";
    loadMoreBtn.onclick = () => display(currentProducts, false);
    loadMoreBox = document.createElement("div");
    loadMoreBox.className = "load-more-box";
    loadMoreBox.appendChild(loadMoreBtn);
    document.body.appendChild(loadMoreBox);
}

function updateLoadMoreButton() {
    if (!loadMoreBtn) return;
    loadMoreBtn.style.display = (currentIndex >= currentProducts.length) ? "none" : "block";
}

let searchTimeout;
const searchInput = document.getElementById("searchInput");
const suggestionsBox = document.getElementById("suggestions");

function performSearch() {
    if (!searchInput) return;
    const value = searchInput.value.toLowerCase().trim();
    suggestionsBox.innerHTML = "";
    if (value === "") {
        suggestionsBox.style.display = "none";
        filterProducts();
        return;
    }
    const filteredProducts = products.filter(product => product.title.toLowerCase().includes(value));
    display(filteredProducts);
    filteredProducts.forEach(product => {
        const div = document.createElement("div");
        div.className = "suggestion-item";
        div.textContent = product.title;
        div.onclick = () => window.location.href = `${product.id}.html`;
        suggestionsBox.appendChild(div);
    });
    suggestionsBox.style.display = filteredProducts.length > 0 ? "block" : "none";
}

if (searchInput) {
    searchInput.addEventListener("input", function () {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(performSearch, 300);
    });
}

document.addEventListener("click", function (e) {
    if (!e.target.closest(".search-wrapper") && suggestionsBox) suggestionsBox.style.display = "none";
});

document.querySelectorAll(".category").forEach(cat => {
    cat.addEventListener("click", () => {
        const text = cat.textContent.trim();
        document.querySelectorAll(".category").forEach(c => c.classList.remove("active-category"));
        cat.classList.add("active-category");
        if (text.includes("بطاقات")) currentFilter = "cards";
        else if (text.includes("اشتراكات")) currentFilter = "subscriptions";
        else if (text.includes("حسابات")) currentFilter = "accounts";
        else currentFilter = "all";
        filterProducts();
    });
});

function initPriceFilter() {
    const priceFilterHtml = `
    <div class="price-filter-box">
        <div class="price-filter-btn active-price-filter" data-price="all">الكل</div>
        <div class="price-filter-btn" data-price="0-200">0 - 200 جنيه</div>
        <div class="price-filter-btn" data-price="200-500">200 - 500 جنيه</div>
        <div class="price-filter-btn" data-price="500-1000">500 - 1000 جنيه</div>
        <div class="price-filter-btn" data-price="1000+">1000+ جنيه</div>
    </div>`;
    const searchWrapper = document.querySelector('.search-wrapper');
    if (searchWrapper && !document.querySelector('.price-filter-box')) {
        searchWrapper.insertAdjacentHTML('beforeend', priceFilterHtml);
    }
    document.querySelectorAll('.price-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.price-filter-btn').forEach(b => b.classList.remove('active-price-filter'));
            btn.classList.add('active-price-filter');
            currentPriceFilter = btn.getAttribute('data-price');
            filterProducts();
        });
    });
}

function showCheckoutPopup() {
    if (cart.length === 0) {
        showNotification('السلة فارغة');
        return;
    }
    
    const modal = document.createElement('div');
    modal.id = 'checkoutModal';
    modal.style.cssText = `
        position:fixed; top:0; left:0; width:100%; height:100%;
        background:rgba(0,0,0,0.95); z-index:10000;
        display:flex; align-items:center; justify-content:center;
    `;
    
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let productsListHtml = '';
    cart.forEach((item) => {
        productsListHtml += `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid #333; gap:10px; flex-wrap:wrap;">
                <div style="flex:3;">
                    <div style="font-size:14px; font-weight:bold;">${item.title}</div>
                    <div style="font-size:12px; color:#ff4757;">${item.priceText}</div>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <button onclick="window.updateQuantity('${item.id}', ${item.quantity - 1})" style="background:#333; color:white; border:none; width:28px; height:28px; border-radius:6px; cursor:pointer; font-size:16px;">-</button>
                    <span style="min-width:30px; text-align:center;">${item.quantity}</span>
                    <button onclick="window.updateQuantity('${item.id}', ${item.quantity + 1})" style="background:#333; color:white; border:none; width:28px; height:28px; border-radius:6px; cursor:pointer; font-size:16px;">+</button>
                </div>
                <button onclick="window.removeFromCart('${item.id}')" style="background:#ff4757; color:white; border:none; width:32px; height:32px; border-radius:8px; cursor:pointer; font-size:16px;">✕</button>
            </div>
        `;
    });
    
    modal.innerHTML = `
        <div style="background:#1b1b1b; padding:25px; border-radius:20px; width:90%; max-width:550px; max-height:90%; overflow-y:auto; border:1px solid red;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h2 style="color:red;">🛒 سلة التسوق</h2>
                <button id="closeModalBtn" style="background:#333; color:white; border:none; width:35px; height:35px; border-radius:50%; cursor:pointer; font-size:18px;">✕</button>
            </div>
            
            <div style="background:#111; border-radius:12px; margin-bottom:20px; max-height:300px; overflow-y:auto;">
                ${productsListHtml}
            </div>
            
            <div style="background:#111; padding:15px; border-radius:12px; margin-bottom:20px;">
                <h3 style="color:red; margin-bottom:10px;">💰 الإجمالي: ${totalPrice} جنيه</h3>
            </div>
            
            <h3 style="color:red; margin-bottom:10px;">📋 معلومات الشراء</h3>
            <input type="text" id="checkoutName" placeholder="الاسم كاملاً" style="width:100%; padding:12px; margin-bottom:12px; background:#111; border:1px solid #333; border-radius:10px; color:white;">
            <input type="tel" id="checkoutPhone" placeholder="رقم التواصل" style="width:100%; padding:12px; margin-bottom:12px; background:#111; border:1px solid #333; border-radius:10px; color:white;">
            <input type="email" id="checkoutEmail" placeholder="البريد الإلكتروني" style="width:100%; padding:12px; margin-bottom:12px; background:#111; border:1px solid #333; border-radius:10px; color:white;">
            <select id="checkoutPayment" style="width:100%; padding:12px; margin-bottom:20px; background:#111; border:1px solid #333; border-radius:10px; color:white;">
                <option value="vodafone_cash">محفظة فودافون كاش</option>
                <option value="instapay">إنستاباي</option>
                <option value="orange_money">أورانج موني</option>
            </select>
            
            <button id="confirmOrderBtn" style="background:red; color:white; border:none; padding:14px; border-radius:12px; cursor:pointer; width:100%; font-weight:bold;">📦 إتمام الطلب عبر واتساب</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('confirmOrderBtn').onclick = () => {
        const name = document.getElementById('checkoutName').value.trim();
        const phone = document.getElementById('checkoutPhone').value.trim();
        const email = document.getElementById('checkoutEmail').value.trim();
        const payment = document.getElementById('checkoutPayment').value;
        
        let paymentText = payment === 'vodafone_cash' ? 'فودافون كاش' : (payment === 'instapay' ? 'إنستاباي' : 'أورانج موني');
        
        if (!name || !phone || !email) {
            showNotification('❌ الرجاء إدخال جميع البيانات');
            return;
        }
        
        const productList = cart.map(item => `- ${item.title} (${item.quantity}x) = ${item.price * item.quantity} جنيه`).join('\n');
        const message = `🛒 طلب شراء جديد:\n\n👤 الاسم: ${name}\n📞 رقم التواصل: ${phone}\n📧 البريد: ${email}\n💳 طريقة الدفع: ${paymentText}\n\n📦 المنتجات:\n${productList}\n\n💰 الإجمالي: ${totalPrice} جنيه`;
        
        window.open(`https://wa.me/201555293810?text=${encodeURIComponent(message)}`, '_blank');
        
        cart = [];
        saveCart();
        modal.remove();
        showNotification('✅ تم إرسال طلبك بنجاح');
    };
    
    document.getElementById('closeModalBtn').onclick = () => modal.remove();
}

function addCartIcon() {
    if (document.getElementById('cartIcon')) return;
    const cartIcon = document.createElement('div');
    cartIcon.id = 'cartIcon';
    cartIcon.innerHTML = '🛒 <span id="cartCount">0</span>';
    cartIcon.onclick = showCheckoutPopup;
    document.body.appendChild(cartIcon);
    updateCartCount();
}

const bannerImage = document.getElementById("bannerImage");
const banners = [
    "https://i.ibb.co/Q7sBq2Ld/20260528-074526.jpg",
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200",
    "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1200"
];
let currentBanner = 0;
if (bannerImage) bannerImage.src = banners[currentBanner];
function changeBanner() {
    if (!bannerImage) return;
    bannerImage.style.opacity = 0;
    setTimeout(() => {
        currentBanner = (currentBanner + 1) % banners.length;
        bannerImage.src = banners[currentBanner];
        bannerImage.style.opacity = 1;
    }, 300);
}
setInterval(changeBanner, 4000);

initLoadMoreButton();
initPriceFilter();
addCartIcon();
display(products);
if (window.location.hash === '#openCart') setTimeout(() => showCheckoutPopup(), 500);