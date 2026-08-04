// ============================================================
// API بسيط - فقط لحفظ الطلبات والتحديث من فاتورتك
// Node.js + Express
// ============================================================

const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// قاعدة بيانات مؤقتة (استخدم MongoDB أو أي قاعدة بيانات)
const orders = {};

// ============================================================
// 1️⃣ حفظ الطلب من الموقع (POST /api/orders)
// ============================================================
app.post('/api/orders', async (req, res) => {
  try {
    const { customer, items, total, paymentMethod, orderDate } = req.body;

    if (!customer?.name || !customer?.phone || !items?.length) {
      return res.status(400).json({
        success: false,
        error: 'بيانات ناقصة'
      });
    }

    // توليد معرف الطلب
    const orderId = `ORD-${Date.now()}`;

    // حفظ الطلب
    const order = {
      orderId,
      status: 'pending', // pending → processing → completed
      paymentStatus: 'unpaid',
      customer,
      items,
      total,
      paymentMethod,
      orderDate: orderDate || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    orders[orderId] = order;

    // ✅ اختياري: احفظ في قاعدة بيانات حقيقية
    // await Order.create(order);

    console.log('✅ تم إنشاء طلب:', orderId);

    res.json({
      success: true,
      orderId,
      message: 'تم إنشاء الطلب بنجاح'
    });

  } catch (error) {
    console.error('❌ خطأ:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في الخادم'
    });
  }
});

// ============================================================
// 2️⃣ جلب بيانات الطلب (GET /api/orders/:orderId)
// ============================================================
app.get('/api/orders/:orderId', (req, res) => {
  try {
    const { orderId } = req.params;
    const order = orders[orderId];

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'الطلب غير موجود'
      });
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('❌ خطأ:', error);
    res.status(500).json({
      success: false,
      error: 'خطأ في الخادم'
    });
  }
});

// ============================================================
// 3️⃣ ✅ Webhook من فاتورتك (POST /api/fatourah-callback)
// ============================================================
// فاتورتك سيرسل إليك تحديثات عند نجاح أو فشل الدفع
app.post('/api/fatourah-callback', (req, res) => {
  try {
    const { 
      invoiceId,           // معرف الفاتورة من فاتورتك
      orderId,             // معرف الطلب الخاص بك (InvoiceReferenceID)
      paymentStatus,       // "PAID", "UNPAID", "FAILED"
      paymentMethod,
      transactionId
    } = req.body;

    console.log('🔔 رد فعل من فاتورتك:', orderId, paymentStatus);

    if (!orders[orderId]) {
      console.warn(`⚠️ الطلب ${orderId} غير موجود`);
      return res.status(404).json({ success: false });
    }

    // ✅ تحديث حالة الطلب
    if (paymentStatus === 'PAID') {
      orders[orderId].paymentStatus = 'paid';
      orders[orderId].status = 'processing'; // بدء معالجة الطلب
      orders[orderId].invoiceId = invoiceId;
      orders[orderId].transactionId = transactionId;
      console.log(`✅ تم تأكيد الدفع للطلب: ${orderId}`);
    } else if (paymentStatus === 'FAILED') {
      orders[orderId].paymentStatus = 'failed';
      orders[orderId].status = 'cancelled';
      console.log(`❌ فشل الدفع للطلب: ${orderId}`);
    }

    // ✅ اختياري: احفظ التحديث في قاعدة البيانات
    // await Order.updateOne({ orderId }, { paymentStatus, status });

    res.json({ success: true, message: 'تم التحديث' });

  } catch (error) {
    console.error('❌ خطأ في Webhook:', error);
    res.status(500).json({ success: false });
  }
});

// ============================================================
// 4️⃣ اختياري: فحص حالة الدفع يدويًا (GET /api/orders/:orderId/status)
// ============================================================
app.get('/api/orders/:orderId/status', (req, res) => {
  try {
    const { orderId } = req.params;
    const order = orders[orderId];

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'الطلب غير موجود'
      });
    }

    res.json({
      success: true,
      orderId,
      paymentStatus: order.paymentStatus, // 'paid' أو 'unpaid'
      status: order.status // 'pending', 'processing', 'completed'
    });

  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// ============================================================
// تشغيل الخادم
// ============================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 Endpoints:`);
  console.log(`   POST   /api/orders (حفظ الطلب)`);
  console.log(`   GET    /api/orders/:orderId (جلب الطلب)`);
  console.log(`   POST   /api/fatourah-callback (تحديث من فاتورتك)`);
});

module.exports = app;
