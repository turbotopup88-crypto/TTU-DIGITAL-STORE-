// -------------------------------// ---------------------------------------------------------
// نظام عرض المنتجات مع الفلاتر الذكية
// ---------------------------------------------------------

let currentProducts = []; // المنتجات الحالية المعروضة

// ✅ بناء كروت المنتجات بناءً على الفلاتر
function buildProductCard([id, p]) {
  const isOutOfStock = !p.inStock;
  const hasDiscount = p.oldPrice;
  const discountPercent = hasDiscount ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;

  let badge = '';
  if (isOutOfStock) {
    badge = `<span class="badge out-of-stock">${t('outOfStock')}</span>`;
  } else if (hasDiscount) {
    badge = `<span class="badge discount">-${discountPercent}%</span>`;
  } else if (p.isNew) {
    badge = `<span class="badge new">${t('new')}</span>`;
  }

  const name = localized(p.name, p.nameEn);
  const priceLabel = currencyText(p);

  return `
    <a href="product.html?id=${id}" class="product-card ${isOutOfStock ? 'out-of-stock' : ''}">
      <div class="card-media">
        <img src="${p.image}" alt="${name}" loading="lazy">
        ${badge}
      </div>
      <div class="card-body">
        <h3>${name}</h3>
        ${p.platformTag ? `<span class="card-tag">${p.platformTag}</span>` : ''}
        <div class="price-line">
          <span class="price">${p.price} ${priceLabel}</span>
          ${hasDiscount ? `<span class="old-price">${p.oldPrice}</span>` : ''}
        </div>
        ${p.note ? `<span class="card-note">${localized(p.note, p.noteEn)}</span>` : ''}
      </div>
    </a>
  `;
}

// ✅ تصيير شبكة المنتجات
function renderProductGrid(products) {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  if (products.length === 0) {
    grid.innerHTML = `<div class="search-empty" style="grid-column:1/-1;">${t('noResults')}</div>`;
    return;
  }

  grid.innerHTML = products.map(item => buildProductCard(item)).join('');
}

// ✅ دالة رئيسية لتطبيق الفلاتر والتصيير
function applyAndRenderFilters(searchTerm = '') {
  let products = Object.entries(PRODUCTS);

  // تطبيق البحث أولاً
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    products = products.filter(([, p]) =>
      p.name.toLowerCase().includes(term) ||
      p.nameEn.toLowerCase().includes(term) ||
      p.platformTag.toLowerCase().includes(term)
    );
  }

  // تطبيق الفلاتر
  const filters = getFiltersFromStorage();
  products = applyFilters(products, filters);

  currentProducts = products;
  renderProductGrid(products);
  updateFilterUIState();
}

// ✅ تحديث حالة واجهة الفلاتر (تمييز الفلاتر المفعلة)
function updateFilterUIState() {
  const filters = getFiltersFromStorage();

  // تحديث أزرار الترتيب
  document.querySelectorAll('.filter-price-btn').forEach(btn => {
    btn.classList.toggle('active', filters.priceSort === btn.dataset.sort);
  });

  // تحديث زر الخصم
  const discountBtn = document.getElementById('filter-discount-btn');
  if (discountBtn) {
    discountBtn.classList.toggle('active', filters.onlyDiscounted);
  }

  // تحديث زر مسح الفلاتر
  const clearBtn = document.getElementById('filter-clear-btn');
  if (clearBtn) {
    clearBtn.style.display = hasActiveFilters() ? 'flex' : 'none';
  }
}

// ✅ إنشاء واجهة الفلاتر
function buildFilterUI() {
  const html = `
    <div class="filters-panel" id="filters-panel">
      <div class="filters-header">
        <button class="filter-toggle-btn" id="filter-toggle-btn" aria-label="فتح الفلاتر">
          <span class="filter-icon">⁞</span>
          <span class="filter-label" data-i18n="filters">الفلاتر</span>
        </button>
        <button class="filter-clear-btn" id="filter-clear-btn" style="display:none;" aria-label="مسح الفلاتر">
          ✕ <span data-i18n="clearFilters">مسح</span>
        </button>
      </div>

      <div class="filters-menu" id="filters-menu">
        <div class="filter-group">
          <h3 data-i18n="sortByPrice">ترتيب حسب السعر</h3>
          <div class="filter-options">
            <button class="filter-price-btn" data-sort="low-to-high" aria-label="السعر من الأقل للأعلى">
              ⬆️ <span data-i18n="lowToHigh">الأقل للأعلى</span>
            </button>
            <button class="filter-price-btn" data-sort="high-to-low" aria-label="السعر من الأعلى للأقل">
              ⬇️ <span data-i18n="highToLow">الأعلى للأقل</span>
            </button>
          </div>
        </div>

        <div class="filter-group">
          <h3 data-i18n="filterByDiscount">تصفية</h3>
          <div class="filter-options">
            <button class="filter-discount-btn" id="filter-discount-btn" aria-label="عرض المنتجات بالخصم فقط">
              🏷️ <span data-i18n="onlyDiscounted">المنتجات بالخصم</span> <span class="discount-count">(${getDiscountedCount()})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // إدراج الفلاتر قبل شبكة المنتجات
  const sectionTitle = document.querySelector('.section-title:nth-of-type(2)');
  if (sectionTitle) {
    const filterEl = document.createElement('div');
    filterEl.innerHTML = html;
    sectionTitle.parentNode.insertBefore(filterEl.firstElementChild, sectionTitle.nextSibling);
  }
}

// ✅ ربط أحداث الفلاتر
function attachFilterEvents() {
  // زر فتح/إغلاق الفلاتر
  const toggleBtn = document.getElementById('filter-toggle-btn');
  const filterMenu = document.getElementById('filters-menu');

  if (toggleBtn && filterMenu) {
    toggleBtn.addEventListener('click', () => {
      filterMenu.classList.toggle('open');
      toggleBtn.classList.toggle('open');
    });

    // إغلاق الفلاتر عند الضغط خارجها
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.filters-panel')) {
        filterMenu.classList.remove('open');
        toggleBtn.classList.remove('open');
      }
    });
  }

  // أزرار الترتيب حسب السعر
  document.querySelectorAll('.filter-price-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      updateFilter('priceSort', btn.dataset.sort, () => {
        applyAndRenderFilters(document.getElementById('search-input')?.value || '');
      });
    });
  });

  // زر الخصم
  const discountBtn = document.getElementById('filter-discount-btn');
  if (discountBtn) {
    discountBtn.addEventListener('click', () => {
      updateFilter('onlyDiscounted', null, () => {
        applyAndRenderFilters(document.getElementById('search-input')?.value || '');
      });
    });
  }

  // زر مسح الفلاتر
  const clearBtn = document.getElementById('filter-clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      clearAllFilters();
      applyAndRenderFilters(document.getElementById('search-input')?.value || '');
    });
  }
}

// ✅ تحديث دالة البحث الموجودة
function extendSearchFunctionality() {
  const originalRenderProducts = window.renderProducts;
  window.renderProducts = function(filter = "") {
    applyAndRenderFilters(filter);
  };
}

// ✅ تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  // التأكد من أن PRODUCTS قد حملت
  if (typeof PRODUCTS === 'undefined') {
    console.error('❌ PRODUCTS لم تحمل بعد');
    return;
  }

  // بناء واجهة الفلاتر
  buildFilterUI();
  
  // ربط أحداث الفلاتر
  attachFilterEvents();
  
  // تحديث البحث ليستخدم الفلاتر
  extendSearchFunctionality();
  
  // عرض المنتجات مع الفلاتر المحفوظة
  applyAndRenderFilters();

  console.log('✅ نظام الفلاتر جاهز!');
});--------------------------
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
