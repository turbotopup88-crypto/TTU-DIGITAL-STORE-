// ---------------------------------------------------------
// منطق عرض المنتجات المشترك — يُستخدم في الصفحة الرئيسية وصفحات الكاتيجوري
// - shuffleArray: لترتيب عشوائي للمنتجات
// - productCardHTML: يبني كارد منتج واحد
// - createInfiniteGrid: يعرض المنتجات على دفعات (22 افتراضياً)، ولما توصل لآخرهم بيحمّل الدفعة اللي بعدها تلقائياً
// ---------------------------------------------------------

// ترتيب عشوائي (Fisher-Yates) — بيرجع مصفوفة جديدة من غير ما يغيّر الأصلية
function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function discountPercent(p) {
  if (!p.oldPrice || p.oldPrice <= p.price) return null;
  return Math.round((1 - p.price / p.oldPrice) * 100);
}

// يبني HTML كارد منتج واحد (بدون ربط أحداث — الأحداث متابَعة عن طريق event delegation)
function productCardHTML(id, p) {
  const name = localized(p.name, p.nameEn);
  const note = localized(p.note, p.noteEn);
  const inStock = p.inStock !== false; // افتراضياً متوفر لو الحقل مش موجود
  const discount = discountPercent(p);

  let imageBadge = '';
  if (!inStock) {
    imageBadge = `<span class="badge out-of-stock">${t('outOfStock')}</span>`;
  } else if (discount) {
    imageBadge = `<span class="badge discount">-${discount}%</span>`;
  } else if (p.isNew) {
    imageBadge = `<span class="badge new">${localized('جديد', 'New')}</span>`;
  }

  const priceLine = p.oldPrice
    ? `<span class="old-price">${p.oldPrice} ${currencyText(p)}</span><span class="price">${p.price} ${currencyText(p)}</span>`
    : `<span class="price">${p.price} ${currencyText(p)}</span>`;

  const addBtn = inStock
    ? `<button type="button" class="add-btn" data-id="${id}">
        <span class="plus">+</span> ${t('addToCart')}
      </button>`
    : `<span class="card-note" style="color:#ff8a8a;">${t('outOfStockNote')}</span>`;

  return `
    <a class="product-card${inStock ? '' : ' out-of-stock'}" href="product.html?id=${id}" aria-label="${name}">
      <div class="card-media">
        <img src="${p.image}" alt="${name}" loading="lazy">
        ${imageBadge}
      </div>
      <div class="card-body">
        <h3>${name}</h3>
        <span class="card-tag">${p.platformTag}</span>
        <div class="price-line">${priceLine}</div>
        <span class="card-note">${note}</span>
        ${addBtn}
      </div>
    </a>
  `;
}

/**
 * ينشئ شبكة منتجات بتحميل تدريجي (Infinite Scroll).
 * items: مصفوفة من [id, product] (زي Object.entries(PRODUCTS))
 * لما المستخدم يوصل لآخر المنتجات المعروضة، بتتحمل الدفعة اللي بعدها تلقائياً.
 */
function createInfiniteGrid({ gridEl, sentinelEl, items, pageSize = 22, emptyMessage = '' }) {
  let currentItems = items;
  let loaded = 0;
  let observer = null;

  // إضافة المنتجات للسلة تعمل عن طريق event delegation (تعمل تلقائياً حتى للكروت اللي بتتحمل لاحقاً)
  gridEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-btn');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    addToCart(btn.dataset.id, 1);
    btn.classList.add('added');
    btn.innerHTML = `<span class="plus">✓</span> ${t('added')}`;
    setTimeout(() => {
      btn.classList.remove('added');
      btn.innerHTML = `<span class="plus">+</span> ${t('addToCart')}`;
    }, 1200);
  });

  function loadMore() {
    if (loaded >= currentItems.length) {
      if (observer) observer.disconnect();
      return;
    }
    const chunk = currentItems.slice(loaded, loaded + pageSize);
    const html = chunk.map(([id, p]) => productCardHTML(id, p)).join('');
    gridEl.insertAdjacentHTML('beforeend', html);
    loaded += chunk.length;

    if (loaded >= currentItems.length && observer) {
      observer.disconnect();
    }
  }

  function reset(newItems) {
    currentItems = newItems;
    loaded = 0;
    gridEl.innerHTML = '';
    if (observer) observer.disconnect();

    if (currentItems.length === 0) {
      gridEl.innerHTML = `<p class="search-empty">${emptyMessage}</p>`;
      if (sentinelEl) sentinelEl.style.display = 'none';
      return;
    }

    if (sentinelEl) sentinelEl.style.display = 'block';
    loadMore();

    if (sentinelEl && currentItems.length > pageSize) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) loadMore();
        });
      }, { rootMargin: '400px' });
      observer.observe(sentinelEl);
    }
  }

  reset(items);
  return { reset };
}
