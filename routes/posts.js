const router = require("express").Router();
const Post = require('../models/Post');
const User = require("../models/User");

//get timeline posts
router.get("/timeline/all", async (req, res) => {
    const {userId} = req.body
    try {
      const currentUser = await User.findById(userId);
      const userPosts = await Post.find({ userId: currentUser._id });
      const friendPosts = await Promise.all(
        currentUser.followings.map((friendId) => {
          return Post.find({ userId: friendId });
        })
      );
      res.json(userPosts.concat(...friendPosts))
    } catch (error) {
      res.status(500).json(error);
      console.log(error)
    }
  }); 

//create a post
router.post("/",async (req,res)=>{
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)

    } catch (error) {
        return res.status(500).json(error)
    }
})

 

//update a post
router.put('/:id',async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        const {userId} = req.body
    
        if (post.userId === userId ) {
            await post.updateOne({$set:req.body})
            res.status(200).json("Post has been updated")

        }
        else{
            return res.status(403).json("You can update your account only")
        }
    } catch (error) {
        res.status(500).json(error)
    }
  

   
})
 
//delete a post
router.delete('/:id',async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        


    
        if (post.userId === userId ) {
            await post.deleteOne()
            res.status(200).json("Post has been delete")

        }
        else{
            return res.status(403).json("You can delete your account only")
        }
    } catch (error) {
        res.status(500).json(error)
    }
})
//like a post
router.put('/:id/like',async(req,res)=>{
    try {
        const {userId} = req.body
        const post = await Post.findById(req.params.id);

        if (!post.likes.includes(userId)) {
            await post.updateOne({$push:{likes:userId}})
            res.status(200).json("Post has been liked by")
        }
        else
        {
            await post.updateOne({$pull:{likes:userId}})
            res.status(200).json("Post has been disliked by")

        }
    } catch (error) {
        res.status(500).json(error)
    }

})

//get a post

router.get('/:id',async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(`Post found : ${post}`)

    } catch (error) {
        return res.status(500).json(error)
    }
})


module.exports = router