const express = require('express');
const router = express.Router();
const data = require("../data");
const userData = data.users;
const postData = data.posts;

router.get('/', async (req,res) => {
    try{
        const user = await userData.userBySession(req.session.loginStatus);
        if(user == null) res.redirect('/login'); //User has cookie data, but session not found in database

        res.render('pages/create', {title: "Create Post"});
    } catch(e){
        res.status(500).json({error: e});
    }
});

router.post('/', async (req,res) => {
    if(!req.body.postTitle || !req.body.movieTitle || !req.body.type || !req.body.genre || !req.body.content) res.render('/create', {title: 'Create Post', reqFields: true});
    try{
        console.log("passes args check");
        const postID = await postData.create(req.session.loginStatus, req.body.type, req.body.postTitle, req.body.movieTitle, req.body.genre, req.body.content);
        console.log("Created post: "+postID);
        const user = await userData.userBySession(req.session.loginStatus);
        const userID = user._id;
        await userData.addPost(userID, postID);
        res.redirect(`/posts/${postID}`);
    } catch(e) {
        res.status(500).json({error: e});
    }
});

module.exports = router;