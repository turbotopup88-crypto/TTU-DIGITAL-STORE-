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
    link: ""
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
  "batman-arkham-knight-xb": {
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
      "Batman: Arkham Knight هي لعبة أكشن وعالم مفتوح تضعك في دور باتمان لحماية مدينة جوثام من أخطر أعدائه. استخدم مهارات القتال والتخفي، وقُد الـBatmobile في تجربة مليئة بالإثارة والألغاز.",
    descriptionEn:
      "Batman: Arkham Knight is an action and open-world game that puts you in the role of Batman to protect Gotham City from its most dangerous enemies. Use combat and stealth skills, and drive the Batmobile in an experience full of excitement and puzzles."
  },

  "FC-26-xb": {
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
      "EA SPORTS FC 26 هي أحدث ألعاب كرة القدم من EA، وتقدم تجربة واقعية بفضل تحسينات أسلوب اللعب والرسوميات، مع أوضاع متنوعة مثل Ultimate Team وCareer Mode واللعب الجماعي عبر الإنترنت.",
    descriptionEn:
      "EA SPORTS FC 26 is the latest football game from EA, offering a realistic experience thanks to gameplay and graphics improvements, with various modes like Ultimate Team, Career Mode, and online multiplayer."
  },

  "red-dead-redempiton-2-ps": {
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
      "Red Dead Redemption 2 هي لعبة أكشن ومغامرات بعالم مفتوح تدور أحداثها في الغرب الأمريكي عام 1899. تلعب بدور آرثر مورغان، أحد أفراد عصابة فان دير ليند، بينما يحاول النجاة وسط انهيار عصر رعاة البقر، واتخاذ قرارات مصيرية بين الولاء والعائلة والخلاص. تتميز اللعبة بقصة عميقة، وعالم حي مليء بالتفاصيل، وشخصيات لا تُنسى.",
    descriptionEn:
      "Red Dead Redemption 2 is an action-adventure game set in an open world that takes place in the American West in 1899. You play as Arthur Morgan, a member of the Van der Linde gang, trying to survive as the era of cowboys comes to an end, making life-changing choices between loyalty, family, and redemption. The game features a deep story, a living world full of details, and unforgettable characters."
  },

  "Watch-dogs-leigon-ps": {
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
      "Watch Dogs: Legion هي لعبة عالم مفتوح تدور أحداثها في لندن المستقبلية، حيث يمكنك تجنيد أي شخص من سكان المدينة والانضمام إلى المقاومة لتحريرها من سيطرة النظام القمعي باستخدام الاختراق والتكنولوجيا.",
    descriptionEn:
      "Watch Dogs: Legion is an open-world game set in a futuristic London, where you can recruit anyone from the city's residents and join the resistance to free it from the control of the oppressive regime using hacking and technology."
  },  

    "Assassins-creed-mirage-xb": {
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
      "Assassin's Creed Mirage هي لعبة أكشن ومغامرات تعود بجذور السلسلة إلى أسلوب التخفي والاغتيالات. تلعب بدور باسم في شوارع بغداد في القرن التاسع، حيث تكشف أسرارًا وتواجه منظمة الفرسان في رحلة مليئة بالإثارة.",
    descriptionEn:
      "Assassin's Creed Mirage is an action-adventure game that brings the series back to its roots of stealth and assassinations. You play as Basim in the streets of ninth-century Baghdad, uncovering secrets and facing the Order of the Knights on an exciting journey."
  },  

      "Assassins-creed-shadow-xb": {
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
      "Assassin's Creed Shadows هي لعبة عالم مفتوح تدور أحداثها في اليابان الإقطاعية، حيث تلعب بشخصيتين مختلفتين: الشينوبي ناوي والمحارب ياسوكي. استكشف عالمًا غنيًا بالتفاصيل واستخدم أساليب التخفي أو القتال لخوض مغامرة ملحمية.",
    descriptionEn:
      "Assassin's Creed Shadows is an open-world game set in feudal Japan, where you play as two different characters: the shinobi Nawi and the warrior Yasuke. Explore a richly detailed world and use stealth or combat to embark on an epic adventure."
  },  

    "red-dead-redempiton-2-xb": {
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
      "Red Dead Redemption 2 هي لعبة أكشن ومغامرات بعالم مفتوح تدور أحداثها في الغرب الأمريكي عام 1899. تلعب بدور آرثر مورغان، أحد أفراد عصابة فان دير ليند، بينما يحاول النجاة وسط انهيار عصر رعاة البقر، واتخاذ قرارات مصيرية بين الولاء والعائلة والخلاص. تتميز اللعبة بقصة عميقة، وعالم حي مليء بالتفاصيل، وشخصيات لا تُنسى.",
    descriptionEn:
      "Red Dead Redemption 2 is an action-adventure game set in an open world that takes place in the American West in 1899. You play as Arthur Morgan, a member of the Van der Linde gang, trying to survive as the era of cowboys comes to an end, making life-changing choices between loyalty, family, and redemption. The game features a deep story, a living world full of details, and unforgettable characters."
  },

    "far-cry-6-ps": {
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

    "Resident-Evil-Village-ps": {
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
      "Resident Evil Village هي لعبة رعب وبقاء من منظور الشخص الأول، تتابع رحلة إيثان وينترز في قرية غامضة مليئة بالمخلوقات المرعبة والأسرار، مع مزيج من القتال والاستكشاف والألغاز.",
    descriptionEn:
      "Resident Evil Village is a first-person horror and survival game that follows Ethan Winters' journey in a mysterious village full of terrifying creatures and secrets, with a mix of combat, exploration, and puzzles."
  },

    "Spider-Man-ps": {
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
      "Marvel's Spider-Man هي لعبة أكشن وعالم مفتوح تتيح لك اللعب بشخصية بيتر باركر وحماية مدينة نيويورك من أخطر الأشرار، مع نظام تنقل وقتال سريع وقصة سينمائية مميزة.",
    descriptionEn:
      "Marvel's Spider-Man is an action and open-world game that lets you play as Peter Parker and protect New York City from the most dangerous villains, with fast-moving combat and traversal, plus a standout cinematic story."
  },

    "Spider-Man-Miles-Morales-ps": {
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
      "Marvel's Spider-Man: Miles Morales هي لعبة أكشن تتابع قصة مايلز موراليس وهو يتعلم تحمل مسؤولية الرجل العنكبوت، مستخدمًا قدراته الكهربائية الفريدة في مواجهة تهديدات جديدة بمدينة نيويورك.",
    descriptionEn:
      "Marvel's Spider-Man: Miles Morales is an action game that follows the story of Miles Morales as he learns to take on the responsibility of Spider-Man, using his unique electric powers to face new threats in New York City."
  },


      "Forza-Horizon-5-xb": {
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
      "Forza Horizon 5 هي لعبة سباقات بعالم مفتوح تأخذك إلى المكسيك بمناظرها الخلابة وتنوع بيئاتها. استمتع بقيادة مئات السيارات والمشاركة في سباقات وتحديات مليئة بالحماس.",
    descriptionEn:
      "Forza Horizon 5 is an open-world racing game that takes you to Mexico with its stunning landscapes and diverse environments. Enjoy driving hundreds of cars and taking part in exciting races and challenges."
  },


      "Gift-Card-10-USD-xb": {
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

        "Gift-Card-50-USD-xb": {
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


        "Gift-Card-100-USD-xb": {
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

        "Gift-Card-10-USD-ps": {
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

        "Gift-Card-50-USD-ps": {
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

        "Gift-Card-100-USD-ps": {
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
    image: "https://i.ibb.co/Fksq8grS/ey-Jp-ZCI6-Im1f-Nm-E2-NTJl-YWNj-MTk4-ODE5-MWE1-Mz-Ey-Yz-Jk-Zjlk-ODVi-Ym-M6c2-Vka-W1lbn-Q6-Ly9k-ZWZj-ZGNi-Yz.jpg",
    description:
      "بطاقة هدايا 100 دولار امريكي لمنصة playstation، تسليم خلال ساعتين بحد اقصى بعد تأكيد الطلب عبر واتساب.",
    descriptionEn:
      "Gift Card 10 USD For playstation. Instant Delivery within a maximum of 2 hours after order confirmation via WhatsApp."
  },

      "Stray-Xbox": {
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

    

  "Call-of-duty-black-ops-6-xb": {
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

  "The-crew-2-xb": {
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
    image: "https://i.ibb.co/dw7Lv2s1/1-IVy-Dh-CRLet-Fhmg-Osg-F84-Eafuh-GV6-Sw-TPjmnp2-Y7-H9x4jju-REk-B8-P1dism-Mvp-DYk.jpg",
    description:
      "The Crew 2 هي لعبة سباقات بعالم مفتوح داخل الولايات المتحدة، تتيح لك قيادة السيارات والدراجات النارية والقوارب والطائرات في سباقات متنوعة، مع حرية استكشاف ضخمة وتحديات مستمرة.",
    descriptionEn:
      "The Crew 2 is an open-world racing game set in the United States, letting you drive cars, motorcycles, boats, and planes in various races, with massive freedom to explore and ongoing challenges."
  },

    "A-Plague-Tale-Innocence-xb": {
    name: "A Plague Tale Innocence Xbox",
    nameEn: "A Plague Tale Innocence Xbox",
    platformTag: "XBOX",
    category: "xbox-games",
    note: "حساب كامل",
    noteEn: "Full account",
    price: 280,
    oldPrice: 380,
    isNew: null,
    inStock: true
,
    currency: { ar: "ج.م", en: "EGP" },
    image:"https://assets.mycast.io/posters/a-plague-tale-innocence-fan-casting-poster-380962-medium.jpg?1694389502" ,
    description:
      "A Plague Tale Innocence هي لعبة مغامرات وقصة تدور في فرنسا خلال العصور الوسطى، حيث تهرب أميسيا مع شقيقها هوجو من محاكم التفتيش وأسراب الجرذان القاتلة في رحلة مليئة بالتخفي والعاطفة.",
    descriptionEn:
      "A Plague Tale Innocence is an adventure and story-driven game set in France during the Middle Ages, where Amicia and her brother Hugo flee from the Inquisition and swarms of deadly rats on a journey full of stealth and emotion."
  },

   "A-Plague-Tale-Requiem-xb": {
    name: "A Plague Tale Requiem Xbox",
    nameEn: "A Plague Tale Requiem Xbox",
    platformTag: "XBOX",
    category: "xbox-games",
    note: "حساب كامل",
    noteEn: "Full account",
    price: 490,
    oldPrice: 700,
    isNew: null,
    inStock: true
,
    currency: { ar: "ج.م", en: "EGP" },
    image:"https://i.ibb.co/fLTk9tN/mixcollage-11-dec-2024-03-58-pm-1132.jpg" ,
    description:
      "A Plague Tale Requiem هي لعبة أكشن ومغامرات وقصة مؤثرة، تواصل رحلة أميسيا وشقيقها هوجو في عالم يعج بالأوبئة والمخاطر، حيث يجمعان بين التخفي والقتال لحماية بعضهما البعض.",
    descriptionEn:
      "A Plague Tale Requiem is an action-adventure game with a touching story, continuing the journey of Amicia and her brother Hugo in a world full of plagues and dangers, where they combine stealth and combat to protect each other."
  },

  "Mortal-Kombat-11-xb": {
    name: "Mortal Kombat 11 Xbox",
    nameEn: "Mortal Kombat 11 Xbox",
    platformTag: "XBOX",
    category: "xbox-games",
    note: "حساب كامل",
    noteEn: "Full account",
    price: 400,
    isNew: null,
    inStock: true
,
    currency: { ar: "ج.م", en: "EGP" },
    image:"https://i.ibb.co/MDdXPG1s/OIP.webp" ,
    description:
      "حساب كامل يحتوي على لعبة Mortal Kombat 11 لمنصة Xbox، تسليم خلال ساعتين بحد اقصى بعد تأكيد الطلب عبر واتساب.",
    descriptionEn:
      "Full account including Mortal Kombat 11 on Xbox. Instant Delivery within a maximum of 2 hours after order confirmation via WhatsApp."
  },

   "Dying-light-2-xb": {
    name: "Dying light 2 Xbox",
    nameEn: "Dying light 2 Xbox",
    platformTag: "XBOX",
    category: "xbox-games",
    note: "حساب كامل",
    noteEn: "Full account",
    price: 600,
    isNew: null,
    inStock: true
,
    currency: { ar: "ج.م", en: "EGP" },
    image:"https://i.ibb.co/n8CsFvp1/3b8a68cf-f202-46ff-9b5e-7b795a4073e8.webp" ,
    description:
      "حساب كامل يحتوي على لعبة Dying light 2 لمنصة Xbox، تسليم خلال ساعتين بحد اقصى بعد تأكيد الطلب عبر واتساب.",
    descriptionEn:
      "Full account including Dying light 2 on Xbox. Instant Delivery within a maximum of 2 hours after order confirmation via WhatsApp."
  },

  "Need-For-Speed-heat-deluxe-edition-xb": {
    name: "Need For Speed heat deluxe edition Xbox",
    nameEn: "Need For Speed heat deluxe edition Xbox",
    platformTag: "XBOX",
    category: "xbox-games",
    note: "حساب كامل",
    noteEn: "Full account",
    price: 150,
    isNew: null,
    inStock: true
,
    currency: { ar: "ج.م", en: "EGP" },
    image:"https://i.ibb.co/6J4g5xGf/OIP.webp" ,
    description:
      "حساب كامل يحتوي على لعبة Need For Speed heat deluxe edition لمنصة Xbox، تسليم خلال ساعتين بحد اقصى بعد تأكيد الطلب عبر واتساب.",
    descriptionEn:
      "Full account including Need For Speed heat deluxe edition on Xbox. Instant Delivery within a maximum of 2 hours after order confirmation via WhatsApp."
  },

   "Need-For-Speed-Unbound-xb": {
    name: "Need For Speed Unbound Xbox",
    nameEn: "Need For Speed Unbound Xbox",
    platformTag: "XBOX",
    category: "xbox-games",
    note: "حساب كامل",
    noteEn: "Full account",
    price: 700,
    isNew: null,
    inStock: true
,
    currency: { ar: "ج.م", en: "EGP" },
    image:"https://i.ibb.co/C58b1fpk/need-for-speed-unbound-fan-casting-poster-406056-medium.jpg" ,
    description:
      "حساب كامل يحتوي على لعبة Need For Speed Unbound لمنصة Xbox، تسليم خلال ساعتين بحد اقصى بعد تأكيد الطلب عبر واتساب.",
    descriptionEn:
      "Full account including Need For Speed Unbound on Xbox. Instant Delivery within a maximum of 2 hours after order confirmation via WhatsApp."
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
