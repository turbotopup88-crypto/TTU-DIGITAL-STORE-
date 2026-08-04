const FAWATERAK_CONFIG = {
  // ضع رابط الـ Worker الخاص بك هنا
  PROXY_BASE_URL: "https://fawaterak-proxy.turbotopup88.workers.dev", 
  CURRENCY: "EGP" 
};

// دالة جلب التوكن
async function getFawaterkAccessToken() {
  if (fawaterkAccessToken && tokenExpireTime && Date.now() < tokenExpireTime) {
    return fawaterkAccessToken;
  }

  try {
    const response = await fetch(`${FAWATERAK_CONFIG.PROXY_BASE_URL}/oauth/token`, {
      method: "POST"
    });

    if (!response.ok) throw new Error(`فشل جلب التوكن`);

    const data = await response.json();
    fawaterkAccessToken = data.access_token;
    tokenExpireTime = Date.now() + ((data.expires_in || 3600) * 1000 - 60000);

    return fawaterkAccessToken;
  } catch (error) {
    console.error("❌ خطأ في التوكن:", error);
    throw error;
  }
}

// دالة إنشاء الفاتورة
async function createFawaterkTransaction(orderData) {
  try {
    const accessToken = await getFawaterkAccessToken();
    const cart = getCart();
    
    const cartItems = Object.entries(cart)
      .filter(([id]) => PRODUCTS[id])
      .map(([id, qty]) => {
        const p = PRODUCTS[id];
        return {
          name: p.name || `Product ${id}`,
          price: p.price.toString(),
          quantity: qty.toString()
        };
      });

    const nameParts = orderData.customer.name.split(' ');
    const transactionPayload = {
      cartTotal: orderData.total.toString(),
      currency: FAWATERAK_CONFIG.CURRENCY,
      customer: {
        first_name: nameParts[0] || orderData.customer.name,
        last_name: nameParts.slice(1).join(' ') || '',
        email: orderData.customer.email || 'customer@example.com',
        phone: orderData.customer.phone
      },
      items: cartItems
    };

    const response = await fetch(`${FAWATERAK_CONFIG.PROXY_BASE_URL}/api/v3/createTransaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify(transactionPayload)
    });

    const result = await response.json();
    
    if (result.data && result.data.payment_url) {
        window.location.href = result.data.payment_url; 
    } else if (result.invoiceKey) {
        window.location.href = result.redirectUrl || `https://fawaterk.com${result.invoiceKey}`;
    } else {
        console.error("فشل إنشاء رابط الدفع:", result);
        alert("حدث خطأ أثناء الانتقال لصفحة الدفع");
    }

  } catch (error) {
    console.error("❌ خطأ في المعاملة:", error);
  }
}
