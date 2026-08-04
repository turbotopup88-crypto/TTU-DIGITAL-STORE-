// ============================================================
// 📖 أمثلة عملية لاستخدام فاتورتك API
// ============================================================

// ============================================================
// 1️⃣ إنشاء فاتورة مباشرة عبر API فاتورتك
// ============================================================

// إذا كنت تريد تحكم أكثر، يمكنك استدعاء API فاتورتك مباشرة:

async function createFatourahInvoice(orderData) {
  const FATOURAH_API_URL = "https://app.fawaterk.com/oauth/token"; // تحقق من التوثيق
  const FATOURAH_API_KEY = "a26aff7d-9b45-4956-94b3-c222e4ae3bb8";

  try {
    const response = await fetch(FATOURAH_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer a26aff7d-9b45-4956-94b3-c222e4ae3bb8`
      },
      body: JSON.stringify({
        // معرف فريد من طلبك
        InvoiceReferenceID: orderData.orderId,
        
        // المبلغ
        InvoiceAmount: orderData.total,
        
        // بيانات العميل
        CustomerName: orderData.customer.name,
        CustomerPhone: orderData.customer.phone,
        CustomerEmail: orderData.customer.email,
        
        // المنتجات
        Items: orderData.items.map(item => ({
          ItemName: item.productName,
          ItemDescription: `الكمية: ${item.quantity}`,
          ItemQuantity: item.quantity,
          ItemPrice: item.price
        })),
        
        // إعدادات إضافية
        DisplayCurrencyIso: "SAR", // أو AED, KWD, etc
        NotificationOption: "Email", // أو Sms, Both
        
        // رابط العودة بعد الدفع
        CallBackUrl: `https://your-website.com/invoice?orderId=${orderData.orderId}`,
        ErrorUrl: `https://your-website.com/cart?error=payment_failed`
      })
    });

    const result = await response.json();
    
    if (result.IsSucceed) {
      console.log("✅ تم إنشاء الفاتورة:", result.Data.InvoiceId);
      return {
        invoiceId: result.Data.InvoiceId,
        paymentUrl: result.Data.PaymentURL,
        invoiceUrl: result.Data.InvoiceURL
      };
    } else {
      console.error("❌ فشل:", result.ErrorMessage);
      throw new Error(result.ErrorMessage);
    }

  } catch (error) {
    console.error("❌ خطأ في إنشاء الفاتورة:", error);
    throw error;
  }
}

// ============================================================
// 2️⃣ جلب حالة الفاتورة
// ============================================================

async function getFatourahInvoiceStatus(invoiceId) {
  const FATOURAH_API_URL = `https://api.fatourah.com/v2/invoices/${invoiceId}`;
  const FATOURAH_API_KEY = "YOUR_API_KEY";

  try {
    const response = await fetch(FATOURAH_API_URL, {
      headers: {
        "Authorization": `Bearer ${FATOURAH_API_KEY}`
      }
    });

    const result = await response.json();
    
    if (result.IsSucceed) {
      return {
        status: result.Data.InvoiceStatus, // "Draft", "Unpaid", "Paid", "Cancelled", "Expired"
        paymentStatus: result.Data.PaymentStatus,
        paidAmount: result.Data.PaidAmount,
        remainingAmount: result.Data.RemainingAmount
      };
    }
  } catch (error) {
    console.error("❌ خطأ:", error);
  }
}

// ============================================================
// 3️⃣ إرسال الفاتورة للعميل عبر البريد
// ============================================================

async function sendFatourahInvoiceByEmail(invoiceId, email) {
  const FATOURAH_API_URL = `https://api.fatourah.com/v2/invoices/${invoiceId}/send`;
  const FATOURAH_API_KEY = "YOUR_API_KEY";

  try {
    const response = await fetch(FATOURAH_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${FATOURAH_API_KEY}`
      },
      body: JSON.stringify({
        SendEmail: true,
        Email: email
      })
    });

    const result = await response.json();
    
    if (result.IsSucceed) {
      console.log("✅ تم إرسال الفاتورة");
      return true;
    }
  } catch (error) {
    console.error("❌ خطأ:", error);
  }
}

// ============================================================
// 4️⃣ استرجاع أو حذف فاتورة
// ============================================================

async function voidFatourahInvoice(invoiceId) {
  const FATOURAH_API_URL = `https://api.fatourah.com/v2/invoices/${invoiceId}/void`;
  const FATOURAH_API_KEY = "YOUR_API_KEY";

  try {
    const response = await fetch(FATOURAH_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${FATOURAH_API_KEY}`
      }
    });

    const result = await response.json();
    
    if (result.IsSucceed) {
      console.log("✅ تم إلغاء الفاتورة");
      return true;
    }
  } catch (error) {
    console.error("❌ خطأ:", error);
  }
}

// ============================================================
// 5️⃣ معالجة Webhook من فاتورتك (Node.js/Express)
// ============================================================

// في api-simple.js أضف هذا الـ endpoint:

const express = require('express');
const app = express();

app.post('/api/fatourah-callback', (req, res) => {
  try {
    const { 
      InvoiceId,           // معرف الفاتورة من فاتورتك
      InvoiceReferenceID,  // معرف الطلب الخاص بك
      PaymentStatus,       // "Paid", "Unpaid", "Failed"
      PaymentMethod,       // "CreditCard", "DebitCard", etc
      TransactionId,
      PaidAmount
    } = req.body;

    console.log("🔔 Webhook من فاتورتك:", {
      invoiceId: InvoiceId,
      orderId: InvoiceReferenceID,
      status: PaymentStatus
    });

    // ✅ تحديث الطلب في قاعدة البيانات
    if (PaymentStatus === 'Paid') {
      // تحديث الطلب إلى "مدفوع"
      updateOrder(InvoiceReferenceID, {
        paymentStatus: 'paid',
        invoiceId: InvoiceId,
        transactionId: TransactionId,
        paidAmount: PaidAmount
      });
      
      console.log(`✅ تم تأكيد دفع الطلب: ${InvoiceReferenceID}`);
    } else if (PaymentStatus === 'Failed') {
      updateOrder(InvoiceReferenceID, {
        paymentStatus: 'failed',
        status: 'cancelled'
      });
      
      console.log(`❌ فشل دفع الطلب: ${InvoiceReferenceID}`);
    }

    res.json({ success: true });

  } catch (error) {
    console.error("❌ خطأ في Webhook:", error);
    res.status(500).json({ success: false });
  }
});

// ============================================================
// 6️⃣ تدفق شامل: من الطلب إلى الفاتورة
// ============================================================

async function completeOrderFlow(orderData) {
  try {
    // 1. احفظ الطلب في قاعدة البيانات
    const order = await saveOrderToDatabase(orderData);
    console.log("✅ تم حفظ الطلب:", order.orderId);

    // 2. إنشاء فاتورة في فاتورتك
    const fatourahInvoice = await createFatourahInvoice({
      orderId: order.orderId,
      customer: orderData.customer,
      items: orderData.items,
      total: orderData.total
    });
    console.log("✅ تم إنشاء فاتورة فاتورتك:", fatourahInvoice.invoiceId);

    // 3. احفظ معرف الفاتورة في الطلب
    await updateOrder(order.orderId, {
      fatourahInvoiceId: fatourahInvoice.invoiceId
    });

    // 4. أرسل البريد للعميل (اختياري)
    if (orderData.customer.email) {
      await sendFatourahInvoiceByEmail(
        fatourahInvoice.invoiceId,
        orderData.customer.email
      );
      console.log("📧 تم إرسال الفاتورة للبريد");
    }

    // 5. عودة رابط الدفع
    return {
      orderId: order.orderId,
      paymentUrl: fatourahInvoice.paymentUrl,
      invoiceUrl: fatourahInvoice.invoiceUrl
    };

  } catch (error) {
    console.error("❌ خطأ في العملية:", error);
    throw error;
  }
}

// ============================================================
// 7️⃣ دالات مساعدة (قم بتنفيذها حسب قاعدة البيانات)
// ============================================================

async function saveOrderToDatabase(orderData) {
  // مثال مع MongoDB
  // const Order = require('./models/Order');
  // return await Order.create(orderData);
  
  // أو استخدم قاعدة البيانات الخاصة بك
  return {
    orderId: `ORD-${Date.now()}`,
    ...orderData,
    createdAt: new Date()
  };
}

async function updateOrder(orderId, updates) {
  // مثال مع MongoDB
  // return await Order.findByIdAndUpdate(orderId, updates);
  
  console.log(`تحديث الطلب ${orderId}:`, updates);
}

// ============================================================
// 8️⃣ مثال الاستخدام
// ============================================================

// عند ضغط العميل على "تأكيد الشراء":

async function handleCheckout(customer, items, paymentMethod) {
  try {
    const orderData = {
      customer,
      items,
      total: items.reduce((sum, item) => sum + item.subtotal, 0),
      paymentMethod
    };

    const result = await completeOrderFlow(orderData);
    
    // تحويل العميل إلى صفحة الدفع
    window.location.href = result.paymentUrl;

  } catch (error) {
    console.error("❌ فشل:", error);
    alert("حدث خطأ في معالجة الطلب");
  }
}

// ============================================================
// 9️⃣ معالجة حالات خاصة
// ============================================================

// إعادة محاولة الدفع
async function retryPayment(orderId) {
  try {
    const order = await getOrderFromDatabase(orderId);
    
    if (order.paymentStatus === 'failed') {
      // إعادة محاولة الدفع
      const result = await completeOrderFlow({
        customer: order.customer,
        items: order.items,
        total: order.total,
        paymentMethod: order.paymentMethod
      });
      
      return result.paymentUrl;
    }
  } catch (error) {
    console.error("❌ خطأ:", error);
  }
}

// إنشاء فاتورة للطلب الموجود
async function createInvoiceForExistingOrder(orderId) {
  try {
    const order = await getOrderFromDatabase(orderId);
    const fatourahInvoice = await createFatourahInvoice(order);
    
    return fatourahInvoice;
  } catch (error) {
    console.error("❌ خطأ:", error);
  }
}

async function getOrderFromDatabase(orderId) {
  // استرجع من قاعدة البيانات
  return orders[orderId];
}

// ============================================================
// 🔟 نصائح أمان إضافية
// ============================================================

/*
1. تحقق من توقيع Webhook:
   - فاتورتك قد يرسل signature في الـ header
   - تحقق منها للتأكد من أن الطلب من فاتورتك

2. استخدم Idempotency:
   - لا تعالج نفس الـ Webhook مرتين
   - احفظ معرف الـ webhook في قاعدة البيانات

3. استخدم HTTPS دائماً:
   - API فاتورتك يتطلب HTTPS

4. سجّل كل شيء:
   - سجّل كل الطلبات والدفعات
   - سهّل عملية استكشاف الأخطاء

5. اختبر في الـ Sandbox:
   - استخدم بيئة الاختبار قبل الإنتاج
*/

// ============================================================
// صدّر الدوال للاستخدام
// ============================================================

module.exports = {
  createFatourahInvoice,
  getFatourahInvoiceStatus,
  sendFatourahInvoiceByEmail,
  voidFatourahInvoice,
  completeOrderFlow,
  handleCheckout,
  retryPayment
};
