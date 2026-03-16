const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const path = require('node:path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger.config');
const corsMiddleware = require('./src/middlewares/cors.middleware');
const connectDB = require('./src/config/db.config');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middlewares ──────────────────────────────────────────────────────────────
app.use(corsMiddleware);
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Logger (debug) ───────────────────────────────────────────────────────────
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// ─── Swagger Docs ─────────────────────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/users',          require('./src/routes/user.route'));
app.use('/api/cart',           require('./src/routes/cart.route'));
app.use('/api/products',       require('./src/routes/product.route'));
app.use('/api/categories',     require('./src/routes/category.route'));
app.use('/api/sub-categories', require('./src/routes/subCategory.route'));
app.use('/api/orders',         require('./src/routes/order.route'));
app.use('/api/faqs',           require('./src/routes/faq.route'));
app.use('/api/overviews',      require('./src/routes/overview.route'));
app.use('/api/wishlist',       require('./src/routes/wishlist.route'));
app.use('/api/hero-settings',  require('./src/routes/heroSettings.route'));
app.use('/api/notifications',  require('./src/routes/notification.route'));
// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(`Global Error: ${err.message}`);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// ─── Database + Server ────────────────────────────────────────────────────────
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📄 Swagger docs at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => console.error(`❌ Database connection failed: ${err.message}`));