const { orderdb } = require("../connectDB/db")

const addOrders=async(data,orderID,userID,res)=>{
    let db=await orderdb()
    for (let i in data) {
        const sql = "INSERT INTO orders (orderID,orderedBy,vendor,productID,orderedOn,orderStatus,orderCancelled,quantity) VALUES(?,?,?,?,?,?,?,?)";
        await db.query(sql, [orderID,userID, data[i].vendorID, data[i].productID, new Date(), "OS", false, data[i].quantity])
    }
}

const changeProducts=async(orders)=>{
    let db=await orderdb();
    for(let i in orders){
        let productID=orders[i].productID;
        let quantity=orders[i].quantity;
        let [product,_]=await db.query("SELECT * FROM products WHERE productID=?",[productID]);
        let sold=product[0].soldQuantity;
        let total=product[0].quantity;
        sold=sold+quantity;
        total=total-quantity;
        await db.query("UPDATE products SET quantity=?,soldQuantity=? WHERE productID=?",[total,sold,productID]);
    }
}

module.exports={
    addOrders,
    changeProducts
}