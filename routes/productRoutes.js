const router = require('express').Router();
const productController = require('../controllers/productControllers');
const { authGuard, adminGuard } = require('../middleware/authGuard');

// Creating user registration route 

router.post('/create', productController.createProduct)

// fetch all products
router.get('/get_all_products', authGuard, productController.getAllProducts)

// single product 
router.get('/get_single_product/:id', authGuard, productController.getSingleProduct)

// delete products
router.delete('/delete_product/:id',  adminGuard, productController.deleteProduct)

// update product 
router.put('/update_product/:id', authGuard, adminGuard, productController.updateProduct)

router.get('/pagination', productController.paginationProduct)


// exporting the router 
module.exports = router
