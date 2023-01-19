const { productdb } = require('../helpers/connectDB/db');
const { generateID } = require('../helpers/generators');

const addProduct = async (req, res) => {
    let db = await productdb();
    let data = req.body;
    const sql = "SELECT * FROM products ORDER BY id DESC LIMIT 1";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: err });
        } else {
            const productID = result.length == 0 ? "PROD000001" : generateID(result[0].productID, "PROD");
            const userID = req.user.detais.userID;
            const sql = "SELECT vendorID from vendors WHERE userID=?";
            db.query(sql, [userID], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ message: err });
                } else {
                    const vendorID = result[0].vendorID;
                    const sql = "INSERT INTO products (productID,vendorID,description,price,quantity,category,soldQuantity,rating,totalSoldQuantity,productImage,productName) VALUES(?,?,?,?,?,?,?,?,?,?,?)";
                    db.query(sql, [productID, vendorID, data.description, data.price, data.quantity, data.category, 0, 0, 0, req.file.location,data.productName], (err, result) => {
                        if(err){
                            console.log(err);
                            return res.status(500).json({ message: err });
                        }else{
                            return res.status(201).json({ message: "product added" });
                        }
                    })
                }
            })
        }
    })
}

const addMoreImages=async(req,res)=>{
    let db=await productdb();
    let id=req.params.productID;
    let column="productImage"+req.body.flag;
    const sql=`UPDATE products SET ${column}=? WHERE productID=?`;
    db.query(sql,[req.file.location,id],(err,result)=>{
        if(err){
            return res.status(500).json({error:err});
        }else{
            return res.status(201).json({message:"Image added"});
        }
    })
}

const getAllProducts = async (req, res) => {
    let db=await productdb();
    const sql="SELECT * FROM products";
    db.query(sql,(err,result)=>{
        if(err){
            return res.status(500).json({error:err});
        }else{
            return res.status(200).json({products:result});
        }
    })
}

const getProduct=async(req,res)=>{
    let db=await productdb();
    let id=req.params.productID;
    const sql="SELECT * from products WHERE productID=?";
    db.query(sql,[id],(err,result)=>{
        if(err){
            return res.status(500).json({error:err});
        }else if(result.length==0){
            return res.status(404).json({message:"No product found"});
        }else{
            return res.status(200).json({product:result});
        }
    })
}

module.exports = {
    addProduct,
    getAllProducts,
    getProduct,
    addMoreImages
}