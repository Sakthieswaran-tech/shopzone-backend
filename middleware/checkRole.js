const checkRole=(req,res,next)=>{
    if(req.user.detais.role!=='vendor'){
        return res.status(401).json({message:"unauthorized"});
    }
    next();
}

module.exports=checkRole;