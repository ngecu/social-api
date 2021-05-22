const router = require('express').Router();
const User = require('../models/User')

//register
router.post('/register',async (req,res)=>{
    const newUser = new User({
        username :req.body.username,
        email :req.body.email,
        password :req.body.password,

    })
    try {
        const user = await newUser.save();
        res.status(200).json(user)
        
    } catch (error) {
        console.error("error",error)
    }

})


module.exports = router