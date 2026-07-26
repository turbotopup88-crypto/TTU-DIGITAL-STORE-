// ---------------------------------------------------------
// نظام الفلاتر المتقدم
// يحفظ الفلاتر المختارة في localStorage
// ---------------------------------------------------------

const FILTER_KEY = "store_filters_v1";
const SORT_KEY = "store_sort_v1";

// ✅ دالة لحفظ الفلاتر في localStorage
function saveFiltersToStorage(filters) {
  localStorage.setItem(FILTER_KEY, JSON.stringify(filters));
}

// ✅ دالة لاسترجاع الفلاتر من localStorage
function getFiltersFromStorage() {
  try {
    return JSON.parse(localStorage.getItem(FILTER_KEY)) || {
      priceSort: null, // null, 'low-to-high', 'high-to-low'
      onlyDiscounted: false
    };
  } catch (e) {
    return { priceSort: null, onlyDiscounted: false };
  }
}

// ✅ دالة لتطبيق الفلاتر على المنتجات
function applyFilters(products, filters = {}) {
  let filtered = [...products];

  // 1️⃣ تطبيق فلتر الخصم
  if (filters.onlyDiscounted) {
    filtered = filtered.filter(([, p]) => p.oldPrice);
  }

  // 2️⃣ تطبيق ترتيب السعر
  if (filters.priceSort === 'low-to-high') {
    filtered.sort(([, a], [, b]) => a.price - b.price);
  } else if (filters.priceSort === 'high-to-low') {
    filtered.sort(([, a], [, b]) => b.price - a.price);
  } else {
    // ترتيب ثابت افتراضي (بناءً على ترتيب الجافا)
    filtered.sort(([aId], [bId]) => {
      const aIndex = Object.keys(PRODUCTS).indexOf(aId);
      const bIndex = Object.keys(PRODUCTS).indexOf(bId);
      return aIndex - bIndex;
    });
  }

  return filtered;
}

// ✅ دالة لمسح جميع الفلاتر
function clearAllFilters() {
  localStorage.removeItem(FILTER_KEY);
  localStorage.removeItem(SORT_KEY);
}

// ✅ دالة لتحديث الفلتر وإعادة التصيير
function updateFilter(filterName, value, renderCallback) {
  const filters = getFiltersFromStorage();
  
  if (filterName === 'priceSort') {
    filters.priceSort = filters.priceSort === value ? null : value;
  } else if (filterName === 'onlyDiscounted') {
    filters.onlyDiscounted = !filters.onlyDiscounted;
  }

  saveFiltersToStorage(filters);
  
  if (renderCallback) {
    renderCallback();
  }
}

// ✅ دالة للحصول على عدد المنتجات بالخصم
function getDiscountedCount() {
  return Object.values(PRODUCTS).filter(p => p.oldPrice).length;
}

// ✅ دالة للحصول على حالة الفلاتر (هل هناك فلتر مفعل؟)
function hasActiveFilters() {
  const filters = getFiltersFromStorage();
  return filters.priceSort !== null || filters.onlyDiscounted === true;
}
