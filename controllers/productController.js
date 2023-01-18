const { productdb } = require('../helpers/connectDB/db');
const { generateUserID } = require('../helpers/generators');
const { s3 } = require('../middleware/s3-config');
const { upload } = require('../middleware/s3-config');

const addProduct = async (req, res) => {
    let db = await productdb();
    let data = req.body;
    const sql = "SELECT * FROM products ORDER BY id DESC LIMIT 1";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: err });
        } else {
            const productID = result.length == 0 ? "PROD000001" : generateUserID(result[0].productID, "PROD");
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
    // console.log(req.file);
    // console.log(req.body)
}

const getAllProducts = async (req, res) => {
    console.log(req.data)
    // let data=await s3.listObjectsV2().promise();
    // let products=data.Contents.map(item=>item.Key);
    // return res.status(200).json({ products: products });
}

module.exports = {
    addProduct,
    getAllProducts
}