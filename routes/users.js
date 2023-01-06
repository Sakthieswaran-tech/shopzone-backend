const express=require('express');

const {
    registerUser,
    checkOtp,
    addUsers,
}=require('../controllers/userController');

const router=express.Router();

router.route('/otpgen').post(registerUser);
router.route('/checkotp').post(checkOtp);
router.route('/addUser').post(addUsers);

module.exports=router;