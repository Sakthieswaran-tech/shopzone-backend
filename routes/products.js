const {addProduct,getAllProducts}=require('../controllers/productController');
const checkToken=require('../middleware/checkToken');
const checkRole=require('../middleware/checkRole');

const express=require('express');
const router=express.Router();

router.route('/').get(checkToken,getAllProducts).post(checkToken,checkRole,addProduct);

module.exports=router;