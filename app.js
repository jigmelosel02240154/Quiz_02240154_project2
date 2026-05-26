const express = require('express');
const quizRoutes = require('./src/routes/quizRoutes');
const errorHandler = require('./src/middleware/errorHandler');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON bodies automatically
app.use(express.json());

// Serve static assets (index.html, script.js, style.css) right from the root directory
app.use(express.static('.'));

// Mount our Quiz REST API routes
app.use('/api', quizRoutes);

// Register the global centralized error handler middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is streaming quiz resources live at http://localhost:${PORT}`);
});