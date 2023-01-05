const sql=require('mysql2')
const pool=require('mysql');

const USERNAME=process.env.USERNAME;
const HOST=process.env.HOST;
const PASSWORD=process.env.PASSWORD;
const DATABASE=process.env.DATABASE;

let userConnect;
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

module.exports.userdb=userConnection;