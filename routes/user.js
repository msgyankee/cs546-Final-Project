const express = require("express");
const router = express.Router();
const userData = require("../data/users");


router.get("/:id", async(req, res) => {
    try{
        await userData.get(req.params.id);
        const data = userData.userBySession(req.session.loginStatus);
        if (data == null) res.redirect("/");
        else {
            arr = data.userData.getUserPosts;
            res.render('pages/profile', {title: 'Profile', posts: arr});
        }

    } catch(e){
        res.status(500).json({error:e});
    }
});

router.post("/favorite/:id", async(req, res) => {
    try{
        await userData.get(req.params.id);
        const postID = await postData.create(req.session.loginStatus, req.body.type, req.body.postTitle, req.body.movieTitle, req.body.genre, req.body.content);
        const user = userData.userBySession(req.session.loginStatus);
        userID = user._id;
        if (user == null) res.redirect("/");
        else {
            if (user.userdata.isFavorite(userID, postID)) {
                user.userdata.remFavorite(userID, postID);
            }
            else {
                user.userdata.addFavorite(userID, postID);
            }
            res.redirect("/post/");
        }
        
    }
})


module.exports = router;    