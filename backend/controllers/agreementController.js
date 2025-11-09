const db = require('../db/index.js');

const getAgreements = (req,res) =>{
    db.query('SELECT * FROM Agreements',(err,results)=>{
        if(err) return res.status(500).json({
            error: err.message
        })
        res.json(results)
    })
}

const addAgreement = (req,res) => {
    const { terms, apply_date, terminate_date } =req.body;
    db.query(
        'INSERT INTO Agreements (terms, apply_date, terminate_date) VALUES (?, ?, ?)',
        [terms, apply_date, terminate_date],
        (err,result)=>{
            if(err) return res.status(500).json({
                error: err.message
            })
            res.json({
                message: "Agreement added successfully",
                agreement_id: result.insertId
            })
        }
    )
}

module.exports = {
    getAgreements,
    addAgreement
}