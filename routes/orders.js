const {postOrders,getOrders,getOneOrder, acceptOrders} =require('../controllers/orderController');
const express=require('express');
const { checkToken, checkRole } = require('../middleware/auths');
const router=express.Router();

router.route('/').post(checkToken,postOrders).get(checkToken,getOrders);
router.route('/:orderID').get(checkToken,getOneOrder);
router.route('/acceptorder').post(checkToken,checkRole,acceptOrders);

module.exports=router;