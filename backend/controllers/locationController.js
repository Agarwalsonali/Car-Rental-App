const db = require('../db/index.js');

const getLocations = (req,res)=>{
    db.query('SELECT * FROM Locations',(err,results)=>{
        if(err) return res.stattus(500).json({
            error: err.message
        })
        res.json(results)
    })
}

const addLocation = (req,res)=>{
    const { location_name, street, city,state } =req.body;
    db.query(
        'INSERT INTO Locations (location_name, street, city,state) VALUES (?,?,?,?)',
        [location_name, street, city,state],
        (err,result)=>{
            if(err) return res.status(500).json({
                error: err.message
            })
            res.json({
                message: "Location added",
                location_id: result.insertId
            })
        }
    )
}

module.exports = {
    getLocations,
    addLocation
}