const bcrypt = require('bcrypt');
const transporter = require('../helpers/email-config');
const { userdb } = require('../helpers/connectDB/db');
const { generateID, generateOtp } = require('../helpers/generators');


// ENTER EMAIL TO RECEIVE OTP
const registerUser = async (req, res) => {
    try {
        let db = await userdb();
        let email = req.body.email;
        const sql = "SELECT COUNT(userID) AS userID from users WHERE email=?";
        const [count, _] = await db.query(sql, [email]);
        if (count[0].userID > 0) {
            return res.status(409).json({ message: "User already exists" });
        } else {
            const [count,_]=await db.query("SELECT COUNT(email) AS email FROM setPassword WHERE email=?",[email]);
            if(count[0].email>0){
                await db.query("DELETE FROM setPassword WHERE email=?",[email]);
            }
            let otp = generateOtp();
            var mailOptions = {
                from: "mail",
                to: email,
                subject: "otp ",
                html: "<h3>OTP FOR account </h3>" + otp + "<br>" + "<h4>Expires in 15 minutes</h4>"
            }
            transporter.sendMail(mailOptions, async (err, info) => {
                if (err) {
                    return res.status(500).json({ message: err });
                } else {
                    const date = new Date();
                    let endDate = new Date(new Date().getTime() + 15 * 60000);
                    const insertOtp = "INSERT INTO setpassword(otp,email,createdAt,validTill) VALUES(?,?,?,?)"
                    await db.query(insertOtp, [otp, email, date, endDate])
                    return res.status(200).json({ detail: 'email sent to ' + email, info })
                }
            })
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
}

// ENTER OTP TO VALIDATE EMAIL
const checkOtp = async (req, res) => {
    try{
        let db = await userdb();
        const sql = "SELECT * FROM setPassword WHERE email=? AND otp=?";
        let data = req.body;
        const [result,_]=await db.query(sql, [data.email, data.otp])
        if (result.length == 0) {
            return res.status(409).json({ message: 'Invalid OTP' });
        } else {
            let date = new Date();
            let valid = result[0].validTill - date;
            let minutes = Math.floor((valid / 1000) / 60);
            if (minutes < 0) {
                return res.status(410).json({ message: "Otp expired" });
            }
            const sql="UPDATE setPassword SET emailValidated=? WHERE id=?";
            await db.query(sql,[true,result[0].id]);
            return res.status(200).json({ message: 'Email validated' });
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({error});
    }
}

// ADD USERS WHOSE EMAIL IS VALIDATED
const addUsers = async (req, res) => {
    let db = await userdb();
    let data = req.body;
    bcrypt.hash(data.password, 5, async (err, hash) => {
        if (err) {
            return res.status(500).json({ message: "password required" });
        } else {
            const sql1 = "SELECT * FROM setPassword WHERE email=?";
            db.query(sql1, [data.email], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ message: err })
                } else if (result.length == 0) {
                    return res.status(404).json({ message: "user did not register email" });
                } else if (result[0].emailValidated == 0) {
                    return res.status(401).json({ message: "email not validated" });
                } else {
                    const getUserID = "SELECT * FROM users ORDER BY id DESC LIMIT 1";
                    db.query(getUserID, (e, r, f) => {
                        if (e) {
                            return res.status(500).json({ message: e });
                        } else {
                            let userID = generateID(r[0].userID, "USER");
                            const date = new Date();
                            const sql = "INSERT INTO users(userID,username,email,phoneNumber,password,role,createdAt,lastLogin) VALUES(?,?,?,?,?,?,?,?)";
                            db.query(sql, [userID, data.username, data.email, data.phoneNumber, hash, data.role, date, date], (error, result, field) => {
                                if (error) {
                                    return res.status(409).json({ message: error.sqlMessage });
                                }
                                return res.status(201).json({ message: "User added successfully" });
                            });
                        }
                    })
                }
            })
        }
    })
}

module.exports = {
    registerUser,
    checkOtp,
    addUsers
}