const router = require('express').Router();
const User = require('../models/User')
const bcrypt = require("bcrypt")


//register
router.post('/register',async (req,res)=>{
   const {username,email,isAdmin,password} = req.body
    try {
        //generate new password
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(req.body.password,salt)
        
        //create new user
        const newUser = new User({
            username,email,isAdmin,password:hashedPassword
    
        })

        //save user and return response
        const user = await newUser.save();
        res.status(200).json(user)
        
    } catch (error) {
        console.error("error",error)
        res.status(500).json(error)
    }

})

//LOGIN
router.post('/login',async (req,res)=>{
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        const validPassword = await bcrypt.compare(password,user.password)
        
        if (user && validPassword) {
            res.json(user)
          } else {
            res.status(401).json("invalid email or password")
            throw new Error('Invalid email or password')
          }
    } catch (error) {
        console.error("error",error)
        res.status(500).json(error)

    }
   
})



module.exports = router