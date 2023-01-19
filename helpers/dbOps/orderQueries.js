const { orderdb } = require("../connectDB/db")

const addOrders=async(data,orderID,userID,res)=>{
    let db=await orderdb()
    for (let i in data) {
        const sql = "INSERT INTO orders (orderID,orderedBy,vendor,productID,orderedOn,orderStatus,orderCancelled,quantity) VALUES(?,?,?,?,?,?,?,?)";
        await db.query(sql, [orderID,userID, data[i].vendorID, data[i].productID, new Date(), "OS", false, data[i].quantity])
    }
}

module.exports={
    addOrders
}