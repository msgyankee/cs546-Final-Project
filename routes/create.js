const express = require('express');
const router = express.Router();
const data = require("../data");
const userData = data.users;
const postData = data.posts;

router.get('/', async (req,res) => {
    const user = await userData.userBySession(req.session.loginStatus);
    if(user = null) res.redirect('/login'); //User has cookie data, but session not found in database

    res.render('pages/create', {title: "Create Post"});
});

router.post('/', async (req,res) => {
    if(!req.body.postTitle || !req.body.movieTitle || !req.body.type || !req.body.genre || !req.body.content) res.render('/create', {title: 'Create Post', reqFields: true});
    try{
        const postID = postData.create(req.session.loginStatus, req.body.type, req.body.postTitle, req.body.movieTitle, req.body.genre, req.body.content);
        res.redirect(`/posts/${postID}`);
    } catch(e) {
        req.render('/create', {title: "Create Post", errorMessage: e});
    }
});

module.exports = router;