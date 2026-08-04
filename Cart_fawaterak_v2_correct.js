// ---------------------------------------------------------
// السلة — ربط مباشر وآمن عبر Cloudflare Worker مع Fawaterak
// ---------------------------------------------------------

const CART_KEY = "store_cart_v1";

const FAWATERAK_CONFIG = {
  // رابط Cloudflare Worker الوسيط
  PROXY_BASE_URL: "https://fawaterak-proxy.turbotopup88.workers.dev",
  
  // يكتشف رابط الموقع الحالي تلقائياً للتحويل بعد الدفع
  SITE_URL: window.location.origin, 
  
  CURRENCY: "EGP"
};

// ============================================================
// دوال السلة الأساسية
// ============================================================

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
  if (!PRODUCTS[id]) {
    console.warn(`⚠️ المنتج ${id} غير موجود`);
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

function getCartCount() {
  const cart = getCart();
  return Object.entries(cart).reduce((sum, [id, qty]) => {
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

function updateCartBadge() {
  const badge = document.getElementById("cart-count");
  if (!badge) return;
  const count = getCartCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? "flex" : "none";
}

function renderCartPanel() {
  const body = document.getElementById("cart-body");
  const footer = document.getElementById("cart-footer");
  if (!body) return;

  const cart = getCart();
  const ids = Object.keys(cart).filter((id) => {
    if (!PRODUCTS[id]) {
      console.warn(`⚠️ حذف منتج غير موجود: ${id}`);
      delete cart[id];
      return false;
    }
    return true;
  });

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

// ============================================================
// 💳 دالة إنشاء معاملة الدفع (المُحدثة بالكامل)
// ============================================================
async function createFawaterkTransaction(orderData) {
  try {
    const cart = getCart();
    const cartItems = Object.entries(cart)
      .filter(([id]) => PRODUCTS[id])
      .map(([id, qty]) => {
        const p = PRODUCTS[id];
        return {
          name: p.name || `Product ${id}`,
          price: p.price.toString(),
          quantity: qty.toString()
        };
      });

    const nameParts = (orderData.customer.name || "").trim().split(' ');
    
    const transactionPayload = {
      payment_method_id: 3, // 3 للدفع بالبطاقات (تأكد من اختيار وسيلة الدفع من لوحة فواتيرك)
      cartTotal: orderData.total.toString(),
      currency: FAWATERAK_CONFIG.CURRENCY,
      customer: {
        first_name: nameParts[0] || orderData.customer.name,
        last_name: nameParts.slice(1).join(' ') || 'Customer',
        email: orderData.customer.email || 'customer@example.com',
        phone: orderData.customer.phone || "01000000000",
        address: "Cairo"
      },
      cartItems: cartItems,
      redirectionUrls: {
        successUrl: `${FAWATERAK_CONFIG.SITE_URL}/?status=success&orderId=${orderData.orderId}`,
        failUrl: `${FAWATERAK_CONFIG.SITE_URL}/?status=failed&orderId=${orderData.orderId}`,
        pendingUrl: `${FAWATERAK_CONFIG.SITE_URL}/?status=pending&orderId=${orderData.orderId}`
      }
    };

    console.log("📤 إرسال البيانات إلى Worker:", transactionPayload);

    const response = await fetch(`${FAWATERAK_CONFIG.PROXY_BASE_URL}/api/v3/createTransaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(transactionPayload)
    });

    const result = await response.json();
    console.log("🔍 الاستجابة الكاملة من فواتيرك:", result);

    // التحقق مما إذا كانت فواتيرك قد أرجعت خطأ في البيانات
    if (result.status === "failure" || result.status === "error" || result.error) {
      const errorMsg = result.message || (result.error && result.error.message) || JSON.stringify(result);
      throw new Error(`رد فواتيرك: ${errorMsg}`);
    }

    // استخراج رابط الدفع بجميع المسارات المحتملة من فواتيرك
    const checkoutUrl = 
      result.data?.payment_data?.redirectTo ||
      result.data?.url ||
      result.start_pay_url ||
      result.invoice_url ||
      (result.data?.invoice_key ? `https://fawaterk.com/invoice/${result.data.invoice_key}` : null);

    if (!checkoutUrl) {
      console.error("❌ تفاصيل الاستجابة المعطلة:", result);
      throw new Error(result.message || "لم يتم استلام رابط الدفع، افحص الـ Console لمعرفة رد بوابة فواتيرك");
    }

    return { checkoutUrl };

  } catch (error) {
    console.error("❌ خطأ في عملية الدفع:", error);
    throw error;
  }
}

// ============================================================
// 📋 دالة حفظ الطلب محلياً
// ============================================================
async function saveOrderToYourAPI(orderData) {
  const generatedId = "ORD-" + Date.now();
  console.log("📦 تم تجهيز رقم الطلب محلياً:", generatedId);
  return { orderId: generatedId };
}

// ============================================================
// 🛒 دالة بناء بيانات الطلب
// ============================================================
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

// ============================================================
// ✅ دالة مسح السلة
// ============================================================
function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
  console.log("✅ تم مسح السلة");
}

// ============================================================
// 🎯 معالج زر الشراء الرئيسي
// ============================================================
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

      if (!name || !phone || !payment) {
        if (errorEl) {
          errorEl.textContent = "الرجاء ملء جميع الحقول المطلوبة";
          errorEl.classList.add("show");
        }
        if (fieldsBox && !fieldsBox.classList.contains("open")) {
          fieldsBox.classList.add("open");
          if (fieldsToggle) fieldsToggle.classList.add("open");
        }
        return;
      }
      if (errorEl) errorEl.classList.remove("show");

      const originalText = cartCheckout.textContent;
      cartCheckout.disabled = true;
      cartCheckout.textContent = "جاري المعالجة...";

      try {
        console.log("🚀 بدء عملية الشراء...");
        
        const initialOrderData = buildOrderData({ name, phone, email, payment });
        const orderResult = await saveOrderToYourAPI(initialOrderData);
        const orderId = orderResult.orderId;

        const transaction = await createFawaterkTransaction({
          ...initialOrderData,
          orderId
        });

        clearCart();
        closeCart();

        console.log("📍 التحويل لصفحة فواتيرك:", transaction.checkoutUrl);
        window.location.href = transaction.checkoutUrl;

      } catch (error) {
        cartCheckout.disabled = false;
        cartCheckout.textContent = originalText;
        
        if (errorEl) {
          errorEl.textContent = "❌ حدث خطأ: " + error.message;
          errorEl.classList.add("show");
        }
        console.error("❌ فشل الشراء:", error);
      }
    });
  }
});
