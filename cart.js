// ---------------------------------------------------------
// السلة — يعمل عبر كل صفحات الموقع (يخزن في localStorage)
// يعتمد على وجود PRODUCTS من products.js
// ---------------------------------------------------------
const CART_KEY = "store_cart_v1";
const API_BASE_URL = "https://app.fawaterk.com/oauth/token"; // ✅ عدّل الـ URL حسب API الخاص بك

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(id, qty = 1) {
  const cart = getCart();
  // ✅ تحقق من أن المنتج موجود في PRODUCTS قبل الإضافة
  if (!PRODUCTS[id]) {
    console.warn(`⚠️ المنتج ${id} غير موجود في PRODUCTS`);
    return false;
  }
  cart[id] = (cart[id] || 0) + qty;
  saveCart(cart);
  return true;
}

function setQty(id, qty) {
  const cart = getCart();
  if (qty <= 0) {
    delete cart[id];
  } else {
    cart[id] = qty;
  }
  saveCart(cart);
  renderCartPanel();
}

function removeFromCart(id) {
  const cart = getCart();
  delete cart[id];
  saveCart(cart);
  renderCartPanel();
  updateCartBadge();
}

// ✅ دالة جديدة: حساب الكمية فقط للمنتجات الموجودة
function getCartCount() {
  const cart = getCart();
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    // عد فقط المنتجات الموجودة في PRODUCTS
    return PRODUCTS[id] ? sum + qty : sum;
  }, 0);
}

function getCartTotal() {
  const cart = getCart();
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = PRODUCTS[id];
    return p ? sum + p.price * qty : sum;
  }, 0);
}

function currencyLabel() {
  const first = Object.values(PRODUCTS)[0];
  return first ? currencyText(first) : "";
}

function paymentMethodLabel(value) {
  const map = { bank: t("paymentBank"), wallet: t("paymentWallet"), cash: t("paymentCash") };
  return map[value] || value;
}

function updateCartBadge() {
  const badge = document.getElementById("cart-count");
  if (!badge) return;
  const count = getCartCount(); // ✅ استخدم الدالة المحدثة
  badge.textContent = count;
  badge.style.display = count > 0 ? "flex" : "none";
}

function renderCartPanel() {
  const body = document.getElementById("cart-body");
  const footer = document.getElementById("cart-footer");
  if (!body) return;

  const cart = getCart();
  // ✅ فلتر أقوى: التأكد من وجود المنتج في PRODUCTS
  const ids = Object.keys(cart).filter((id) => {
    if (!PRODUCTS[id]) {
      console.warn(`⚠️ حذف منتج غير موجود من السلة: ${id}`);
      delete cart[id]; // احذفه من السلة إذا لم يكن موجود
      return false;
    }
    return true;
  });

  // اذا تم حذف أي منتجات، احفظ السلة المنظفة
  if (Object.keys(cart).length !== Object.keys(getCart()).length) {
    saveCart(cart);
  }

  if (ids.length === 0) {
    body.innerHTML = `<p class="cart-empty">${t('cartEmpty')}</p>`;
    footer.style.display = "none";
    return;
  }

  body.innerHTML = ids
    .map((id) => {
      const p = PRODUCTS[id];
      const qty = cart[id];
      const name = localized(p.name, p.nameEn);
      return `
        <div class="cart-item" data-id="${id}">
          <img src="${p.image}" alt="${name}">
          <div class="cart-item-info">
            <h4>${name}</h4>
            <span>${p.price} ${currencyText(p)}</span>
            <div class="cart-qty">
              <button class="cart-qty-btn" data-action="minus" aria-label="-">−</button>
              <span>${qty}</span>
              <button class="cart-qty-btn" data-action="plus" aria-label="+">+</button>
            </div>
          </div>
          <button class="cart-remove" aria-label="x">✕</button>
        </div>`;
    })
    .join("");

  footer.style.display = "flex";
  document.getElementById("cart-total").textContent = `${getCartTotal()} ${currencyLabel()}`;

  body.querySelectorAll(".cart-qty-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.closest(".cart-item").dataset.id;
      const cart = getCart();
      const delta = btn.dataset.action === "plus" ? 1 : -1;
      setQty(id, (cart[id] || 0) + delta);
    });
  });

  body.querySelectorAll(".cart-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.closest(".cart-item").dataset.id;
      removeFromCart(id);
    });
  });
}

function openCart() {
  // ✅ تحقق من تحميل PRODUCTS قبل فتح السلة
  if (!PRODUCTS || Object.keys(PRODUCTS).length === 0) {
    console.error("❌ PRODUCTS لم تحمل بعد!");
    return;
  }
  renderCartPanel();
  document.getElementById("cart-drawer").classList.add("open");
  document.getElementById("cart-overlay").classList.add("open");
}

function closeCart() {
  document.getElementById("cart-drawer").classList.remove("open");
  document.getElementById("cart-overlay").classList.remove("open");
}

// ✅ دالة جديدة: بناء بيانات الطلب
function buildOrderData(customer) {
  const cart = getCart();
  const ids = Object.keys(cart).filter((id) => PRODUCTS[id]);
  
  const items = ids.map((id) => {
    const p = PRODUCTS[id];
    const qty = cart[id];
    return {
      productId: id,
      productName: p.name,
      quantity: qty,
      price: p.price,
      subtotal: p.price * qty
    };
  });

  return {
    customer: {
      name: customer.name,
      phone: customer.phone,
      email: customer.email || null
    },
    items: items,
    total: getCartTotal(),
    paymentMethod: customer.payment,
    orderDate: new Date().toISOString()
  };
}

// ✅ دالة جديدة: إرسال الطلب إلى API
async function submitOrderToAPI(orderData) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log("✅ تم إرسال الطلب بنجاح:", result);
    return result; // قد يحتوي على orderId أو invoiceId
  } catch (error) {
    console.error("❌ خطأ في إرسال الطلب:", error);
    throw error;
  }
}

// ✅ دالة جديدة: مسح السلة بعد الطلب
function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
  console.log("✅ تم مسح السلة");
}

// ---------- ربط أزرار السلة الثابتة في الهيدر ----------
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();

  const cartBtn = document.getElementById("cart-btn");
  const cartClose = document.getElementById("cart-close");
  const cartOverlay = document.getElementById("cart-overlay");
  const cartCheckout = document.getElementById("cart-checkout");
  const fieldsToggle = document.getElementById("cart-fields-toggle");
  const fieldsBox = document.getElementById("cart-checkout-fields");

  if (cartBtn) cartBtn.addEventListener("click", openCart);
  if (cartClose) cartClose.addEventListener("click", closeCart);
  if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

  if (fieldsToggle && fieldsBox) {
    fieldsToggle.addEventListener("click", () => {
      fieldsBox.classList.toggle("open");
      fieldsToggle.classList.toggle("open");
    });
  }

  if (cartCheckout) {
    cartCheckout.addEventListener("click", async () => {
      if (getCartCount() === 0) {
        console.warn("⚠️ السلة فارغة!");
        return;
      }

      const nameEl = document.getElementById("cart-name");
      const phoneEl = document.getElementById("cart-phone");
      const emailEl = document.getElementById("cart-email");
      const paymentEl = document.getElementById("cart-payment");
      const errorEl = document.getElementById("cart-form-error");

      const name = nameEl ? nameEl.value.trim() : "";
      const phone = phoneEl ? phoneEl.value.trim() : "";
      const email = emailEl ? emailEl.value.trim() : "";
      const payment = paymentEl ? paymentEl.value : "";

      // ✅ التحقق من صحة البيانات
      if (!name || !phone || !payment) {
        if (errorEl) errorEl.classList.add("show");
        if (fieldsBox && !fieldsBox.classList.contains("open")) {
          fieldsBox.classList.add("open");
          if (fieldsToggle) fieldsToggle.classList.add("open");
        }
        if (!name && nameEl) nameEl.focus();
        else if (!phone && phoneEl) phoneEl.focus();
        else if (!payment && paymentEl) paymentEl.focus();
        return;
      }
      if (errorEl) errorEl.classList.remove("show");

      // ✅ إضافة حالة تحميل على الزر
      const originalText = cartCheckout.textContent;
      cartCheckout.disabled = true;
      cartCheckout.textContent = "جاري المعالجة...";

      try {
        // بناء بيانات الطلب
        const orderData = buildOrderData({ name, phone, email, payment });
        
        // إرسال الطلب إلى API
        const result = await submitOrderToAPI(orderData);
        
        // ✅ مسح السلة بعد النجاح
        clearCart();
        closeCart();
        
        // ✅ تحويل إلى صفحة الفواتير مع معرف الطلب
        const invoiceId = result.orderId || result.id || result.invoiceId;
        const invoiceUrl = `/invoices?orderId=${invoiceId}`;
        
        console.log("✅ تم إرسال الطلب وتحويل إلى صفحة الفواتير");
        window.location.href = invoiceUrl;
        
      } catch (error) {
        // إعادة حالة الزر في حالة الخطأ
        cartCheckout.disabled = false;
        cartCheckout.textContent = originalText;
        
        if (errorEl) {
          errorEl.textContent = "حدث خطأ في إرسال الطلب. حاول مرة أخرى.";
          errorEl.classList.add("show");
        }
        console.error("❌ فشل إرسال الطلب:", error);
      }
    });
  }
});
