const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ecommerce API',
      version: '1.0.0',
      description: 'Complete Ecommerce Backend API Documentation',
    },
    servers: [
      { url: 'http://localhost:3000/api', description: 'Development Server' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // ─── User ───────────────────────────────────────────────
        RegisterBody: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name:     { type: 'string', example: 'John Doe' },
            email:    { type: 'string', example: 'john@example.com' },
            password: { type: 'string', example: 'Password123' },
          },
        },
        LoginBody: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email:    { type: 'string', example: 'john@example.com' },
            password: { type: 'string', example: 'Password123' },
          },
        },
        // ─── Category ───────────────────────────────────────────
        CategoryBody: {
          type: 'object',
          required: ['name'],
          properties: { name: { type: 'string', example: 'Electronics' } },
        },
        // ─── SubCategory ────────────────────────────────────────
        SubCategoryBody: {
          type: 'object',
          required: ['name', 'parentCategory'],
          properties: {
            name:           { type: 'string', example: 'Phones' },
            parentCategory: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e1' },
          },
        },
        // ─── Cart ───────────────────────────────────────────────
        AddToCartBody: {
          type: 'object',
          required: ['productId', 'quantity'],
          properties: {
            productId: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e1' },
            quantity:  { type: 'number', example: 2 },
          },
        },
        // ─── Order ──────────────────────────────────────────────
        CreateOrderBody: {
          type: 'object',
          required: ['shippingAddress', 'phone'],
          properties: {
            shippingAddress: {
              type: 'object',
              properties: {
                street:      { type: 'string', example: '123 Main St' },
                city:        { type: 'string', example: 'Cairo' },
                governorate: { type: 'string', example: 'Cairo' },
              },
            },
            phone: { type: 'string', example: '01012345678' },
          },
        },
        // ─── FAQ ────────────────────────────────────────────────
        FAQBody: {
          type: 'object',
          required: ['question', 'answer'],
          properties: {
            question: { type: 'string', example: 'What is the return policy' },
            answer:   { type: 'string', example: 'You can return within 14 days' },
          },
        },
        // ─── Overview ───────────────────────────────────────────
        OverviewBody: {
          type: 'object',
          required: ['message'],
          properties: {
            message: { type: 'string', example: 'Great service!' },
            rating:  { type: 'number', example: 5, minimum: 1, maximum: 5 },
          },
        },
      },
    },
    tags: [
      { name: 'Users' },
      { name: 'Products' },
      { name: 'Categories' },
      { name: 'SubCategories' },
      { name: 'Cart' },
      { name: 'Orders' },
      { name: 'Wishlist' },
      { name: 'FAQs' },
      { name: 'Overviews' },
    ],
    paths: {
      // ════════════════════════════════════════════════════════════
      // USERS
      // ════════════════════════════════════════════════════════════
      '/users/register': {
        post: {
          tags: ['Users'], summary: 'Register a new user',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterBody' } } } },
          responses: { 201: { description: 'User created successfully' }, 400: { description: 'Email already exists' } },
        },
      },
      '/users/login': {
        post: {
          tags: ['Users'], summary: 'Login',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginBody' } } } },
          responses: { 200: { description: 'Logged in successfully' }, 401: { description: 'Incorrect email or password' } },
        },
      },
      '/users/add-admin': {
        post: {
          tags: ['Users'], summary: 'Add admin (Admin only)', security: [{ bearerAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterBody' } } } },
          responses: { 201: { description: 'Admin created successfully' } },
        },
      },
      '/users/': {
        get: {
          tags: ['Users'], summary: 'Get my profile', security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'User data' }, 404: { description: 'User not found' } },
        },
        put: {
          tags: ['Users'], summary: 'Update my profile', security: [{ bearerAuth: [] }],
          requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, email: { type: 'string' } } } } } },
          responses: { 200: { description: 'Profile updated successfully' } },
        },
        delete: {
          tags: ['Users'], summary: 'Delete my account', security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'User deleted successfully' } },
        },
      },
      '/users/password': {
        patch: {
          tags: ['Users'], summary: 'Change password', security: [{ bearerAuth: [] }],
          requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { oldPassword: { type: 'string' }, newPassword: { type: 'string' } } } } } },
          responses: { 200: { description: 'Password changed successfully' } },
        },
      },
      '/users/all': {
        get: {
          tags: ['Users'], summary: 'Get all users (Admin)', security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Users list' } },
        },
      },
      '/users/admins': {
        get: {
          tags: ['Users'], summary: 'Get all admins (Admin)', security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Admins list' } },
        },
      },
      '/users/{id}': {
        get: {
          tags: ['Users'], summary: 'Get user by ID (Admin)', security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'User data' }, 404: { description: 'User not found' } },
        },
        delete: {
          tags: ['Users'], summary: 'Delete user by ID (Admin)', security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'User deleted successfully' } },
        },
      },
      // ════════════════════════════════════════════════════════════
      // PRODUCTS
      // ════════════════════════════════════════════════════════════
      '/products': {
        get: {
          tags: ['Products'], summary: 'Get all products with filters',
          parameters: [
            { name: 'category',    in: 'query', schema: { type: 'string' } },
            { name: 'subCategory', in: 'query', schema: { type: 'string' } },
            { name: 'minPrice',    in: 'query', schema: { type: 'number' } },
            { name: 'maxPrice',    in: 'query', schema: { type: 'number' } },
            { name: 'search',      in: 'query', schema: { type: 'string' } },
            { name: 'sort',        in: 'query', schema: { type: 'string', enum: ['newest', 'oldest', 'priceAsc', 'priceDesc'] } },
          ],
          responses: { 200: { description: 'Products list' } },
        },
        post: {
          tags: ['Products'], summary: 'Create product (Admin)', security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  required: ['title', 'price', 'category', 'subCategory', 'image'],
                  properties: {
                    title:       { type: 'string' },
                    description: { type: 'string' },
                    price:       { type: 'number' },
                    stock:       { type: 'number' },
                    category:    { type: 'string' },
                    subCategory: { type: 'string' },
                    image:       { type: 'string', format: 'binary' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Product created successfully' } },
        },
      },
      '/products/{slug}': {
        get: {
          tags: ['Products'], summary: 'Get product by slug',
          parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Product details' }, 404: { description: 'Product not found' } },
        },
      },
      '/products/{id}': {
        put: {
          tags: ['Products'], summary: 'Update product (Admin)', security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: { content: { 'multipart/form-data': { schema: { type: 'object', properties: { title: { type: 'string' }, price: { type: 'number' }, image: { type: 'string', format: 'binary' } } } } } },
          responses: { 200: { description: 'Product updated successfully' } },
        },
        delete: {
          tags: ['Products'], summary: 'Delete product (Admin)', security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Product deleted successfully' } },
        },
      },
      // ════════════════════════════════════════════════════════════
      // CATEGORIES
      // ════════════════════════════════════════════════════════════
      '/categories': {
        get: { tags: ['Categories'], summary: 'Get all categories', responses: { 200: { description: 'Categories list' } } },
        post: {
          tags: ['Categories'], summary: 'Add category (Admin)', security: [{ bearerAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CategoryBody' } } } },
          responses: { 201: { description: 'Category created' }, 400: { description: 'Category already exists' } },
        },
      },
      '/categories/{id}': {
        put: {
          tags: ['Categories'], summary: 'Update category (Admin)', security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/CategoryBody' } } } },
          responses: { 200: { description: 'Category updated' } },
        },
        delete: {
          tags: ['Categories'], summary: 'Delete category (Admin)', security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Category deleted' } },
        },
      },
      // ════════════════════════════════════════════════════════════
      // SUBCATEGORIES
      // ════════════════════════════════════════════════════════════
      '/sub-categories': {
        get: { tags: ['SubCategories'], summary: 'Get all subcategories', responses: { 200: { description: 'SubCategories list' } } },
        post: {
          tags: ['SubCategories'], summary: 'Add subcategory (Admin)', security: [{ bearerAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/SubCategoryBody' } } } },
          responses: { 201: { description: 'SubCategory created' } },
        },
      },
      '/sub-categories/{id}': {
        get: {
          tags: ['SubCategories'], summary: 'Get subcategory by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'SubCategory details' } },
        },
        put: {
          tags: ['SubCategories'], summary: 'Update subcategory (Admin)', security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/SubCategoryBody' } } } },
          responses: { 200: { description: 'SubCategory updated' } },
        },
        delete: {
          tags: ['SubCategories'], summary: 'Delete subcategory (Admin)', security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'SubCategory deleted' } },
        },
      },
      // ════════════════════════════════════════════════════════════
      // CART
      // ════════════════════════════════════════════════════════════
      '/cart': {
        get: { tags: ['Cart'], summary: 'Get cart', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Cart data' } } },
        post: {
          tags: ['Cart'], summary: 'Add to cart', security: [{ bearerAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/AddToCartBody' } } } },
          responses: { 200: { description: 'Product added to cart' } },
        },
      },
      '/cart/clear': {
        delete: { tags: ['Cart'], summary: 'Clear cart', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Cart cleared' } } },
      },
      '/cart/{id}': {
        put: {
          tags: ['Cart'], summary: 'Update quantity', security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { quantity: { type: 'number' } } } } } },
          responses: { 200: { description: 'Quantity updated' } },
        },
        delete: {
          tags: ['Cart'], summary: 'Remove from cart', security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Product removed' } },
        },
      },
      '/cart/{id}/price': {
        patch: {
          tags: ['Cart'], summary: 'Accept changed price', security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Price updated' } },
        },
      },
      // ════════════════════════════════════════════════════════════
      // ORDERS
      // ════════════════════════════════════════════════════════════
      '/orders': {
        get: { tags: ['Orders'], summary: 'Get all orders (Admin)', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Orders list' } } },
        post: {
          tags: ['Orders'], summary: 'Create order', security: [{ bearerAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateOrderBody' } } } },
          responses: { 201: { description: 'Order created' }, 400: { description: 'Cart is empty or not enough stock' } },
        },
      },
      '/orders/my-orders': {
        get: { tags: ['Orders'], summary: 'Get my orders', security: [{ bearerAuth: [] }], responses: { 200: { description: 'My orders' } } },
      },
      '/orders/{id}': {
        get: {
          tags: ['Orders'], summary: 'Get order by ID (Admin)', security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Order details' } },
        },
        delete: {
          tags: ['Orders'], summary: 'Delete order (Admin)', security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Order deleted' } },
        },
      },
      '/orders/{id}/cancel': {
        patch: {
          tags: ['Orders'], summary: 'Cancel order', security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Order cancelled' }, 400: { description: 'Cannot cancel' } },
        },
      },
      '/orders/{id}/status': {
        patch: {
          tags: ['Orders'], summary: 'Update order status (Admin)', security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', enum: ['pending', 'preparing', 'shipped', 'delivered', 'cancelled', 'rejected'] } } } } } },
          responses: { 200: { description: 'Status updated' } },
        },
      },
      // ════════════════════════════════════════════════════════════
      // WISHLIST
      // ════════════════════════════════════════════════════════════
      '/wishlist': {
        get: { tags: ['Wishlist'], summary: 'Get wishlist', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Wishlist data' } } },
        post: {
          tags: ['Wishlist'], summary: 'Add to wishlist', security: [{ bearerAuth: [] }],
          requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { productId: { type: 'string' } } } } } },
          responses: { 200: { description: 'Added to wishlist' } },
        },
      },
      '/wishlist/clear': {
        delete: { tags: ['Wishlist'], summary: 'Clear wishlist', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Wishlist cleared' } } },
      },
      '/wishlist/{id}': {
        delete: {
          tags: ['Wishlist'], summary: 'Remove from wishlist', security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Removed from wishlist' } },
        },
      },
      '/wishlist/{id}/move-to-cart': {
        post: {
          tags: ['Wishlist'], summary: 'Move to cart', security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Moved to cart' } },
        },
      },
      // ════════════════════════════════════════════════════════════
      // FAQS
      // ════════════════════════════════════════════════════════════
      '/faqs': {
        get: { tags: ['FAQs'], summary: 'Get all FAQs', responses: { 200: { description: 'FAQs list' } } },
        post: {
          tags: ['FAQs'], summary: 'Add FAQ (Admin)', security: [{ bearerAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/FAQBody' } } } },
          responses: { 201: { description: 'FAQ created' } },
        },
      },
      '/faqs/{id}': {
        put: {
          tags: ['FAQs'], summary: 'Update FAQ (Admin)', security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/FAQBody' } } } },
          responses: { 200: { description: 'FAQ updated' } },
        },
        delete: {
          tags: ['FAQs'], summary: 'Delete FAQ (Admin)', security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'FAQ deleted' } },
        },
      },
      // ════════════════════════════════════════════════════════════
      // OVERVIEWS
      // ════════════════════════════════════════════════════════════
      '/overviews': {
        get: { tags: ['Overviews'], summary: 'Get all approved overviews', responses: { 200: { description: 'Overviews list' } } },
        post: {
          tags: ['Overviews'], summary: 'Add overview', security: [{ bearerAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/OverviewBody' } } } },
          responses: { 201: { description: 'Overview submitted' } },
        },
      },
      '/overviews/{id}/approve': {
        patch: {
          tags: ['Overviews'], summary: 'Approve / Reject overview (Admin)', security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { isApproved: { type: 'boolean' } } } } } },
          responses: { 200: { description: 'Overview approved/rejected' } },
        },
      },
      '/overviews/{id}': {
        delete: {
          tags: ['Overviews'], summary: 'Delete overview (Admin)', security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Overview deleted' } },
        },
      },
    },
  },
  apis: [],
};

module.exports = swaggerJsdoc(options);