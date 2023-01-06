const express=require('express');
const {
    fetchToken
}=require('../controllers/loginController');

const router=express.Router();

router.route('/token').post(fetchToken);

module.exports=router;