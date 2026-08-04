// ---------------------------------------------------------
// السلة — يعمل عبر كل صفحات الموقع (يخزن في localStorage)
// ربط مع منصة فاتورتك
// ---------------------------------------------------------
const CART_KEY = "store_cart_v1";
const YOUR_API_URL = "https://your-website.com/api"; // ✅ API الخاص بك فقط للتسجيل

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

function paymentMethodLabel(value) {
  const map = { bank: t("paymentBank"), wallet: t("paymentWallet"), cash: t("paymentCash") };
  return map[value] || value;
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
      console.warn(`⚠️ حذف منتج غير موجود من السلة: ${id}`);
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

// ✅ دالة جديدة: بناء بيانات الطلب للإرسال إلى API الخاص بك
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

// ✅ دالة جديدة: إرسال الطلب إلى API الخاص بك (للتسجيل فقط)
async function createOrderInYourAPI(orderData) {
  try {
    const response = await fetch(`${YOUR_API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const result = await response.json();
    console.log("✅ تم حفظ الطلب في قاعدة البيانات:", result);
    return result; // يحتوي على orderId
  } catch (error) {
    console.error("❌ خطأ في حفظ الطلب:", error);
    throw error;
  }
}

// ✅ دالة جديدة: توليد رابط الدفع من فاتورتك
function generateFatorahPaymentLink(orderId, customer, total, items) {
  // بيانات فاتورتك
  const FATOURAH_API_KEY = "YOUR_FATOURAH_API_KEY"; // ✅ استخدم API Key من فاتورتك
  const FATOURAH_MERCHANT_CODE = "YOUR_MERCHANT_CODE"; // ✅ استخدم Merchant Code

  // بناء بيانات الفاتورة لفاتورتك
  const invoiceData = {
    InvoiceAmount: total,
    CustomerName: customer.name,
    CustomerPhone: customer.phone,
    CustomerEmail: customer.email,
    NotificationOption: "Email", // أو Sms أو Both
    DisplayCurrencyIso: "SAR", // ✅ عدّل حسب العملة
    Items: items.map(item => ({
      ItemName: item.productName,
      ItemQuantity: item.quantity,
      ItemPrice: item.price
    })),
    MerchantCode: FATOURAH_MERCHANT_CODE,
    InvoiceReferenceID: orderId,
    CallBackUrl: `https://your-website.com/api/fatourah-callback`, // ✅ رابط التحديث
    ErrorUrl: `https://your-website.com/cart` // ✅ في حالة الخطأ
  };

  // ✅ الطريقة الأولى: استخدام window.location مباشرة (الأسهل)
  // فاتورتك سيوفر رابط بسيط
  return `https://app.fatourah.com/checkout/${FATOURAH_MERCHANT_CODE}/${orderId}`;
}

// ✅ دالة جديدة: مسح السلة
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

      // ✅ تغيير حالة الزر
      const originalText = cartCheckout.textContent;
      cartCheckout.disabled = true;
      cartCheckout.textContent = "جاري المعالجة...";

      try {
        // 1️⃣ بناء بيانات الطلب
        const orderData = buildOrderData({ name, phone, email, payment });
        
        // 2️⃣ حفظ الطلب في API الخاص بك (قاعدة البيانات)
        const orderResult = await createOrderInYourAPI(orderData);
        const orderId = orderResult.orderId || orderResult.id;
        
        console.log("✅ تم إنشاء الطلب:", orderId);

        // 3️⃣ إنشاء رابط الدفع من فاتورتك
        const paymentLink = generateFatorahPaymentLink(
          orderId, 
          { name, phone, email }, 
          getCartTotal(),
          orderData.items
        );

        // 4️⃣ مسح السلة
        clearCart();
        closeCart();

        // 5️⃣ تحويل إلى صفحة الدفع على فاتورتك
        console.log("✅ تحويل إلى صفحة الدفع...");
        window.location.href = paymentLink;

      } catch (error) {
        // إعادة حالة الزر
        cartCheckout.disabled = false;
        cartCheckout.textContent = originalText;
        
        if (errorEl) {
          errorEl.textContent = "حدث خطأ. حاول مرة أخرى.";
          errorEl.classList.add("show");
        }
        console.error("❌ فشل:", error);
      }
    });
  }
});
