const bcrypt = require('bcrypt');
const transporter=require('../helpers/email-config');
const {otpExist,deleteOtp,validateUser}=require('../helpers/dbOps/userQueries');
const { userdb } = require('../helpers/connectDB/userDB');
const { generateUserID,generateOtp } = require('../helpers/generators');


const addUsers = async (req, res) => {
    let db = await userdb();
    let data = req.body;
    bcrypt.hash(data.password, 5, (err, hash) => {
        if (err) {
            return res.status(500).json({ message: "password required" });
        } else {
            const getUserID = "SELECT * FROM users ORDER BY id DESC LIMIT 1";
            db.query(getUserID, (e, r, f) => {
                if (e) {
                    return res.status(500).json({ message: e });
                } else {
                    let userID = generateUserID(r[0].userID, "USER");
                    const date = new Date();
                    const sql = "INSERT INTO users(userID,username,email,phoneNumber,password,role,createdAt,lastLogin) VALUES(?,?,?,?,?,?,?,?)";
                    db.query(sql, [userID, data.username, data.email, data.phoneNumber, hash, data.role, date, date], (error, result, field) => {
                        if (error) {
                            return res.status(500).json({ message: error });
                        }
                        return res.status(201).json({ message: "User added successfully" });
                    });
                }
            })
        }
    })
}

const registerUser=async(req,res)=>{
    let db=await userdb();
    let email=req.body.email;
    const sql="SELECT COUNT(userID) AS userID from users WHERE email=?";
    db.query(sql,[email],async(err,resp)=>{
        if(err){
            return res.status(500).json({message:err});
        }else{
            if(resp[0].userID>0){
                return res.status(409).json({message:"User already exists"});
            }else{
                if(otpExist(email)){
                    await deleteOtp(email);
                }
                let otp=generateOtp();
                var mailOptions={
                    from:"mail",
                    to:email,
                    subject:"otp ",
                    html:"<h3>OTP FOR account </h3>"+otp
                }
                transporter.sendMail(mailOptions,(err,info)=>{
                    if(err){
                        return res.status(500).json({message:err});
                    }else{
                        const date=new Date();
                        let endDate=new Date(new Date().getTime()+15*60000);
                        const insertOtp="INSERT INTO setpassword(otp,email,createdAt,validTill) VALUES(?,?,?,?)"
                        db.query(insertOtp,[otp,email,date,endDate],(error,result,field)=>{
                            if(error){
                                return res.status(500).json({message:error});
                            }else{
                                return res.status(200).json({detail:'emai sent to '+email,info})
                            }
                        })
                    }
                })
            }
        }
    })
}

const checkOtp=async(req,res)=>{
    let db=await userdb();
    const sql="SELECT * FROM setPassword WHERE email=? AND otp=?";
    let data=req.body;
    db.query(sql,[data.email,data.otp],async(err,resp)=>{
        if(err){
            return res.status(500).json({message:err});
        }else if(resp.length==0){
            return res.status(409).json({message:'Invalid OTP'});
        }else{
            let date=new Date();
            let valid=resp[0].validTill-date;
            let minutes = Math.floor((valid/1000)/60);
            if(minutes<0){
                return res.status(410).json({message:"Otp expired"});
            }
            validateUser(resp[0].id);
            return res.status(200).json({message:'Valid email'});
        }
    })
}

module.exports = {
    addUsers,
    registerUser,
    checkOtp
}