// ---------------------------------------------------------
// السلة — دفع عن طريق تحويل يدوي لمحفظة إلكترونية
// بيستبدل ملف Cart_fawaterak_v2_correct.js بالكامل
// ---------------------------------------------------------

const CART_KEY = "store_cart_v1";

// ⚠️ غيّر ده لرابط الـ Worker بتاعك بعد ما تديبلويه
const ORDER_API_URL = "https://late-recipe-5391.turbotopup88.wrs.dev";

const WALLET_NUMBER = "01555293810";

// ============================================================
// دوال السلة الأساسية (زي ما هي)
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
  if (!PRODUCTS || Object.keys(PRODUCTS).length === 0) return;
  renderCartPanel();
  document.getElementById("cart-drawer").classList.add("open");
  document.getElementById("cart-overlay").classList.add("open");
}

function closeCart() {
  document.getElementById("cart-drawer").classList.remove("open");
  document.getElementById("cart-overlay").classList.remove("open");
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

// ============================================================
// بناء بيانات الطلب
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
      subtotal: p.price * qty,
    };
  });

  return {
    customer: {
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
    },
    items,
    total: getCartTotal(),
  };
}

// ============================================================
// إرسال الطلب للـ Worker
// ============================================================
async function submitOrder(orderData) {
  const res = await fetch(ORDER_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  const result = await res.json();
  if (!res.ok || result.error) {
    throw new Error(result.error || "حدث خطأ أثناء إرسال الطلب");
  }
  return result;
}

// ============================================================
// شاشة تعليمات الدفع بعد نجاح إرسال الطلب
// ============================================================
function showWalletInstructions(orderId, total) {
  const body = document.getElementById("cart-body");
  const footer = document.getElementById("cart-footer");
  footer.style.display = "none";

  body.innerHTML = `
    <div style="text-align:center;padding:20px 10px;">
      <div style="font-size:40px;margin-bottom:10px;">💳</div>
      <h3 style="margin-bottom:10px;">تم استلام طلبك رقم ${orderId}</h3>
      <p style="color:var(--text-dim);margin-bottom:16px;">
        حوّل مبلغ <b style="color:var(--green);">${total} ${currencyLabel()}</b> على رقم المحفظة الإلكترونية:
      </p>
      <div style="background:var(--card);border:1px solid var(--card-border);border-radius:12px;padding:14px;font-size:20px;font-weight:800;letter-spacing:1px;margin-bottom:16px;">
        ${WALLET_NUMBER}
      </div>
      <p style="color:var(--text-dim);font-size:13px;">
        بعد التحويل هيتم تأكيد طلبك وهيوصلك إيميل تأكيد، والمنتج الرقمي هيوصلك على بريدك الإلكتروني خلال ساعتين بحد أقصى.
      </p>
    </div>
  `;
}

// ============================================================
// معالج زر الشراء الرئيسي
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
      if (getCartCount() === 0) return;

      const nameEl = document.getElementById("cart-name");
      const phoneEl = document.getElementById("cart-phone");
      const emailEl = document.getElementById("cart-email");
      const errorEl = document.getElementById("cart-form-error");

      const name = nameEl ? nameEl.value.trim() : "";
      const phone = phoneEl ? phoneEl.value.trim() : "";
      const email = emailEl ? emailEl.value.trim() : "";

      // الإيميل بقى إلزامي لأن تسليم المنتج هيبقى عليه
      if (!name || !phone || !email) {
        if (errorEl) {
          errorEl.textContent = "من فضلك عبئ الاسم والهاتف والإيميل (هيتم تسليم المنتج عليه)";
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
      cartCheckout.textContent = "جاري الإرسال...";

      try {
        const orderData = buildOrderData({ name, phone, email });
        const result = await submitOrder(orderData);

        clearCart();
        showWalletInstructions(result.orderId, orderData.total);
      } catch (error) {
        cartCheckout.disabled = false;
        cartCheckout.textContent = originalText;
        if (errorEl) {
          errorEl.textContent = "❌ حدث خطأ: " + error.message;
          errorEl.classList.add("show");
        }
      }
    });
  }
});
