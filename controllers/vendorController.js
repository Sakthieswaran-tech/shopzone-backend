const { userdb } = require('../helpers/connectDB/db');
const { generateID} = require('../helpers/generators');

const addVendor=async(req,res)=>{
    let db=await userdb();
    let data=req.body;
    const sql="SELECT * FROM vendors ORDER BY id DESC LIMIT 1";
    db.query(sql,(err,result)=>{
        if(err){
            console.log(err);
            return res.status(500).json({message:err});
        }else{
            const vendorID=result.length==0?"VEND000001":generateID(result[0].vendorID,"VEND");
            const sql="SELECT * FROM users WHERE email=?";
            db.query(sql,[data.email],(err,result)=>{
                if(err){
                    console.log(err);
                    return res.status(500).json({message:err});
                }else{
                    const userID=result[0].userID;
                    const sql="INSERT INTO VENDORS (userID,vendorID,storeName,storeLocation) VALUES (?,?,?,?)";
                    db.query(sql,[userID,vendorID,data.storeName,data.storeLocation],(err,result)=>{
                        if(err){
                            console.log(err);
                            return res.status(500).json({message:err});
                        }else{
                            const sql="UPDATE users SET role=? WHERE userID=?";
                            db.query(sql,["vendor",userID],(err,result)=>{
                                if(err){
                                    console.log(err);
                                    return res.status(500).json({message:err});
                                }else{
                                    return res.status(201).json({message:"Vendor added successfully"});
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}

module.exports={
    addVendor
}