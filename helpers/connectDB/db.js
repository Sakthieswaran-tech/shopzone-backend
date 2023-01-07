const sql=require('mysql2')
const pool=require('mysql');

const USERNAME=process.env.USERNAME;
const HOST=process.env.HOST;
const PASSWORD=process.env.PASSWORD;
const DATABASE=process.env.DATABASE;

let userConnect;
let productConnect;
const userConnection=()=>{
    if(!userConnect){
        userConnect=pool.createPool({
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
        userConnect=pool.createPool({
            host:HOST,
            user:USERNAME,
            password:PASSWORD,
            database:DATABASE
        });
    }
    return productConnect;
}

module.exports.userdb=userConnection;
module.exports.productdb=productConnection;