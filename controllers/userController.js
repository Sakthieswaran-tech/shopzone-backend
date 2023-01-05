const bcrypt = require('bcrypt');
const { userdb } = require('../helpers/connectDB/userDB');
const { generateUserID,generateOtp } = require('../helpers/generators');
const transporter=require('../helpers/email-config');
const { REPL_MODE_STRICT } = require('repl');

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
    db.query(sql,[email],(err,resp)=>{
        if(err){
            return res.status(500).json({message:err});
        }else{
            if(resp[0].userID>0){
                return res.status(409).json({message:"User already exists"});
            }else{
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

module.exports = {
    addUsers,
    registerUser
}