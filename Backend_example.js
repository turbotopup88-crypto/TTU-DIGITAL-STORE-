// ============================================================
// مثال API Backend - Node.js + Express
// ============================================================

const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'https://your-website.com', // ✅ عدّل هنا
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));

// قاعدة بيانات مؤقتة (استخدم MongoDB أو أي قاعدة بيانات أخرى)
const orders = {};

// ============================================================
// 1️⃣ إنشاء طلب جديد (POST /api/orders)
// ============================================================
app.post('/api/orders', async (req, res) => {
  try {
    const { customer, items, total, paymentMethod, orderDate } = req.body;

    // ✅ التحقق من البيانات
    if (!customer || !customer.name || !customer.phone) {
      return res.status(400).json({
        success: false,
        error: 'بيانات العميل غير كاملة'
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'لا توجد منتجات في الطلب'
      });
    }

    // توليد معرف الطلب
    const orderId = `ORD-${Date.now()}`;
    const invoiceId = `INV-${Date.now()}`;

    // بناء كائن الطلب
    const order = {
      orderId,
      invoiceId,
      status: 'pending', // pending, processing, completed
      customer,
      items,
      total,
      paymentMethod,
      orderDate: orderDate || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // حفظ الطلب (في قاعدة البيانات)
    orders[orderId] = order;

    // ✅ اختياري: إرسال بريد إلكتروني للعميل
    // await sendOrderConfirmationEmail(customer.email, order);

    // ✅ اختياري: حفظ في قاعدة البيانات الحقيقية
    // await Order.create(order);

    console.log('✅ تم إنشاء طلب جديد:', orderId);

    res.json({
      success: true,
      message: 'تم إنشاء الطلب بنجاح',
      orderId,
      invoiceId,
      redirectUrl: `/invoices?orderId=${orderId}`
    });

  } catch (error) {
    console.error('❌ خطأ في إنشاء الطلب:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ في معالجة الطلب'
    });
  }
});

// ============================================================
// 2️⃣ جلب بيانات الطلب (GET /api/orders/:orderId)
// ============================================================
app.get('/api/orders/:orderId', (req, res) => {
  try {
    const { orderId } = req.params;

    // البحث عن الطلب
    const order = orders[orderId];

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'الطلب غير موجود'
      });
    }

    // ✅ اختياري: جلب من قاعدة البيانات
    // const order = await Order.findOne({ orderId });

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('❌ خطأ في جلب الطلب:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ في جلب الطلب'
    });
  }
});

// ============================================================
// 3️⃣ تحديث حالة الطلب (PUT /api/orders/:orderId)
// ============================================================
app.put('/api/orders/:orderId', (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, paymentStatus } = req.body;

    if (!orders[orderId]) {
      return res.status(404).json({
        success: false,
        error: 'الطلب غير موجود'
      });
    }

    // تحديث الطلب
    if (status) orders[orderId].status = status;
    if (paymentStatus) orders[orderId].paymentStatus = paymentStatus;
    orders[orderId].updatedAt = new Date().toISOString();

    console.log(`✅ تم تحديث الطلب ${orderId}`);

    res.json({
      success: true,
      message: 'تم تحديث الطلب',
      data: orders[orderId]
    });

  } catch (error) {
    console.error('❌ خطأ في تحديث الطلب:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ في تحديث الطلب'
    });
  }
});

// ============================================================
// 4️⃣ جلب جميع الطلبات (GET /api/orders)
// ============================================================
app.get('/api/orders', (req, res) => {
  try {
    const allOrders = Object.values(orders);
    
    res.json({
      success: true,
      count: allOrders.length,
      data: allOrders
    });
  } catch (error) {
    console.error('❌ خطأ في جلب الطلبات:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ في جلب الطلبات'
    });
  }
});

// ============================================================
// 5️⃣ حذف الطلب (DELETE /api/orders/:orderId)
// ============================================================
app.delete('/api/orders/:orderId', (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orders[orderId]) {
      return res.status(404).json({
        success: false,
        error: 'الطلب غير موجود'
      });
    }

    delete orders[orderId];
    console.log(`✅ تم حذف الطلب ${orderId}`);

    res.json({
      success: true,
      message: 'تم حذف الطلب'
    });
  } catch (error) {
    console.error('❌ خطأ في حذف الطلب:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ في حذف الطلب'
    });
  }
});

// ============================================================
// اختياري: إرسال بريد إلكتروني
// ============================================================
async function sendOrderConfirmationEmail(email, order) {
  // استخدم Nodemailer أو SendGrid
  // مثال (SendGrid):
  /*
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email,
    from: 'orders@your-website.com',
    subject: `تأكيد الطلب: ${order.orderId}`,
    html: `
      <h2>شكراً لك على طلبك!</h2>
      <p>معرف الطلب: ${order.orderId}</p>
      <p>الإجمالي: ${order.total}</p>
      <p><a href="https://your-website.com/invoices?orderId=${order.orderId}">عرض الفاتورة</a></p>
    `
  };

  await sgMail.send(msg);
  */
}

// ============================================================
// اختياري: معالج الويب هوك (Webhook) للدفع
// ============================================================
app.post('/api/webhooks/payment', (req, res) => {
  try {
    const { orderId, paymentStatus } = req.body;

    if (orders[orderId]) {
      orders[orderId].paymentStatus = paymentStatus; // 'completed', 'failed'
      orders[orderId].status = paymentStatus === 'completed' ? 'processing' : 'failed';
      console.log(`✅ تم تحديث حالة الدفع للطلب ${orderId}`);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('❌ خطأ في معالج الويب هوك:', error);
    res.status(500).json({ success: false });
  }
});

// ============================================================
// اختياري: التحقق من حالة الدفع (3D Secure, etc)
// ============================================================
app.post('/api/verify-payment', (req, res) => {
  try {
    const { orderId, transactionId } = req.body;

    // تحقق من المعاملة مع بوابة الدفع
    const paymentVerified = true; // استبدل برمز التحقق الحقيقي

    if (paymentVerified && orders[orderId]) {
      orders[orderId].paymentStatus = 'verified';
      orders[orderId].transactionId = transactionId;
      orders[orderId].status = 'completed';
    }

    res.json({
      success: paymentVerified,
      message: paymentVerified ? 'تم التحقق من الدفع' : 'فشل التحقق'
    });
  } catch (error) {
    console.error('❌ خطأ في التحقق:', error);
    res.status(500).json({ success: false });
  }
});

// ============================================================
// تشغيل الخادم
// ============================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📍 Endpoints:`);
  console.log(`   POST   /api/orders`);
  console.log(`   GET    /api/orders/:orderId`);
  console.log(`   GET    /api/orders`);
  console.log(`   PUT    /api/orders/:orderId`);
  console.log(`   DELETE /api/orders/:orderId`);
});

// ============================================================
// Export للاستخدام في اختبارات
// ============================================================
module.exports = app;
