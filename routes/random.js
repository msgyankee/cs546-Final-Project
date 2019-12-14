const express = require("express");
const router = express.Router();
const userData = require("../data/users");
const postData = require("../data/posts");


router.get('/', async (req,res) => {
    try{
        const post = await postData.getRandom();
        res.redirect(`/post/${post}`);
    } catch(e){
        res.status(500).json({error: e}); 
    }
});


module.exports = router;    