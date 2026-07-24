// ⚠️ ضع رقم الواتساب هنا بالصيغة الدولية بدون + وبدون صفر في البداية
// مثال: رقم مصري 01555293810 يصبح 201555293810 (كود مصر 20 + الرقم بدون الصفر)
const WHATSAPP_NUMBER = "201555293810";

// ---------------------------------------------------------
// الكاتيجوري — دوائر أسفل البانر مباشرة
// image: صورة دائرية (استخدم صور مربعة/مركزية لأفضل نتيجة)
// link: افتراضياً بتوديك لصفحة category.html بتعرض منتجات الكاتيجوري ده تلقائياً
//       لو عايز رابط تاني (صفحة خارجية مثلاً) غيّر القيمة هنا
// labelEn: اسم الكاتيجوري بالإنجليزي (يظهر لو المستخدم بدّل اللغة)
// ---------------------------------------------------------
const OFFERS_BANNER = {
  imageAr: "https://i.ibb.co/pB3yk0mM/ey-Jp-ZCI6-Im1f-Nm-E2-Mm-Q3-Mzhh-Yz-Iw-ODE5-MTg1-OTIz-Y2-Rk-Nj-My-OThl-OTI6c2-Vka-W1lbn-Q6-Ly80-Y2-Vl-Yjcx-Mz.jpg",
  imageEn: "رابط صورة البانر بالإنجليزي",
  link: "" // رابط التوجيه لو حابب، أو سيبه فاضي "" لو البانر مش هيتضغط
};

const CATEGORIES = [
  {
    id: "gift-cards",
    label: "بطاقات هدايا",
    labelEn: "Gift Cards",
    image: "https://i.ibb.co/DPj8GzcL/20260702-131510.png",
    link: "category.html?cat=gift-cards"
  },
  {
    id: "subscriptions",
    label: "اشتراكات",
    labelEn: "Subscriptions",
    image: "https://i.ibb.co/MkHjNSKD/20260702-132134.png",
    link: "category.html?cat=subscriptions"
  },
  {
    id: "xbox-games",
    label: "ألعاب Xbox",
    labelEn: "Xbox Games",
    image: "https://i.ibb.co/JRD9xQVd/images-3.jpg",
    link: "category.html?cat=xbox-games"
  },
  {
    id: "playstation-games",
    label: "ألعاب PlayStation",
    labelEn: "PlayStation Games",
    image: "https://i.ibb.co/5XBCN79z/images.png",
    link: "category.html?cat=playstation-games"
  }
];

// ---------------------------------------------------------
// بيانات البانرات — الصفحة الرئيسية
// image: رابط صورة البانر
// link: الرابط اللي يتوجه له المستخدم عند الضغط (اتركه "" لو مفيش رابط)
// ---------------------------------------------------------
const BANNERS = [
  {
    image: "https://i.ibb.co/nNt0rrRq/20260611-213617.png",
    link: "product.html?id=batman-arkham-knight"
  },
  {
    image: "https://i.ibb.co/5XRS3gCF/20260703-165847.png",
    link: ""
  },
  {
    image: "https://i.ibb.co/wh7fP95G/200w.webp",
    link: ""
  },
  {
    image: "https://i.ibb.co/6crxZmhF/200w-1.webp",
    link: ""
  }
];

// ---------------------------------------------------------
// بيانات المنتجات — أضف منتجاتك هنا بنفس الشكل
// كل منتج له: id (يُستخدم في الرابط product.html?id=...)
// category: لازم يطابق أحد id بتاع CATEGORIES فوق (gift-cards / subscriptions / xbox-games / playstation-games)
// oldPrice: اختياري، لو موجود بيظهر % الخصم على الصورة والسعر القديم مشطوب تحتها
// isNew: اختياري (true/false)، لو مفيش oldPrice بيظهر شارة "جديد" على الصورة
// inStock: false لو المنتج خلص — هيظهر "غير متوفر" على الكارد وصفحة المنتج وهيتقفل زرار الطلب
// ---------------------------------------------------------
const PRODUCTS = {
  "batman-arkham-knight xb": {
    name: "Batman Arkham Knight Xbox",
    nameEn: "Batman Arkham Knight Xbox",
    platformTag: "XBOX",
    category: "xbox-games",
    note: "حساب كامل",
    noteEn: "Full account",
    price: 270,
    isNew: null,
    inStock: true
,
    currency: { ar: "ج.م", en: "EGP" },
    image: "https://i.ibb.co/gLBtLMZ6/d550f93b3de7b68015516483344066ec.jpg",
    description:
      "حساب كامل يحتوي على لعبة Batman Arkham Knight لمنصة Xbox، تسليم خلال ساعتين بحد اقصى بعد تأكيد الطلب عبر واتساب.",
    descriptionEn:
      "Full account including Batman: Arkham Knight on Xbox. Instant Delivery within a maximum of 2 hours after order confirmation via WhatsApp."
  },

  "FC 26 xb": {
    name: "FC 26 Xbox",
    nameEn: "FC 26 Xbox",
    platformTag: "XBOX",
    category: "xbox-games",
    note: "حساب كامل",
    noteEn: "Full account",
    price: 500,
    isNew: null,
    inStock: true
,
    currency: { ar: "ج.م", en: "EGP" },
    image: "https://i.ibb.co/xThLH0G/IMG-20260703-030147.jpg",
    description:
      "حساب كامل يحتوي على لعبة  FC 26 منصة Xbox، تسليم خلال ساعتين بحد اقصى بعد تأكيد الطلب عبر واتساب.",
    descriptionEn:
      "Full account including FC 26 on Xbox. Instant Delivery within a maximum of 2 hours after order confirmation via WhatsApp."
  },

  "red dead redempiton 2 ps": {
    name: "Red Dead Redempiton 2 Playstation",
    nameEn: "Rad Dead Redempiton 2 Playstation",
    platformTag: "PS5",
    category: "playstation-games",
    note: "بريمري",
    noteEn: "Primary",
    price: 550,
    isNew: null,
    inStock: true
,
    currency: { ar: "ج.م", en: "EGP" },
    image: "https://i.ibb.co/DgsCfdSS/download.jpg",
    description:
      "حساب كامل يحتوي على لعبة Red dead redempiton 2 لمنصة PS5، تسليم خلال ساعتين بحد اقصى بعد تأكيد الطلب عبر واتساب.",
    descriptionEn:
      "Full account including Red dead redempiton 2 on PS5. Instant Delivery within a maximum of 2 hours after order confirmation via WhatsApp."
  },

  "Watch dogs leigon ps": {
    name: "Watch dogs leigon Playstation",
    nameEn: "Watch dogs leigon Playstation",
    platformTag: "PS5",
    category: "playstation-games",
    note: "بريمري",
    noteEn: "Primary",
    price: 450,
    isNew: null,
    inStock: true
,
    currency: { ar: "ج.م", en: "EGP" },
    image: "https://i.ibb.co/V0vSS1pY/download-1.jpg",
    description:
      "حساب كامل يحتوي على لعبة Watch dogs leigon لمنصة PS5، تسليم خلال ساعتين بحد اقصى بعد تأكيد الطلب عبر واتساب.",
    descriptionEn:
      "Full account including Watch dogs leigon on PS5. Instant Delivery within a maximum of 2 hours after order confirmation via WhatsApp."
  },  

    "Assassins creed mirage xb": {
    name: "Assassins Creed Mirage Xbox",
    nameEn: "Assassins Creed Mirage Xbox",
    platformTag: "XBOX",
    category: "xbox-games",
    note: "حساب كامل",
    noteEn: "Full account",
    price: 650,
    isNew: null,
    inStock: true
,
    currency: { ar: "ج.م", en: "EGP" },
    image: "https://i.ibb.co/PZP2ngRh/images-6.jpg",
    description:
      "حساب كامل يحتوي على لعبة Assassins Creed Mirage لمنصة Xbox، تسليم خلال ساعتين بحد اقصى بعد تأكيد الطلب عبر واتساب.",
    descriptionEn:
      "Full account including Assassins Creed Mirage on Xbox. Instant Delivery within a maximum of 2 hours after order confirmation via WhatsApp."
  },  

      "Assassins creed shadow xb": {
    name: "Assassins Creed Shadow Xbox",
    nameEn: "Assassins Creed Shadow Xbox",
    platformTag: "XBOX",
    category: "xbox-games",
    note: "حساب كامل",
    noteEn: "Full account",
    price: 800,
    isNew: null,
    inStock: true
,
    currency: { ar: "ج.م", en: "EGP" },
    image: "https://i.ibb.co/R4t7JHZJ/images-5.jpg",
    description:
      "حساب كامل يحتوي على لعبة Assassins Creed Shadow لمنصة Xbox، تسليم خلال ساعتين بحد اقصى بعد تأكيد الطلب عبر واتساب.",
    descriptionEn:
      "Full account including Assassins Creed Shadow on Xbox. Instant Delivery within a maximum of 2 hours after order confirmation via WhatsApp."
  },  

    "red dead redempiton 2 xb": {
    name: "Red Dead Redempiton 2 Xbox",
    nameEn: "Rad Dead Redempiton 2 Xbox",
    platformTag: "XBOX",
    category: "xbox-games",
    note: "حساب كامل",
    noteEn: "Full account",
    price: 800,
    isNew: null,
    inStock: true
,
    currency: { ar: "ج.م", en: "EGP" },
    image: "https://i.ibb.co/DgsCfdSS/download.jpg",
    description:
      "حساب كامل يحتوي على لعبة Red dead redempiton 2 لمنصة Xbox، تسليم خلال ساعتين بحد اقصى بعد تأكيد الطلب عبر واتساب.",
    descriptionEn:
      "Full account including Red dead redempiton 2 on Xbox. Instant Delivery within a maximum of 2 hours after order confirmation via WhatsApp."
  },

    "far cry 6 ps": {
    name: "Far Cry 6 Playstation",
    nameEn: "Far Cry 6 Playstation",
    platformTag: "PS5",
    category: "playstation-games",
    note: "بريمري",
    noteEn: "Primary",
    price: 550,
    isNew: null,
    inStock: true
,
    currency: { ar: "ج.م", en: "EGP" },
    image: "https://i.ibb.co/dsshPYGt/images-7.jpg",
    description:
      "حساب كامل يحتوي على لعبة Far Cry 6 لمنصة PS5، تسليم خلال ساعتين بحد اقصى بعد تأكيد الطلب عبر واتساب.",
    descriptionEn:
      "Full account including Far Cry 6 on PS5. Instant Delivery within a maximum of 2 hours after order confirmation via WhatsApp."
  },

    "Resident Evil Village ps": {
    name: "Resident Evil Village Playstation",
    nameEn: "Resident Evil Village Playstation",
    platformTag: "PS5",
    category: "playstation-games",
    note: "بريمري",
    noteEn: "Primary",
    price: 550,
    isNew: null,
    inStock: true
,
    currency: { ar: "ج.م", en: "EGP" },
    image: "https://i.ibb.co/7JSK063C/download-2.jpg",
    description:
      "حساب كامل يحتوي على لعبة Resident Evil Village لمنصة PS5، تسليم خلال ساعتين بحد اقصى بعد تأكيد الطلب عبر واتساب.",
    descriptionEn:
      "Full account including Resident Evil Village on PS5. Instant Delivery within a maximum of 2 hours after order confirmation via WhatsApp."
  },

    "Spider Man ps": {
    name: "Spider maximum Playstation",
    nameEn: "Spider Man Playstation",
    platformTag: "PS5",
    category: "playstation-games",
    note: "بريمري",
    noteEn: "Primary",
    price: 550,
    isNew: null,
    inStock: true
,
    currency: { ar: "ج.م", en: "EGP" },
    image: "https://i.ibb.co/XxbJzdJ6/images-8.jpg",
    description:
      "حساب كامل يحتوي على لعبة Spider Man لمنصة PS5، تسليم خلال ساعتين بحد اقصى بعد تأكيد الطلب عبر واتساب.",
    descriptionEn:
      "Full account including Spider Man on PS5. Instant Delivery within a maximum of 2 hours after order confirmation via WhatsApp."
  },

    "Spider Man Miles Morales ps": {
    name: "Spider Man Miles Morales PlayStation",
    nameEn: "Spider Man Miles Morales Playstation",
    platformTag: "PS5",
    category: "playstation-games",
    note: "بريمري",
    noteEn: "Primary",
    price: 650,
    isNew: null,
    inStock: true
,
    currency: { ar: "ج.م", en: "EGP" },
    image: "https://i.ibb.co/jZQMRZ1d/download-3.jpg",
    description:
      "حساب كامل يحتوي على لعبة Spider Man Miles Morales لمنصة PS5، تسليم خلال ساعتين بحد اقصى بعد تأكيد الطلب عبر واتساب.",
    descriptionEn:
      "Full account including Spider Man Miles Morales on PS5. Instant Delivery within a maximum of 2 hours after order confirmation via WhatsApp."
  },


      "Forza Horizon 5 xb": {
    name: "Forza Horizon 5 Xbox",
    nameEn: "Forza Horizon 5 Xbox",
    platformTag: "XBOX",
    category: "xbox-games",
    note: "حساب كامل",
    noteEn: "Full account",
    price: 850,
    isNew: null,
    inStock: true
,
    currency: { ar: "ج.م", en: "EGP" },
    image: "https://i.ibb.co/8g3XLhPF/images-9.jpg",
    description:
      "حساب كامل يحتوي على لعبة Forza Horizon 5 لمنصة Xbox، تسليم خلال ساعتين بحد اقصى بعد تأكيد الطلب عبر واتساب.",
    descriptionEn:
      "Full account including Forza Horizon 5 on Xbox. Instant Delivery within a maximum of 2 hours after order confirmation via WhatsApp."
  },


      "Gift Card 10 USD xb ": {
    name: "Gift Card 10 USD Xbox",
    nameEn: "Gift Card 10 USD Xbox",
    platformTag: "XBOX",
    category: "gift-cards",
    note: " بطاقة هدايا ",
    noteEn: "Gift Card",
    price: 600,
    isNew: null,
    inStock: true
,
    currency: { ar: "ج.م", en: "EGP" },
    image: "https://i.ibb.co/kVwMrxvB/IMG-20260702-151848.png",
    description:
      "بطاقة هدايا 10 دولار امريكي لمنصة Xbox، تسليم خلال ساعتين بحد اقصى بعد تأكيد الطلب عبر واتساب.",
    descriptionEn:
      "Gift Card 10 USD For Xbox. Instant Delivery within a maximum of 2 hours after order confirmation via WhatsApp."
  },

        "Gift Card 50 USD xb ": {
    name: "Gift Card 50 USD Xbox",
    nameEn: "Gift Card 50 USD Xbox",
    platformTag: "XBOX",
    category: "gift-cards",
    note: " بطاقة هدايا ",
    noteEn: "Gift Card",
    price: 2600,
    isNew: null,
    inStock: true
,
    currency: { ar: "ج.م", en: "EGP" },
    image: "https://i.ibb.co/Z660Vz0d/2-20260702-152657.png",
    description:
      "بطاقة هدايا 50 دولار امريكي لمنصة Xbox، تسليم خلال ساعتين بحد اقصى بعد تأكيد الطلب عبر واتساب.",
    descriptionEn:
      "Gift Card 50 USD For Xbox. Instant Delivery within a maximum of 2 hours after order confirmation via WhatsApp."
  },


        "Gift Card 100 USD xb ": {
    name: "Gift Card 100 USD Xbox",
    nameEn: "Gift Card 100 USD Xbox",
    platformTag: "XBOX",
    category: "gift-cards",
    note: " بطاقة هدايا ",
    noteEn: "Gift Card",
    price: 5250,
    isNew: null,
    inStock: true
,
    currency: { ar: "ج.م", en: "EGP" },
    image: "https://i.ibb.co/0R9Rxf5k/2-20260702-153014.png",
    description:
      "بطاقة هدايا 100 دولار امريكي لمنصة Xbox، تسليم خلال ساعتين بحد اقصى بعد تأكيد الطلب عبر واتساب.",
    descriptionEn:
      "Gift Card 100 USD For Xbox. Instant Delivery within a maximum of 2 hours after order confirmation via WhatsApp."
  },

        "Gift Card 10 USD ps ": {
    name: "Gift Card 10 USD Playstation",
    nameEn: "Gift Card 10 USD Playstation",
    platformTag: "PlayStation",
    category: "gift-cards",
    note: " بطاقة هدايا ",
    noteEn: "Gift Card",
    price: 610,
    isNew: null,
    inStock: true
,
    currency: { ar: "ج.م", en: "EGP" },
    image: "https://i.ibb.co/XffCKqB7/IMG-20260702-153249.png",
    description:
      "بطاقة هدايا 10 دولار امريكي لمنصة playstation، تسليم خلال ساعتين بحد اقصى بعد تأكيد الطلب عبر واتساب.",
    descriptionEn:
      "Gift Card 10 USD For playstation. Instant Delivery within a maximum of 2 hours after order confirmation via WhatsApp."
  },

        "Gift Card 50 USD ps ": {
    name: "Gift Card 50 USD Playstation",
    nameEn: "Gift Card 50 USD PlayStation",
    platformTag: "playstation",
    category: "gift-cards",
    note: " بطاقة هدايا ",
    noteEn: "Gift Card",
    price: 2700,
    isNew: null,
    inStock: true
,
    currency: { ar: "ج.م", en: "EGP" },
    image: "https://i.ibb.co/kt02gjm/2-20260702-162226.png",
    description:
      "بطاقة هدايا 50 دولار امريكي لمنصة playstation، تسليم خلال ساعتين بحد اقصى بعد تأكيد الطلب عبر واتساب.",
    descriptionEn:
      "Gift Card 50 USD For playstation. Instant Delivery within a maximum of 2 hours after order confirmation via WhatsApp."
  },

        "Gift Card 100 USD ps ": {
    name: "Gift Card 100 USD PlayStation",
    nameEn: "Gift Card 100 USD PlayStation",
    platformTag: "PlayStation",
    category: "gift-cards",
    note: " بطاقة هدايا ",
    noteEn: "Gift Card",
    price: 5600,
    isNew: null,
    inStock: true
,
    currency: { ar: "ج.م", en: "EGP" },
    image: "https://i.ibb.co/QRMRrqn/2-20260702-162453.png",
    description:
      "بطاقة هدايا 100 دولار امريكي لمنصة playstation، تسليم خلال ساعتين بحد اقصى بعد تأكيد الطلب عبر واتساب.",
    descriptionEn:
      "Gift Card 10 USD For playstation. Instant Delivery within a maximum of 2 hours after order confirmation via WhatsApp."
  },

      "Stray Xbox": {
    name: "Stray Xbox",
    nameEn: "Stray Xbox",
    platformTag: "XBOX",
    category: "xbox-games",
    note: "حساب كامل",
    noteEn: "Full account",
    price: 450,
    isNew: null,
    inStock: true
,
    currency: { ar: "ج.م", en: "EGP" },
    image: "https://i.ibb.co/wZtxWCsW/images-10.jpg",
    description:
      "حساب كامل يحتوي على لعبة Stray لمنصة Xbox، تسليم خلال ساعتين بحد اقصى بعد تأكيد الطلب عبر واتساب.",
    descriptionEn:
      "Full account including Stray on Xbox. Instant Delivery within a maximum of 2 hours after order confirmation via WhatsApp."
  },  

    

  "Call of duty black ops 6 xb": {
    name: "Call of duty black ops 6 Xbox",
    nameEn: "Call of duty black ops 6 Xbox",
    platformTag: "XBOX",
    category: "xbox-games",
    note: "حساب كامل",
    noteEn: "Full account",
    price: 780,
    isNew: null,
    inStock: true
,
    currency: { ar: "ج.م", en: "EGP" },
    image: "https://i.ibb.co/PZv1hM6G/MV5-BYj-E3-OGFk-Mm-It-ZGMz-OC00-Ym-Vj-LWE5-Zm-Yt-Nzcx-MTk0-OTY5-NTU2-Xk-Ey-Xk-Fqc-Gc.jpg",
    description:
      "حساب كامل يحتوي على لعبة Call of duty black ops 6 لمنصة Xbox، تسليم خلال ساعتين بحد اقصى بعد تأكيد الطلب عبر واتساب.",
    descriptionEn:
      "Full account including call of duty black ops 6  on Xbox. Instant Delivery within a maximum of 2 hours after order confirmation via WhatsApp."
  },

  "The crew 2 xb": {
    name: "The crew 2 Xbox",
    nameEn: "The crew 2 Xbox",
    platformTag: "XBOX",
    category: "xbox-games",
    note: "حساب كامل",
    noteEn: "Full account",
    price: 350,
    isNew: null,
    inStock: true
,
    currency: { ar: "ج.م", en: "EGP" },
    image: "https://i.ibb.co/0bBH8GT/Untitled.png",
    description:
      "حساب كامل يحتوي على لعبة The crew 2 لمنصة Xbox، تسليم خلال ساعتين بحد اقصى بعد تأكيد الطلب عبر واتساب.",
    descriptionEn:
      "Full account including The crew 2  on Xbox. Instant Delivery within a maximum of 2 hours after order confirmation via WhatsApp."
  },

    "A Plague Tale Innocence xb": {
    name: "A Plague Tale Innocence Xbox",
    nameEn: "A Plague Tale Innocence Xbox",
    platformTag: "XBOX",
    category: "xbox-games",
    note: "حساب كامل",
    noteEn: "Full account",
    price: 380,
    isNew: null,
    inStock: true
,
    currency: { ar: "ج.م", en: "EGP" },
    image: "https://i.ibb.co/V0JwLfN5/apps-49740-68306748966338141-e6f96fac-aa67-4f59-9043-10654607aa79.jpg",
    description:
      "حساب كامل يحتوي على لعبة A Plague Tale Innocence لمنصة Xbox، تسليم خلال ساعتين بحد اقصى بعد تأكيد الطلب عبر واتساب.",
    descriptionEn:
      "Full account including A Plague Tale Innocence  on Xbox. Instant Delivery within a maximum of 2 hours after order confirmation via WhatsApp."
  },
  
};

/**
 * يبني رابط واتساب يحتوي رسالة الطلب جاهزة للإرسال
 */
function buildWhatsAppOrderUrl({ whatsappNumber, product, form }) {
  const lines = [
    "طلب جديد 🛒",
    "-----------------------",
    `المنتج: ${product.name}`,
    `الكمية: ${form.quantity}`,
    `السعر الإجمالي: ${product.price * form.quantity} ${currencyText(product)}`,
    "-----------------------",
    `الاسم: ${form.name}`,
    `رقم الهاتف: ${form.phone}`,
    `طريقة الدفع: ${form.payment}`,
    form.notes ? `ملاحظات: ${form.notes}` : null
  ].filter(Boolean);

  const message = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${whatsappNumber}?text=${message}`;
}
