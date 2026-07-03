// ⚠️ رقم الواتساب معرّف الآن في products.js (WHATSAPP_NUMBER) عشان يستخدمه كل الملفات

// ---------- قراءة id المنتج من رابط الصفحة ----------
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const product = PRODUCTS[productId];

const page = document.getElementById("product-page");

if (!product) {
  page.innerHTML = `
    <div style="grid-column:1/-1; text-align:center; padding:60px 0;">
      <h2>${t('notFoundTitle')}</h2>
      <a class="back-link" href="index.html" style="justify-content:center; margin-top:10px;">${t('backLink')}</a>
    </div>`;
} else {
  renderProductPage(product);
}

function renderProductPage(p) {
  const name = localized(p.name, p.nameEn);
  const description = localized(p.description, p.descriptionEn);
  const inStock = p.inStock !== false;

  // تحديث عنوان التبويب وبيانات og (لا يؤثر على معاينة واتساب/فيسبوك لأن دول بيقروا HTML الأساسي فقط)
  document.title = name;
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDesc = document.querySelector('meta[property="og:description"]');
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogTitle) ogTitle.setAttribute('content', name);
  if (ogDesc) ogDesc.setAttribute('content', description);
  if (ogImage) ogImage.setAttribute('content', p.image);

  page.innerHTML = `
    <div class="gallery">
      <a class="back-link" href="index.html">${t('backLink')}</a>
      <img src="${p.image}" alt="${name}" style="${inStock ? '' : 'filter:grayscale(70%) brightness(.6);'}">
    </div>

    <div class="product-info">
      <h1>${name}</h1>
      <span class="platform-tag">${p.platformTag}</span>
      <div class="price-row">
        <span class="price">${p.price} ${currencyText(p)}</span>
        <span class="unit">${t('unit')}</span>
        ${inStock ? '' : `<span class="badge out-of-stock" style="position:static;">${t('outOfStock')}</span>`}
      </div>
      <p class="desc">${description}</p>

      ${inStock ? orderFormHTML(p) : `<p class="form-error show">${t('outOfStockNote')}</p>`}
    </div>
  `;

  if (inStock) setupForm(p);
}

function orderFormHTML(p) {
  return `
      <form class="order-form" id="order-form" novalidate>
        <h2>${t('orderFormTitle')}</h2>

        <div class="field">
          <label for="name">${t('nameLabel')}</label>
          <input type="text" id="name" name="name" placeholder="${t('namePlaceholder')}" required>
        </div>

        <div class="field">
          <label for="phone">${t('phoneLabel')}</label>
          <input type="tel" id="phone" name="phone" placeholder="09xxxxxxxx" required>
        </div>

        <div class="field">
          <label for="payment">${t('paymentLabel')}</label>
          <select id="payment" name="payment" required>
            <option value="" disabled selected>${t('paymentChoose')}</option>
            <option value="${t('paymentBank')}">${t('paymentBank')}</option>
            <option value="${t('paymentWallet')}">${t('paymentWallet')}</option>
            <option value="${t('paymentCash')}">${t('paymentCash')}</option>
          </select>
        </div>

        <div class="field">
          <label for="notes">${t('notesLabel')}</label>
          <textarea id="notes" name="notes" rows="2" placeholder="${t('notesPlaceholder')}"></textarea>
        </div>

        <div class="field">
          <label>${t('qtyLabel')}</label>
          <div class="qty-row">
            <button type="button" class="qty-btn" id="qty-minus" aria-label="-">−</button>
            <span id="qty-value">1</span>
            <button type="button" class="qty-btn" id="qty-plus" aria-label="+">+</button>
          </div>
        </div>

        <div class="total-row">
          <span>${t('total')}</span>
          <span class="total-value" id="total-value">${p.price} ${currencyText(p)}</span>
        </div>

        <p class="form-error" id="form-error">${t('orderErrorMsg')}</p>

        <button type="submit" class="whatsapp-btn">
          <span aria-hidden="true">🟢</span> ${t('orderBtn')}
        </button>
        <p class="form-note">${t('orderNote')}</p>
      </form>
  `;
}

function setupForm(product) {
  let quantity = 1;
  const qtyValue = document.getElementById("qty-value");
  const totalValue = document.getElementById("total-value");
  const form = document.getElementById("order-form");
  const errorEl = document.getElementById("form-error");

  function updateTotal() {
    qtyValue.textContent = quantity;
    totalValue.textContent = `${product.price * quantity} ${currencyText(product)}`;
  }

  document.getElementById("qty-plus").addEventListener("click", () => {
    quantity++;
    updateTotal();
  });

  document.getElementById("qty-minus").addEventListener("click", () => {
    if (quantity > 1) quantity--;
    updateTotal();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const payment = form.payment.value;
    const notes = form.notes.value.trim();

    if (!name || !phone || !payment) {
      errorEl.classList.add("show");
      return;
    }
    errorEl.classList.remove("show");

    const url = buildWhatsAppOrderUrl({
      whatsappNumber: WHATSAPP_NUMBER,
      product,
      form: { name, phone, payment, notes, quantity }
    });

    window.open(url, "_blank");
  });
}
