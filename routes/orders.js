const {postOrders} =require('../controllers/orderController');
const express=require('express');
const { checkToken } = require('../middleware/auths');
const router=express.Router();

router.route('/').post(checkToken,postOrders);

module.exports=router;