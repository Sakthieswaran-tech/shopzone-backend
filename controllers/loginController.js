const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const { userdb } = require('../helpers/connectDB/db');

const SECRET_KEY = process.env.SECRET_KEY;

const fetchToken = async (req, res) => {
    let db = await userdb();
    let data = req.body;
    const sql = "SELECT * FROM users WHERE email=?";
    const [user, _] = await db.query(sql, [data.email]);
    if (user.length == 0) {
        return res.status(404).json({ detail: "No user found" });
    }
    bcrypt.compare(data.password, user[0].password, async (err, resp) => {
        if (err) {
            return res.status(500).json({ message: err });
        } else if (!resp) {
            return res.status(401).json({ message: "Incorrect password" });
        } else {
            let detail = {
                userID: user[0].userID,
                email: user[0].email,
                role: user[0].role,
                username: user[0].username
            }
            if (user[0].role == 'vendor') {
                let [vendorID, _] = await db.query("SELECT vendorID from vendors WHERE userID=?", [user[0].userID]);
                detail.vendorID = vendorID[0].vendorID;
            }
            const token = jwt.sign({ detail }, SECRET_KEY);
            return res.status(200).json({ token });
        }
    })
}

module.exports = {
    fetchToken
}