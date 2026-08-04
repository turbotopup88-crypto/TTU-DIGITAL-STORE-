// ============================================================
// 1. الإعدادات الأساسية ورابط الـ Cloudflare Worker
// ============================================================
const FAWATERAK_CONFIG = {
  // رابط Cloudflare Worker الخاص بك
  PROXY_BASE_URL: "https://fawaterak-proxy.turbotopup88.workers.dev",
  CURRENCY: "EGP"
};

// متغيرات مؤقتة لحفظ التوكن ووقت انتهائه لتجنب إعادة طلبه مع كل ضغطة
let fawaterkAccessToken = null;
let tokenExpireTime = 0;

// ============================================================
// 2. إدارة السلة (إضافة / جلب / حفظ)
// ============================================================

// جلب محتويات السلة من LocalStorage
function getCart() {
  const cart = localStorage.getItem('shopping_cart');
  return cart ? JSON.parse(cart) : {};
}

// حفظ السلة في LocalStorage
function saveCart(cart) {
  localStorage.setItem('shopping_cart', JSON.stringify(cart));
}

// إضافة منتج للسلة
function addToCart(productId, quantity = 1) {
  const cart = getCart();
  cart[productId] = (cart[productId] || 0) + quantity;
  saveCart(cart);
}

// تفريغ السلة
function clearCart() {
  localStorage.removeItem('shopping_cart');
}

// ============================================================
// 3. الاتصال بالـ Worker لجلب Token وتوليد الفاتورة
// ============================================================

/**
 * جلب Access Token عبر الـ Worker الوسيط
 */
async function getFawaterkAccessToken() {
  // إذا كان التوكن موجوداً ولا يزال صالحاً، نستخدمه مباشرة
  if (fawaterkAccessToken && tokenExpireTime && Date.now() < tokenExpireTime) {
    return fawaterkAccessToken;
  }

  try {
    const response = await fetch(`${FAWATERAK_CONFIG.PROXY_BASE_URL}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`فشل طلب التوكن: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.access_token) {
      throw new Error("لم يتم استلام access_token من السيرفر");
    }

    fawaterkAccessToken = data.access_token;
    // تخصيص وقت الانتهاء (أقل بدقيقة لضمان الأمان)
    tokenExpireTime = Date.now() + ((data.expires_in || 3600) * 1000 - 60000);

    return fawaterkAccessToken;
  } catch (error) {
    console.error("❌ خطأ في جلب التوكن عبر الـ Worker:", error);
    throw error;
  }
}

/**
 * إنشاء الفاتورة وتوجيه العميل لرابط الدفع
 * @param {Object} orderData - بيانات العميل والإجمالي (e.g., { customer: { name, email, phone }, total: 150 })
 * @param {Object} productsList - قائمة المنتجات المعرفة في موقعك (PRODUCTS)
 */
async function createFawaterkTransaction(orderData, productsList = {}) {
  try {
    // 1. جلب التوكن
    const accessToken = await getFawaterkAccessToken();
    const cart = getCart();
    
    // 2. تحضير عناصر السلة بالصيغة المطلوبة لـ Fawaterak
    const cartItems = Object.entries(cart)
      .filter(([id]) => productsList[id])
      .map(([id, qty]) => {
        const p = productsList[id];
        return {
          name: p.name || `Product ${id}`,
          price: p.price.toString(),
          quantity: qty.toString()
        };
      });

    // تقسيم اسم العميل إلى الاسم الأول والأخير
    const nameParts = (orderData.customer.name || 'Customer').trim().split(' ');
    const firstName = nameParts[0] || 'Customer';
    const lastName = nameParts.slice(1).join(' ') || 'User';

    // 3. تجهيز بيانات الفاتورة (Payload)
    const transactionPayload = {
      cartTotal: orderData.total.toString(),
      currency: FAWATERAK_CONFIG.CURRENCY,
      customer: {
        first_name: firstName,
        last_name: lastName,
        email: orderData.customer.email || 'customer@example.com',
        phone: orderData.customer.phone || '01000000000'
      },
      items: cartItems
    };

    // 4. إرسال الطلب إلى مسار إنشاء المعاملة في الـ Worker
    const response = await fetch(`${FAWATERAK_CONFIG.PROXY_BASE_URL}/api/v3/createTransaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify(transactionPayload)
    });

    const result = await response.json();

    // 5. التوجيه لرابط الدفع بناءً على استجابة الـ API
    if (result.data && result.data.payment_url) {
      // تفريغ السلة بعد نجاح التوجيه
      clearCart();
      window.location.href = result.data.payment_url;
    } else if (result.redirectUrl) {
      clearCart();
      window.location.href = result.redirectUrl;
    } else if (result.invoiceKey) {
      clearCart();
      window.location.href = `https://fawaterk.com/invoice/${result.invoiceKey}`;
    } else {
      console.error("فشل إنشاء رابط الدفع من الاستجابة:", result);
      alert("حدث خطأ أثناء معالجة عملية الدفع، يرجى المحاولة لاحقاً.");
    }

  } catch (error) {
    console.error("❌ خطأ أثناء تنفيذ عملية الدفع:", error);
    alert("تعذر الاتصال ببوابة الدفع. تحقق من الاتصال بالإنترنت.");
  }
}
