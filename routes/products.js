const {
    addProduct,
    getAllProducts,
    getProduct,
    addMoreImages
}=require('../controllers/productController');
const {
    checkRole,
    checkToken
}=require('../middleware/auths');

const {upload}=require('../middleware/s3-config');  

const express=require('express');
const router=express.Router();

router.route('/').get(checkToken,getAllProducts).post(checkToken,checkRole,upload.single('file'),addProduct);
router.route('/:productID').get(checkToken,getProduct).patch(checkToken,checkRole,upload.single('file'),addMoreImages);

module.exports=router;