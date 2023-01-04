const {createPool}=require('mysql');
require('dotenv').config();

// ENV VARIABLES
const USERNAME=process.env.USERNAME;
const HOST=process.env.HOST;
const PASSWORD=process.env.PASSWORD;
const DATABASE=process.env.DATABASE;

// CREATE CONNECTION
const connect=createPool({
    host:HOST,
    user:USERNAME,
    password:PASSWORD,
    database:DATABASE
})


// CREATE THE DATABASE
connect.query("CREATE DATABASE IF NOT EXISTS shopzone",(err,res)=>{
    if(err){
        console.log(err);
    }else{
        console.log("Database Created");
    }
});

// CREATE USERS TABLE
connect.query("CREATE TABLE IF NOT EXISTS users(id INT AUTO_INCREMENT,userID VARCHAR(10) NOT NULL,username VARCHAR(50) NOT NULL,email VARCHAR(100) NOT NULL,phoneNumber VARCHAR(15), password VARCHAR(100) NOT NULL,role VARCHAR(20) NOT NULL, createdAt DATETIME NOT NULL,totalOrder INT DEFAULT 0,lastLogin DATETIME, PRIMARY KEY(id),UNIQUE(userID,email))",(err,res)=>{
    if(err){
        console.log(err);
    }else{
        console.log("Users table created");
    }
});

// CREATE VENDORS TABLE
connect.query("CREATE TABLE IF NOT EXISTS vendors(id INT AUTO_INCREMENT,userID VARCHAR(10) NOT NULL,vendorID VARCHAR(10) NOT NULL,storeName VARCHAR(20) NOT NULL,storeLocation VARCHAR(20) NOT NULL, PRIMARY KEY(id),FOREIGN KEY(userID) REFERENCES users(userID) ON DELETE CASCADE,UNIQUE(vendorID))",(err,res)=>{
    if(err){
        console.log(err);
    }else{
        console.log("Vendor table created");
    }
});

// CREATE PRODUCT TABLE
connect.query("CREATE TABLE IF NOT EXISTS products(id INT AUTO_INCREMENT,productID VARCHAR(10) NOT NULL ,vendorID VARCHAR(10) ,description VARCHAR(400) NOT NULL,price INT NOT NULL,quantity INT NOT NULL,category VARCHAR(30) NOT NULL, soldQuantity INT NOT NULL,rating INT NOT NULL,totalSoldQuantity INT NOT NULL,productImage VARCHAR(3000) NOT NULL,PRIMARY KEY (id),UNIQUE(productID),FOREIGN KEY(vendorID) REFERENCES vendors(vendorID) ON DELETE CASCADE)",(err,res)=>{
    if(err){
        console.log(err);
    }else{
        console.log("Products table created");
    }
});

// CREATE ORDERS TABLE
connect.query("CREATE TABLE IF NOT EXISTS orders(id INT AUTO_INCREMENT,orderID VARCHAR(10) NOT NULL,orderedBy VARCHAR(10) NOT NULL,vendor VARCHAR(10) NOT NULL,productID VARCHAR(10) NOT NULL,orderedOn DATETIME NOT NULL,orderStatus VARCHAR(10) NOT NULL,orderCancelled BOOLEAN DEFAULT FALSE,cancelReason VARCHAR(100) NOT NULL DEFAULT 'NOT CANCELLED',FOREIGN KEY(productID) REFERENCES products(productID) ON DELETE CASCADE,FOREIGN KEY(orderedBy) REFERENCES users(userID) ON DELETE CASCADE,FOREIGN KEY(vendor) REFERENCES vendors(vendorID) ON DELETE CASCADE,PRIMARY KEY(id),UNIQUE(orderID))",(err,res)=>{
    if(err){
        console.log(err);
    }else{
        console.log("Orders table created");
    }
})


// CREATE REVIEW TABLE
connect.query("CREATE TABLE IF NOT EXISTS reviews(id INT AUTO_INCREMENT,reviewID VARCHAR(10) NOT NULL ,productID VARCHAR(10) NOT NULL ,description VARCHAR(3000),reviewer VARCHAR(10) NOT NULL ,reviewedOn DATETIME,FOREIGN KEY(productID) REFERENCES products(productID) ON DELETE CASCADE,FOREIGN KEY(reviewer) REFERENCES users(userID) ON DELETE CASCADE,PRIMARY KEY(id),UNIQUE(reviewID))",(err,res)=>{
    if(err){
        console.log(err);
    }else{
        console.log("Reviews table created");
    }
});


// CREATE CANCEL TABLE
connect.query("CREATE TABLE IF NOT EXISTS cancels(id INT AUTO_INCREMENT,cancelID VARCHAR(10),orderID VARCHAR(10),status VARCHAR(10),PRIMARY KEY(id),FOREIGN KEY(orderID) REFERENCES orders(orderID) ON DELETE CASCADE,UNIQUE(cancelID))",(err,res)=>{
    if(err){
        console.log(err);
    }else{
        console.log("Cancel table created");
    }
})


// ADDED THE FOREIGN KEY OF CANCEL ID IN ORDERS TABLE
// connect.query("ALTER TABLE orders ADD cancelID VARCHAR(10)",(err,res)=>{
//     if(err){
//         console.log(err);
//     }else{
//         connect.query("ALTER TABLE orders ADD FOREIGN KEY(cancelID) REFERENCES cancels(cancelID)",(error,resp)=>{
//             if(error){
//                 console.log(error);
//             }else{
//                 console.log("Column added created");
//             }
//         })
//     }
// })

