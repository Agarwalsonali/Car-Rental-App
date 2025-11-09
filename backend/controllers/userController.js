const db = require('../db/index.js');

const getUsers = (req,res) =>{
    db.query("SELECT * FROM users", (err,results)=>{
        if(err){
            return res.status(500).json({
                error: err.message
            })
        }
        res.json(results);
    })
}

const addUser = (req,res)=>{
    const { fname, lname, email, street, city, state } = req.body;
    db.query(
        "INSERT INTO users (fname,lname,email,street,city,state) VALUES (?,?,?,?,?,?)",
        [fname,lname,email,street,city,state],
        (err,result)=>{
            if(err){
                return res.json(500).json({
                    error:err.message
                })
            }
            res.json({
                    message: "User added successfully",
                    user_id:result.insertId
            })
        }
    )
}

module.exports = {
    getUsers,
    addUser
}