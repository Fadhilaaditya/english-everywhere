const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const exampleRoutes = require('./routes/exampleRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/example', exampleRoutes);
app.use('/api/auth', authRoutes);

// Root Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the backend API' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

module.exports = app;
