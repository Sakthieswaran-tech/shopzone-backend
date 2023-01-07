const { userdb } = require('../connectDB/db');

const otpExist=async(email)=>{
    let db=await userdb();
    let sql="SELECT * FROM setPassword WHERE email=?";
    db.query(sql,[email],(err,res)=>{
        console.log(res);
        if(err){
            return false;
        }else if(res.length>0){
            return true;
        }else{
            return false;
        }
    })
}

const deleteOtp=async(email)=>{
    let db=await userdb();
    let sql="DELETE FROM setPassword WHERE email=?";
    db.query(sql,[email],(err,res)=>{
        if(err){
            console.log(err);
        }else{
            console.log(res);
        }
    })
}

const validateUser=async(id)=>{
    let db=await userdb();
    const sql="UPDATE setPassword SET emailValidated=? WHERE id=?";
    db.query(sql,[true,id],(err,res)=>{
        if(err){
            console.log(err);
        }else{
            console.log(res);
        }
    })
}

module.exports={
    otpExist,
    deleteOtp,
    validateUser
}