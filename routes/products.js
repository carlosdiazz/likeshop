const express = require('express');
const router = express.Router();
const {database}=require("../config/helpers")

/* GET ALL PRODUCTS */
router.get('/', function(req, res,) {
  let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1; //Saber numero de pagina actual
  const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10;// establecer límite de elementos por página
  let startValue;
  let endValue;



  if (page > 0) {
    startValue = (page * limit) - limit;     // 0, 10, 20, 30
    endValue = page * limit;                  // 10, 20, 30, 40
  } else {
    startValue = 0;
    endValue = 10;


  }
  database.table('products as p')
  .join([
    {
      table: "categories as c",
      on: `c.id = p.cat_id`
    }
  ])
  .withFields(['c.title as category',
  'p.title as name',
  'p.price',
  'p.quantity',
  'p.description',
  'p.image',
  'p.id'
  ])
  .slice(startValue, endValue)
  .sort({id: 1})
  .getAll()
  .then(prods => {
      if (prods.length > 0) {
          res.status(200).json({
              count: prods.length,
              products: prods
          });
      } else {
        res.json({message: "No products found"});
      }
  })
  .catch(err => res.json(err));

});


/* TENER UN UNICO PRODUCTO */
router.get('/:prodId', (req, res)=>{

  let productId = req.params.prodId;
  console.log(productId);

  database.table('products as p')
  .join([
    {
      table: "categories as c",
      on: `c.id = p.cat_id`
    }
  ])
  .withFields(['c.title as category',
  'p.title as name',
  'p.price',
  'p.quantity',
  'p.description',
  'p.image',
  'p.images',
  'p.id'
  ])
  .filter({'p.id' :productId})
  .get()
  .then(prod => {
    if (prod){
          res.status(200).json(prod);
      } else {
        res.json({message: `No se ha encontrado el producto id ${productId}`});
      }
  })
  .catch(err => res.json(err));

});

/* TENER TODOS LOS PRODUCTOS DE UNA UNICA CATEGORIA */
router.get('/category/:catName',(req, res)=>{ 
  let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1; //Saber numero de pagina actual
  const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10;// establecer límite de elementos por página
  let startValue;
  let endValue;



  if (page > 0) {
    startValue = (page * limit) - limit;     // 0, 10, 20, 30
    endValue = page * limit;                  // 10, 20, 30, 40
  } else {
    startValue = 0;
    endValue = 10;


  }

  const cat_title = req.params.catName;
  // busca el nombre de la categoria de la url
  database.table('products as p')
  .join([
    {
      table: "categories as c",
      on: `c.id = p.cat_id WHERE c.title LIKE '%${cat_title}%'`
    }
  ])
  .withFields(['c.title as category',
  'p.title as name',
  'p.price',
  'p.quantity',
  'p.description',
  'p.image',
  'p.id'
  ])
  .slice(startValue, endValue)
  .sort({id: 1})
  .getAll()
  .then(prods => {
      if (prods.length > 0) {
          res.status(200).json({
              count: prods.length,
              products: prods
          });
      } else {
        res.json({message: `No se encontraron los producto en ${cat_title} category.`});
      }
  })
  .catch(err => res.json(err));

});
  

module.exports = router;
