const sql=require('mysql2/promise');
const pool=require('mysql');

const USERNAME=process.env.USERNAME;
const HOST=process.env.HOST;
const PASSWORD=process.env.PASSWORD;
const DATABASE=process.env.DATABASE;

let userConnect;
let productConnect;
let orderConnect;
const userConnection=async()=>{
    if(!userConnect){
        userConnect=await sql.createConnection({
            host:HOST,
            user:USERNAME,
            password:PASSWORD,
            database:DATABASE
        });
    }
    return userConnect;
}

const productConnection=()=>{
    if(!productConnect){
        productConnect=pool.createPool({
            host:HOST,
            user:USERNAME,
            password:PASSWORD,
            database:DATABASE
        });
    }
    return productConnect;
}

const orderConnection=()=>{
    if(!orderConnect){
        orderConnect=sql.createConnection({
            host:HOST,
            user:USERNAME,
            password:PASSWORD,
            database:DATABASE
        });
    }
    return orderConnect;
}

module.exports.userdb=userConnection;
module.exports.productdb=productConnection;
module.exports.orderdb=orderConnection;