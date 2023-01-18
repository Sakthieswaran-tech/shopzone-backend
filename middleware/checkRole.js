const checkRole=(req,res,next)=>{
    if(req.user.detais.role!=='vendor'){
        return res.status(401).json({message:"Only vendors can add products"});
    }
    next();
}

module.exports=checkRole;