const {addProduct,getAllProducts}=require('../controllers/productController');
const checkToken=require('../middleware/checkToken');
const checkRole=require('../middleware/checkRole');
const {upload}=require('../middleware/s3-config');  

const express=require('express');
const router=express.Router();

router.route('/').get(checkToken,getAllProducts).post(checkToken,checkRole,upload.single('file'),addProduct);

module.exports=router;