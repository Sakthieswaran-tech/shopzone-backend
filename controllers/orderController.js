const { orderdb } = require("../helpers/connectDB/db");
const { addOrders,changeProducts} = require("../helpers/dbOps/orderQueries");
const { generateID } = require("../helpers/generators");

const postOrders = async (req, res) => {
    try{
        let db = await orderdb();
        let data = req.body;
        const sql = "SELECT * FROM orders ORDER BY id DESC LIMIT 1";
        const [id,_]=await db.query(sql);
        const orderID=id.length==0?'ORDE000001':generateID(id[0].orderID, "ORDE")
        await addOrders(data,orderID,req.user.detail.userID,res);
        return res.status(201).json({message:"Order created"});
    }catch(error){
        return res.status(500).json({error});
    }
}

const getOrders=async(req,res)=>{
    try{
        let db=await orderdb();
        let id,sql;
        if(req.query.vendorID){
            id=req.query.vendorID;
            if(id!=req.user.detail.vendorID){
                return res.status(401).json({message:"you don't have access"});
            }
            sql="SELECT orderID,COUNT(*) AS orders FROM orders WHERE vendor=? GROUP BY orderID";
        }else{
            id=req.query.userID;
            if(id!=req.user.detail.userID){
                return res.status(401).json({message:"No access"});
            }
            sql="SELECT orderID,COUNT(*) AS orders FROM orders WHERE orderedBy=? GROUP BY orderID";
        }
        let [orders,_]=await db.query(sql,[id]);
        if(orders.length==0){
            return res.status(404).json({message:"No orders available"});
        }
        return res.status(200).json({orders})
    }catch(error){
        return res.status(500).json({error});
    }
}

const getOneOrder=async(req,res)=>{
    try{
        let db=await orderdb();
        let orderID=req.params.orderID;
        let id,sql;
        if(req.query.vendorID){
            id=req.query.vendorID;
            if(id!=req.user.detail.vendorID){
                return res.status(401).json({message:"you don't have access"});
            }
            sql="SELECT * FROM orders WHERE orderID=? AND vendor=?";
        }else{
            id=req.query.userID;
            if(id!=req.user.detail.userID){
                return res.status(401).json({message:"No access"});
            }
            sql="SELECT * FROM orders WHERE orderID=? AND orderedBy=?";
        }
        let [order,_]=await db.query(sql,[orderID,id]);
        if(order.length==0){
            return res.status(404).json({message:"Order not found"});
        }
        return res.status(200).json({order});
    }catch(error){
        return res.status(500).json({error});
    }
}

const acceptOrders=async(req,res)=>{
    try{
        let db=await orderdb();
        let orderID=req.body.orderID;
        const sql="SELECT * FROM orders WHERE orderID=?";
        let [orders,_]=await db.query(sql,[orderID]);
        await changeProducts(orders);
        await db.query("UPDATE orders SET orderStatus=? WHERE orderID=?",["OA",orderID]);
        return res.status(200).json({message:"Order accepted"});
    }catch(error){
        return res.status(500).json({error});
    }
}

module.exports = {
    postOrders,
    getOrders,
    acceptOrders,
    getOneOrder
}