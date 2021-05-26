const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

router.get('/',(req,res)=>{
    res.send("hey its user route")
})

//update user
router.put('/:id',async(req,res)=>{
    const {userId,password} = req.body
    if (userId === req.params.id || req.body.isAdmin) {
        if (password) {
            try {
                const salt = await bcrypt.genSalt(10);
                password = await bcrypt.hash(password,salt)
                
            } catch (error) {
                return res.status(500).json(error)
            }
        }
        try {
            const user = await User.findByIdAndUpdate(userId,{$set:req.body,});
            res.status(200).json("ACCOUNT HAS BEEN UPDATED")
        } catch (error) {
            return res.status(500).json(error)
        }
    }
    else
    {
        return res.status(403).json("You can update your account only")
    }
})

//delete user
router.delete('/:id',async(req,res)=>{
    const {userId} = req.body
    if (userId === req.params.id || req.body.isAdmin) {    
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("ACCOUNT HAS BEEN DELETED")
        } 
        catch (error) {
            return res.status(500).json(error)
        }
    }
    else
    {
        return res.status(403).json("You can delete your account only")
    }
})
//get a user
router.get('/:id',async(req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        //remove password and updated at
        const {password,updatedAt, ...other} = user._doc
        if (user) {
            res.json(other)
          } else {
            res.status(404)
            throw new Error('User not found')
          }
    } catch (error) {
        return res.status(500).json(error)
    }
})
//follow a user
router.put('/:id/follow',async(req,res)=>{
    if (req.body.userId !== req.params.id) {
        try {
            //user to follow
            const user = await User.findById(req.params.id)
            //my account
            const currentUser = await User.findById(req.body.userId)

            if (!user.followers.includes(req.body.userId)) {

                await user.updateOne({$push:{followers:req.body.userId}})
                await currentUser.updateOne({$push:{following:req.params.id}})
                res.status(200).json("user has been followed")
            }
            else {
                return res.status(403).json("you already followed this user")
            }
        } catch (error) {
            return res.status(500).json(error)
        }
    }
    else{
        res.status(403).json("you cant follow yourself")
    }
});
//unfollow a user
router.put('/:id/unfollow',async(req,res)=>{
    if (req.body.userId !== req.params.id) {
        try {
            //user to follow
            const user = await User.findById(req.params.id)
            //my account
            const currentUser = await User.findById(req.body.userId)

            if (user.followers.includes(req.body.userId)) {

                await user.updateOne({$pull:{followers:req.body.userId}})
                await currentUser.updateOne({$pull:{following:req.params.id}})
                res.status(200).json("user has been unfollowed")
            }
            else {
                return res.status(403).json("you already unfollowed this user")
            }
        } catch (error) {
            return res.status(500).json(error)
        }
    }
    else{
        res.status(403).json("you cant unfollow yourself")
    }
});


module.exports = router