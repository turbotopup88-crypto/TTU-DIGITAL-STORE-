// ---------------------------------------------------------
// تبديل اللغة (عربي / إنجليزي) — يعمل عبر كل صفحات الموقع
// اللغة المختارة تتخزن في localStorage وتفضل ثابتة بين الصفحات
// ---------------------------------------------------------
const LANG_KEY = "site_lang";

const I18N = {
  ar: {
    dir: "rtl",
    searchPlaceholder: "ابحث عن منتج...",
    categoriesTitle: "تصفح حسب الفئة",
    productsTitle: " منتجات عشوائية",
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
    customerInfoLabel: "بيانات التواصل وطريقة الدفع",
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
    orderErrorMsg: "من فضلك عبئ الاسم، الهاتف وطريقة الدفع.",
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
    productsTitle: " Random products  ",
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
    customerInfoLabel: "Contact & payment details",
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
    orderErrorMsg: "Please fill in your name, phone, and payment method.",
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
  return getLang() === "en" && enText ? enText : arText;
}

// يرجع اسم العملة بالعربي أو الإنجليزي حسب اللغة الحالية
// يدعم الشكل الجديد {ar, en} والشكل القديم (نص عادي) لتوافق أي بيانات قديمة
function currencyText(product) {
  if (!product || !product.currency) return "";
  if (typeof product.currency === "string") return product.currency;
  return getLang() === "en" ? product.currency.en : product.currency.ar;
}

function applyDocumentDirection() {
  const lang = getLang();
  document.documentElement.setAttribute("lang", lang);
  document.documentElement.setAttribute("dir", I18N[lang].dir);
}

function applyStaticI18n() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
  });
}

function setupLangToggle() {
  const btn = document.getElementById("lang-toggle");
  if (!btn) return;
  const badge = document.getElementById("lang-badge");
  const current = getLang();
  const target = current === "ar" ? "en" : "ar";

  if (badge) badge.textContent = target.toUpperCase();
  btn.setAttribute(
    "aria-label",
    current === "ar" ? "Switch to English" : "التبديل إلى العربية"
  );

  btn.addEventListener("click", () => {
    const next = getLang() === "ar" ? "en" : "ar";
    localStorage.setItem(LANG_KEY, next);
    location.reload();
  });
}

// تُنفَّذ فوراً (قبل رسم باقي الصفحة) عشان الاتجاه يتظبط بدري وميحصلش وميض
applyDocumentDirection();

document.addEventListener("DOMContentLoaded", () => {
  applyStaticI18n();
  setupLangToggle();
});
