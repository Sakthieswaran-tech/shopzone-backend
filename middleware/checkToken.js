const jwt=require('jsonwebtoken');
require('dotenv').config();
const checkToken=(req,res,next)=>{
    try{
        const token=req.headers.authorization.split(" ")[1];
        jwt.verify(token,process.env.SECRET_KEY);
        const decoded=jwt.decode(token);
        req.user={...decoded};
        next();
    }catch(error){
        return res.status(404).json({message:error});
    }
}

module.exports=checkToken