const express=require('express');

const {
    addUsers,
    registerUser,
    checkOtp
}=require('../controllers/userController');

const router=express.Router();

router.route('/').post(registerUser);
router.route('/checkotp').post(checkOtp);
router.route('/addUser').post(addUsers);

module.exports=router;