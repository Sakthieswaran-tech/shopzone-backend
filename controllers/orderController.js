const { orderdb } = require("../helpers/connectDB/db");
const { addOrders} = require("../helpers/dbOps/orderQueries");
const { generateID } = require("../helpers/generators");

const postOrders = async (req, res) => {
    try{
        let db = await orderdb();
        let data = req.body;
        const sql = "SELECT * FROM orders ORDER BY id DESC LIMIT 1";
        const [id,_]=await db.query(sql);
        const orderID=id.length==0?'ORDE000001':generateID(id[0].orderID, "ORDE")
        await addOrders(data,orderID,req.user.detais.userID,res);
        return res.status(201).json({message:"Order created"});
    }catch(error){
        return res.status(500).json({error});
    }
}

module.exports = {
    postOrders
}