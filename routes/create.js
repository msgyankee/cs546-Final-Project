const express = require('express');
const router = express.Router();
const data = require("../data");
const userData = data.users;
const postData = data.posts;

router.get('/', async (req,res) => {
    try{
        const user = await userData.userBySession(req.session.loginStatus);
        if(user == null) res.redirect('/login'); //User has cookie data, but session not found in database

        res.render('pages/create', {title: "Create Post", login: true, userID: user._id});
    } catch(e){
        res.status(500).json({error: e});
    }
});

router.post('/', async (req,res) => {
    if(!req.body.postTitle || !req.body.movieTitle || !req.body.type || !req.body.genre) res.render('/create', {title: 'Create Post', reqFields: true});
    try{
        
        //src only filled if a media post
        let src = "";
        if(req.body.src) src = req.body.src;
        //Always some sort of content, whether it is standalone text (r.b.content) or a media description (r.b.desc)
        let content = "";
        if(req.body.content) content = req.body.content;
        else { content = req.body.desc; }

        const user = await userData.userBySession(req.session.loginStatus);
        const postID = await postData.create(user._id, user.username, req.body.type, req.body.postTitle, req.body.movieTitle, req.body.genre, src, content);
       
        const userID = user._id;
        await userData.addPost(userID, postID);
        res.redirect(`/post/${postID}`);
    } catch(e) {
        res.status(500).json({error: e});
    }
});

module.exports = router;