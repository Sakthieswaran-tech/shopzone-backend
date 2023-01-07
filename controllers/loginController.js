const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
require('dotenv').config();
const {userdb}=require('../helpers/connectDB/db');

const SECRET_KEY=process.env.SECRET_KEY;

const fetchToken=async(req,res)=>{
    let db=await userdb();
    let data=req.body;
    const sql="SELECT * FROM users WHERE email=?";
    db.query(sql,[data.email],(err,result)=>{
        if(err){
            return res.status(500).json({message:err});
        }else if(result.length==0){
            return res.status(404).json({message:"User not found with given email"});
        }else{
            bcrypt.compare(data.password,result[0].password,(err,resp)=>{
                if(err){
                    return res.status(500).json({message:err});
                }else if(!resp){
                    return res.status(401).json({message:"Incorrect password"});
                }else{
                    let detais={
                        userID:result[0].userID,
                        email:result[0].email,
                        role:result[0].role,
                        username:result[0].username
                    }
                    const token=jwt.sign({detais},SECRET_KEY);
                    return res.status(200).json({token});
                }
            })
        }
    })
}

module.exports={
    fetchToken
}