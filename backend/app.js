const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const scanRoutes = require('./routes/scanRoutes');
const profileRoutes = require('./routes/profileRoutes');
const adminRoutes = require('./routes/adminRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');






const app = express();



// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.set('trust proxy', 1); // 1 معناها أول proxy


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatbotRoutes);







// serve uploads folder
app.use('/uploads', express.static('uploads'));



// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "BrainScan API Documentation"
}));



// Error Handling
app.use(notFound);
app.use(errorHandler);



module.exports = app;
