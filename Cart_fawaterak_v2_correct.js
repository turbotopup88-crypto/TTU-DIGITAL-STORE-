// ---------------------------------------------------------
// السلة — ربط صحيح 100% مع Fawaterak API v3
// بناءً على التوثيق الرسمي
// ---------------------------------------------------------

const CART_KEY = "store_cart_v1";

// ✅ بيانات Fawaterak الصحيحة
const FAWATERAK_CONFIG = {
  // استخدم staging أولاً للاختبار
  BASE_URL: "https://staging.fawaterk.com", // أو https://app.fawaterk.com في الإنتاج
  
  // OAuth Token Endpoint
  TOKEN_ENDPOINT: "https://staging.fawaterk.com/oauth/token",
  
  // API Endpoints
  API_V3_CREATE_TRANSACTION: "/api/v3/createTransaction",
  API_V3_GET_PAYMENT_METHODS: "/api/v3/getTrPaymentmethods",
  
  // OAuth Client Credentials
  CLIENT_ID: "a26aff7d-9b45-4956-94b3-c222e4ae3bb8",
  CLIENT_SECRET: "YOUR_CLIENT_SECRET", // 👈 استبدل هنا
  
  // Hash Key (للـ Iframe إذا احتجت)
  HASH_KEY: "86d6858a3d2d0a75614ce1cf53fc94d88b7e20bbde34ce1b57",
  PROVIDER_KEY: "FAWATERAK.29711",
  
  // API الخاص بك
  YOUR_API_URL: " https://app.fawaterk.com/oauth/token", // 👈 استبدل هنا
  
  // Currency - من الضروري تحديدها
  CURRENCY: "EGP" // أو أي عملة أخرى (SAR, AED, etc)
};

// متغير عام للـ Access Token
let fawaterkAccessToken = null;
let tokenExpireTime = null;

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
// 🔐 دالة الحصول على OAuth Access Token
// ============================================================
async function getFawaterkAccessToken() {
  // إذا كان عندنا token وما انتهى الوقت، استخدمه
  if (fawaterkAccessToken && tokenExpireTime && Date.now() < tokenExpireTime) {
    console.log("✅ استخدام Access Token موجود");
    return fawaterkAccessToken;
  }

  try {
    console.log("🔄 جلب Access Token من Fawaterak...");

    const response = await fetch(FAWATERAK_CONFIG.TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: FAWATERAK_CONFIG.CLIENT_ID,
        client_secret: FAWATERAK_CONFIG.CLIENT_SECRET
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("❌ فشل الاستجابة:", error);
      throw new Error(`فشل الحصول على Token: ${response.status} - ${error}`);
    }

    const data = await response.json();
    
    if (!data.access_token) {
      throw new Error("لا يوجد access_token في الـ response");
    }

    fawaterkAccessToken = data.access_token;
    // احفظ الـ token لمدة (expires_in - 1 دقيقة)
    tokenExpireTime = Date.now() + ((data.expires_in || 3600) * 1000 - 60000);

    console.log("✅ تم الحصول على Access Token بنجاح");
    return fawaterkAccessToken;

  } catch (error) {
    console.error("❌ خطأ في الحصول على Token:", error);
    throw error;
  }
}

// ============================================================
// 💳 دالة إنشاء معاملة في Fawaterak
// ============================================================
async function createFawaterkTransaction(orderData) {
  try {
    // 1. الحصول على Access Token
    const accessToken = await getFawaterkAccessToken();
    console.log("✅ حصلنا على Access Token");

    // 2. تحضير بيانات المنتجات
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

    // 3. تحضير بيانات الفاتورة (بناءً على التوثيق الصحيح)
    const transactionPayload = {
      cartTotal: orderData.total.toString(),
      currency: FAWATERAK_CONFIG.CURRENCY, // ضروري جداً!
      customer: {
        first_name: orderData.customer.name.split(' ')[0] || orderData.customer.name,
        last_name: orderData.customer.name.split(' ').slice(1).join(' ') || '',
        email: orderData.customer.email || '',
        phone: orderData.customer.phone,
        address: "Not provided"
      },
      cartItems: cartItems,
      redirectionUrls: {
        successUrl: `${FAWATERAK_CONFIG.YOUR_API_URL}/success?orderId=${orderData.orderId}`,
        failUrl: `${FAWATERAK_CONFIG.YOUR_API_URL}/failed?orderId=${orderData.orderId}`,
        pendingUrl: `${FAWATERAK_CONFIG.YOUR_API_URL}/pending?orderId=${orderData.orderId}`,
        webhookUrl: `${FAWATERAK_CONFIG.YOUR_API_URL}/webhook` // هام جداً
      },
      pay_load: {
        order_id: orderData.orderId,
        customer_reference: orderData.customer.phone
      },
      sendEmail: false,
      sendSMS: false
    };

    console.log("📤 إرسال بيانات المعاملة:", transactionPayload);

    // 4. إرسال الطلب إلى Fawaterak
    const url = FAWATERAK_CONFIG.BASE_URL + FAWATERAK_CONFIG.API_V3_CREATE_TRANSACTION;
    console.log("📍 الرابط:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify(transactionPayload)
    });

    console.log("📊 Status:", response.status);

    if (!response.ok) {
      const error = await response.text();
      console.error("❌ فشل الاستجابة:", error);
      throw new Error(`فشل إنشاء المعاملة: ${response.status}`);
    }

    const result = await response.json();
    console.log("✅ استجابة Fawaterak:", result);

    if (!result.data || !result.data.url) {
      throw new Error("لا يوجد رابط دفع في الـ response");
    }

    return {
      intentKey: result.data.intent_key,
      checkoutUrl: result.data.url,
      expiresIn: result.data.expires_in
    };

  } catch (error) {
    console.error("❌ خطأ في إنشاء المعاملة:", error);
    throw error;
  }
}

// ============================================================
// 📋 دالة حفظ الطلب في API الخاص بك
// ============================================================
async function saveOrderToYourAPI(orderData) {
  try {
    const response = await fetch(`${FAWATERAK_CONFIG.YOUR_API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      throw new Error(`فشل حفظ الطلب: ${response.status}`);
    }

    const result = await response.json();
    console.log("✅ تم حفظ الطلب:", result);
    return result;

  } catch (error) {
    console.error("❌ خطأ في حفظ الطلب:", error);
    throw error;
  }
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
        // 1. بناء بيانات الطلب
        const orderData = buildOrderData({ name, phone, email, payment });
        
        // 2. حفظ الطلب في API الخاص بك
        const orderResult = await saveOrderToYourAPI(orderData);
        const orderId = orderResult.orderId || orderResult.id;
        
        console.log("✅ تم إنشاء الطلب:", orderId);

        // 3. إنشاء معاملة في Fawaterak
        const transaction = await createFawaterkTransaction({
          ...orderData,
          orderId
        });

        console.log("✅ تم إنشاء المعاملة:", transaction);

        // 4. مسح السلة
        clearCart();
        closeCart();

        // 5. تحويل إلى صفحة الدفع
        console.log("✅ تحويل إلى صفحة الدفع...");
        console.log("📍 رابط الدفع:", transaction.checkoutUrl);
        
        // استخدم window.location.href للتحويل المباشر
        window.location.href = transaction.checkoutUrl;

      } catch (error) {
        cartCheckout.disabled = false;
        cartCheckout.textContent = originalText;
        
        if (errorEl) {
          errorEl.textContent = "❌ حدث خطأ: " + error.message;
          errorEl.classList.add("show");
        }
        console.error("❌ فشل:", error);
      }
    });
  }
});
