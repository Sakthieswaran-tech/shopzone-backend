const express=require('express');

const {
    addUsers,
    registerUser
}=require('../controllers/userController');

const router=express.Router();

router.route('/').post(registerUser);
router.route('/addUser').post(addUsers);

module.exports=router;