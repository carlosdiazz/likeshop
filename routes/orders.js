const express = require('express');
const router = express.Router();

const {database}=require('../config/helpers');

/* Obtener todos los pedidos */
router.get('/', (req, res) => {
  database.table('orders_details as od')
      .join([
          {
              table: 'orders as o',
              on: 'o.id = od.order_id'
          },
          {
              table: 'products as p',
              on: 'p.id = od.product_id'
          },
          {
              table: 'users as u',
              on: 'u.id = o.user_id'
          }
      ])
      .withFields(['o.id', 'p.title', 'p.description', 'p.price', 'u.username'])
      .getAll()
      .then(orders => {
          if (orders.length > 0) {
              res.json(orders);
          } else {
              res.json({message: "No se encontraron pedidos"});
          }

      }).catch(err => res.json(err));
});


// Obtener solo un a orden
router.get('/:id', async (req, res) => {
  let orderId = req.params.id;
  console.log(orderId);

  database.table('orders_details as od')
      .join([
          {
              table: 'orders as o',
              on: 'o.id = od.order_id'
          },
          {
              table: 'products as p',
              on: 'p.id = od.product_id'
          },
          {
              table: 'users as u',
              on: 'u.id = o.user_id'
          }
      ])
      .withFields(['o.id', 'p.title', 'p.description', 'p.price', 'p.image', 'od.quantity as quantityOrdered'])
      .filter({'o.id': orderId})
      .getAll()
      .then(orders => {
          console.log(orders);
          if (orders.length > 0) {
              res.json(orders);
          } else {
              res.json({message: "No orders found"});
          }

      }).catch(err => res.json(err));
});


// Realizar nuevo pedido
router.post('/new', async (req, res) => {
  // let userId = req.body.userId;
  // let data = JSON.parse(req.body);
  let {userId, products} = req.body;
  console.log(userId);
  console.log(products);

   if (userId !== null && userId > 0) {
      database.table('orders')
          .insert({
              user_id: userId
          }).then((newOrderId) => {

          if (newOrderId > 0) {
              products.forEach(async (p) => {

                      let data = await database.table('products').filter({id: p.id}).withFields(['quantity']).get();



                  let inCart = parseInt(p.incart);

                  // Deducir el número de piezas pedidas de la cantidad en la base de datos

                  if (data.quantity > 0) {
                      data.quantity = data.quantity - inCart;

                      if (data.quantity < 0) {
                          data.quantity = 0;
                      }

                  } else {
                      data.quantity = 0;
                  }

                  // Inserte los detalles del pedido con el ID del pedido recién creado
                  database.table('orders_details')
                      .insert({
                          order_id: newOrderId,
                          product_id: p.id,
                          quantity: inCart
                      }).then(newId => {
                      database.table('products')
                          .filter({id: p.id})
                          .update({
                              quantity: data.quantity
                          }).then(successNum => {
                      }).catch(err => console.log(err));
                  }).catch(err => console.log(err));
              });

          } else {
              res.json({message: 'El nuevo pedido falló al agregar los detalles del pedido', success: false});
          }
          res.json({
              message: `Pedido realizado correctamente con ID de pedido ${newOrderId}`,
              success: true,
              order_id: newOrderId,
              products: products
          })
      }).catch(err => res.json(err));
  }

  else {
      res.json({message: 'Nuevo pedido falló', success: false});
  }

});

// Payment Gateway
router.post('/payment', (req, res) => {
  setTimeout(() => {
      res.status(200).json({success: true});
  }, 3000)
});




module.exports = router;
