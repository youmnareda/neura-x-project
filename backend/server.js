const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('MongoDB Connected ✅');
})
.catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});

// Only start the server if we're not in a serverless environment
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server Running On Port ${PORT}...`));
}



