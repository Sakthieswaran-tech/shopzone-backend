const {productdb}=require('../helpers/connectDB/db');

const addProduct=(req,res)=>{
    return res.status(201).json({message:"product added"});
}

const getAllProducts=(req,res)=>{
    return res.status(200).json({products:[]});
}

module.exports={
    addProduct,
    getAllProducts
}