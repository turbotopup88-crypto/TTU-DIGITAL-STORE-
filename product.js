const productId = CURRENT_PRODUCT_ID;
const product = productId ? PRODUCTS[productId] : null;

const page = document.getElementById("product-page");

if (!product) {
  page.innerHTML = `
    <div style="grid-column:1/-1; text-align:center; padding:60px 0;">
      <h2>${t('notFoundTitle')}</h2>
      <a class="back-link" href="/" style="justify-content:center; margin-top:10px;">${t('backLink')}</a>
    </div>`;
} else {
  renderProductPage(product);
}

function renderProductPage(p) {
  const name = localized(p.name, p.nameEn);
  const description = localized(p.description, p.descriptionEn);
  const inStock = p.inStock !== false;

  document.title = name;

  page.innerHTML = `
    <div class="gallery">
      <a class="back-link" href="/">${t('backLink')}</a>
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

      ${inStock ? addToCartHTML(p) : `<p class="form-error show">${t('outOfStockNote')}</p>`}
    </div>
  `;

  if (inStock) setupAddToCart(productId);
}

function addToCartHTML(p) {
  return `
      <div class="order-form">
        <div class="field">
          <label>${t('qtyLabel')}</label>
          <div class="qty-row">
            <button type="button" class="qty-btn" id="qty-minus" aria-label="-">−</button>
            <span id="qty-value">1</span>
            <button type="button" class="qty-btn" id="qty-plus" aria-label="+">+</button>
          </div>
        </div>

        <button type="button" class="whatsapp-btn" id="add-to-cart-btn">
          <span aria-hidden="true">🛒</span> ${localized('أضف للسلة', 'Add to cart')}
        </button>
        <p class="form-note">${localized('تقدر تضيف أكتر من منتج للسلة وتطلبهم مع بعض', 'You can add more products to the cart and order them together')}</p>
      </div>
  `;
}

function setupAddToCart(id) {
  let quantity = 1;
  const qtyValue = document.getElementById("qty-value");
  const btn = document.getElementById("add-to-cart-btn");

  document.getElementById("qty-plus").addEventListener("click", () => {
    quantity++;
    qtyValue.textContent = quantity;
  });

  document.getElementById("qty-minus").addEventListener("click", () => {
    if (quantity > 1) quantity--;
    qtyValue.textContent = quantity;
  });

  btn.addEventListener("click", () => {
    addToCart(id, quantity);
    btn.innerHTML = `<span aria-hidden="true">✓</span> ${localized('تمت الإضافة', 'Added')}`;
    setTimeout(() => {
      btn.innerHTML = `<span aria-hidden="true">🛒</span> ${localized('أضف للسلة', 'Add to cart')}`;
    }, 1200);
    openCart();
  });
}
