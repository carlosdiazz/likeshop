const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const app = express();


//Import Rutas
const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users');
const orderRouter = require('./routes/orders');

app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);

/*CORS */
app.use(cors({
  origin: '*',
  methods: ['GET', 'PUT', 'DELETE', 'PATCH', 'POST'],
  allowedHeaders: 'Content-Type, Authorization, Origin, X-Requested-With, Accept'
}));



app.use('/api/orders', orderRouter);

module.exports = app;
