const express = require("express");
const router = express.Router();
const userData = require("../data/users");
const postData = require("../data/posts");

router.get('/:id', async (req, res) => {
    if(!req.params.id) res.redirect('/');
    else try{
        const postID = req.params.id;
        
        let login = true;
        let status = false;
        let userID = "";
        if(!req.session.loginStatus) login = false;
        else try{
            const user = await userData.userBySession(req.session.loginStatus);
            if(user !== null){
                status = await userData.isFavorite(user._id, postID);
                userID = user._id;
            }
        } catch(e){
            login = false;
            status = false;
        }
        console.log(login);
        const post = await postData.getPost(postID);
        res.render('pages/post', {title: post.postTitle, post: post, login: login, userID: userID, favorite: status});
    } catch(e){
        res.status(500).json({error: e});   
    }
});


module.exports = router;    