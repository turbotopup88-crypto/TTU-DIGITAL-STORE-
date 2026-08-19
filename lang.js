diff --git a/lang.js b/lang.js
index 7a631590a13e796f99877ddefa245ce1d3533b76..b9b9ab5074438770b3265fed209f493dc13b7f9e 100644
--- a/lang.js
+++ b/lang.js
@@ -7,114 +7,114 @@ const LANG_KEY = "site_lang";
 const I18N = {
   ar: {
     dir: "rtl",
     searchPlaceholder: "ابحث عن منتج...",
     categoriesTitle: "تصفح حسب الفئة",
     productsTitle: "كل المنتجات",
     menuLabel: "القائمة",
     homeLink: "الرئيسية",
     giftCardsPromoTitle: "بطاقات هدايا رقمية",
     viewAllGiftCards: "عرض كل البطاقات",
     giftCardsComingSoon: "قريباً — بطاقات هدايا رقمية متنوعة",
     offersLink: "الخصومات",
     offersTitle: "الخصومات",
     offersEmpty: "لا توجد عروض حالياً، تابعنا قريباً",
     addToCart: "للسلة",
     added: "أُضيف",
     cartTitle: "سلتك",
     cartEmpty: "السلة فارغة",
     total: "الإجمالي",
     checkout: "🟢 إتمام الطلب عبر واتساب",
     noResults: "لا توجد نتائج مطابقة",
     noResultsFor: (term) => `لا توجد منتجات مطابقة لـ "${term}"`,
     showAllResults: (n) => `عرض كل النتائج (${n})`,
     unit: "/ للنسخة الواحدة",
     orderFormTitle: "أكمل طلبك",
-    customerInfoLabel: "بيانات التواصل وطريقة الدفع",
+    customerInfoLabel: "بيانات التواصل للطلب عبر واتساب",
     nameLabel: "الاسم الكامل",
     namePlaceholder: "اكتب اسمك",
     phoneLabel: "رقم الهاتف",
     paymentLabel: "طريقة الدفع",
     paymentChoose: "اختر طريقة الدفع",
     paymentBank: "تحويل مصرفي",
     paymentWallet: "محفظة إلكترونية",
     paymentCash: "نقداً عند الاستلام",
     notesLabel: "ملاحظات (اختياري)",
     notesPlaceholder: "أي تفاصيل إضافية",
     emailLabel: "البريد الإلكتروني (اختياري)",
     emailPlaceholder: "example@email.com",
     qtyLabel: "الكمية",
-    orderErrorMsg: "من فضلك عبئ الاسم، الهاتف وطريقة الدفع.",
+    orderErrorMsg: "من فضلك عبئ الاسم ورقم الهاتف.",
     orderBtn: "اطلب الآن عبر واتساب",
     orderNote: "سيتم فتح واتساب برسالة تحتوي تفاصيل طلبك جاهزة للإرسال.",
     backLink: "→ العودة للمتجر",
     notFoundTitle: "المنتج غير موجود",
     outOfStock: "غير متوفر",
     outOfStockNote: "هذا المنتج غير متوفر حالياً",
     footerPrivacy: "سياسة الخصوصية",
     footerReturns: "سياسة الاستبدال والاسترجاع",
     footerCopy: "© 2026 جميع الحقوق محفوظة",
   },
   en: {
     dir: "ltr",
     searchPlaceholder: "Search for a product...",
     categoriesTitle: "Shop by category",
     productsTitle: "All Products",
     menuLabel: "Menu",
     homeLink: "Home",
     giftCardsPromoTitle: "Digital Gift Cards",
     viewAllGiftCards: "View all gift cards",
     giftCardsComingSoon: "Coming soon — a variety of digital gift cards",
     offersLink: "Offers",
     offersTitle: "Offers",
     offersEmpty: "No offers right now, check back soon",
     addToCart: "Add",
     added: "Added",
     cartTitle: "Your cart",
     cartEmpty: "Your cart is empty",
     total: "Total",
     checkout: "🟢 Checkout via WhatsApp",
     noResults: "No matching products",
     noResultsFor: (term) => `No products match "${term}"`,
     showAllResults: (n) => `Show all results (${n})`,
     unit: "/ per copy",
     orderFormTitle: "Complete your order",
-    customerInfoLabel: "Contact & payment details",
+    customerInfoLabel: "Contact details for WhatsApp order",
     nameLabel: "Full name",
     namePlaceholder: "Enter your name",
     phoneLabel: "Phone number",
     paymentLabel: "Payment method",
     paymentChoose: "Choose payment method",
     paymentBank: "Bank transfer",
     paymentWallet: "E-wallet",
     paymentCash: "Cash on delivery",
     notesLabel: "Notes (optional)",
     notesPlaceholder: "Any extra details",
     emailLabel: "Email (optional)",
     emailPlaceholder: "example@email.com",
     qtyLabel: "Quantity",
-    orderErrorMsg: "Please fill in your name, phone, and payment method.",
+    orderErrorMsg: "Please fill in your name and phone number.",
     orderBtn: "Order now via WhatsApp",
     orderNote: "WhatsApp will open with your order details ready to send.",
     backLink: "→ Back to store",
     notFoundTitle: "Product not found",
     outOfStock: "Out of stock",
     outOfStockNote: "This product is currently unavailable",
     footerPrivacy: "Privacy Policy",
     footerReturns: "Returns & Refunds Policy",
     footerCopy: "© 2026 All rights reserved",
   }
 };
 
 function getLang() {
   const saved = localStorage.getItem(LANG_KEY);
   return saved === "en" ? "en" : "ar";
 }
 
 function t(key) {
   const lang = getLang();
   const dict = I18N[lang] || I18N.ar;
   return dict[key] !== undefined ? dict[key] : (I18N.ar[key] || key);
 }
 
 // يرجع النص العربي أو الإنجليزي حسب اللغة الحالية، مع Fallback للعربي لو مفيش ترجمة
 function localized(arText, enText) {
