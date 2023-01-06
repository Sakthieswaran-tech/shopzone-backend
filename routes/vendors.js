const {addVendor}=require('../controllers/vendorController');

const express=require('express');
const router=express.Router();

router.route('/addVendor').post(addVendor);

module.exports=router;