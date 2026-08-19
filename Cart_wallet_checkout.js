diff --git a/Cart_wallet_checkout.js b/Cart_wallet_checkout.js
index 0d9f82ade2ff76e94d83c5849151b99a00ba3468..589a4ea801a3769923b9e42a5bdcb9cc8ea7f88c 100644
--- a/Cart_wallet_checkout.js
+++ b/Cart_wallet_checkout.js
@@ -1,37 +1,31 @@
 // ---------------------------------------------------------
-// السلة — دفع عن طريق تحويل يدوي لمحفظة إلكترونية
-// بيستبدل ملف Cart_fawaterak_v2_correct.js بالكامل
+// السلة — إتمام الطلب عبر واتساب برسالة جاهزة بكل التفاصيل
 // ---------------------------------------------------------
 
 const CART_KEY = "store_cart_v1";
 
-// ⚠️ غيّر ده لرابط الـ Worker بتاعك بعد ما تديبلويه
-const ORDER_API_URL = "https://late-recipe-5391.turbotopup88.wrs.dev";
-
-const WALLET_NUMBER = "01555293810";
-
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
@@ -147,167 +141,125 @@ function renderCartPanel() {
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
-// بناء بيانات الطلب
+// بناء رسالة واتساب للطلب
 // ============================================================
-function buildOrderData(customer) {
+function buildCartWhatsAppMessage(customer) {
   const cart = getCart();
   const ids = Object.keys(cart).filter((id) => PRODUCTS[id]);
+  const orderRef = `TTU-${Date.now().toString().slice(-8)}`;
 
-  const items = ids.map((id) => {
+  const itemLines = ids.flatMap((id, index) => {
     const p = PRODUCTS[id];
     const qty = cart[id];
-    return {
-      productId: id,
-      productName: p.name,
-      quantity: qty,
-      price: p.price,
-      subtotal: p.price * qty,
-    };
+    return [
+      `${index + 1}) ${localized(p.name, p.nameEn)}`,
+      `   الكمية: ${qty}`,
+      `   سعر الوحدة: ${p.price} ${currencyText(p)}`,
+      `   الإجمالي الفرعي: ${p.price * qty} ${currencyText(p)}`,
+    ];
   });
 
-  return {
-    customer: {
-      name: customer.name,
-      phone: customer.phone,
-      email: customer.email,
-    },
-    items,
-    total: getCartTotal(),
-  };
+  return [
+    "طلب جديد من السلة 🛒",
+    "-----------------------",
+    `رقم الطلب: ${orderRef}`,
+    "",
+    "بيانات العميل:",
+    `الاسم: ${customer.name}`,
+    `رقم الهاتف: ${customer.phone}`,
+    customer.email ? `البريد الإلكتروني للتسليم: ${customer.email}` : null,
+    "",
+    "تفاصيل المنتجات:",
+    ...itemLines,
+    "",
+    "تفاصيل الدفع:",
+    "طريقة الدفع: عبر واتساب / يتم التأكيد مع المتجر",
+    `الإجمالي النهائي: ${getCartTotal()} ${currencyLabel()}`,
+    "",
+    "من فضلك أكد توفر المنتجات وطريقة الدفع المناسبة لإتمام الطلب.",
+  ].filter(Boolean).join("\n");
 }
 
-// ============================================================
-// إرسال الطلب للـ Worker
-// ============================================================
-async function submitOrder(orderData) {
-  const res = await fetch(ORDER_API_URL, {
-    method: "POST",
-    headers: { "Content-Type": "application/json" },
-    body: JSON.stringify(orderData),
-  });
-  const result = await res.json();
-  if (!res.ok || result.error) {
-    throw new Error(result.error || "حدث خطأ أثناء إرسال الطلب");
-  }
-  return result;
-}
-
-// ============================================================
-// شاشة تعليمات الدفع بعد نجاح إرسال الطلب
-// ============================================================
-function showWalletInstructions(orderId, total) {
-  const body = document.getElementById("cart-body");
-  const footer = document.getElementById("cart-footer");
-  footer.style.display = "none";
-
-  body.innerHTML = `
-    <div style="text-align:center;padding:20px 10px;">
-      <div style="font-size:40px;margin-bottom:10px;">💳</div>
-      <h3 style="margin-bottom:10px;">تم استلام طلبك رقم ${orderId}</h3>
-      <p style="color:var(--text-dim);margin-bottom:16px;">
-        حوّل مبلغ <b style="color:var(--green);">${total} ${currencyLabel()}</b> على رقم المحفظة الإلكترونية:
-      </p>
-      <div style="background:var(--card);border:1px solid var(--card-border);border-radius:12px;padding:14px;font-size:20px;font-weight:800;letter-spacing:1px;margin-bottom:16px;">
-        ${WALLET_NUMBER}
-      </div>
-      <p style="color:var(--text-dim);font-size:13px;">
-        بعد التحويل هيتم تأكيد طلبك وهيوصلك إيميل تأكيد، والمنتج الرقمي هيوصلك على بريدك الإلكتروني خلال ساعتين بحد أقصى.
-      </p>
-    </div>
-  `;
+function buildCartWhatsAppUrl(customer) {
+  const message = encodeURIComponent(buildCartWhatsAppMessage(customer));
+  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
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
-    cartCheckout.addEventListener("click", async () => {
+    cartCheckout.addEventListener("click", () => {
       if (getCartCount() === 0) return;
 
       const nameEl = document.getElementById("cart-name");
       const phoneEl = document.getElementById("cart-phone");
       const emailEl = document.getElementById("cart-email");
       const errorEl = document.getElementById("cart-form-error");
 
       const name = nameEl ? nameEl.value.trim() : "";
       const phone = phoneEl ? phoneEl.value.trim() : "";
       const email = emailEl ? emailEl.value.trim() : "";
 
-      // الإيميل بقى إلزامي لأن تسليم المنتج هيبقى عليه
-      if (!name || !phone || !email) {
+      // الاسم والهاتف مطلوبين لفتح واتساب برسالة طلب كاملة
+      if (!name || !phone) {
         if (errorEl) {
-          errorEl.textContent = "من فضلك عبئ الاسم والهاتف والإيميل (هيتم تسليم المنتج عليه)";
+          errorEl.textContent = "من فضلك عبئ الاسم ورقم الهاتف قبل فتح واتساب";
           errorEl.classList.add("show");
         }
         if (fieldsBox && !fieldsBox.classList.contains("open")) {
           fieldsBox.classList.add("open");
           if (fieldsToggle) fieldsToggle.classList.add("open");
         }
         return;
       }
       if (errorEl) errorEl.classList.remove("show");
 
-      const originalText = cartCheckout.textContent;
-      cartCheckout.disabled = true;
-      cartCheckout.textContent = "جاري الإرسال...";
-
-      try {
-        const orderData = buildOrderData({ name, phone, email });
-        const result = await submitOrder(orderData);
-
-        clearCart();
-        showWalletInstructions(result.orderId, orderData.total);
-      } catch (error) {
-        cartCheckout.disabled = false;
-        cartCheckout.textContent = originalText;
-        if (errorEl) {
-          errorEl.textContent = "❌ حدث خطأ: " + error.message;
-          errorEl.classList.add("show");
-        }
-      }
+      const url = buildCartWhatsAppUrl({ name, phone, email });
+      window.open(url, "_blank");
     });
   }
 });
