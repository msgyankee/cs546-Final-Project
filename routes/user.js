const express = require("express");
const router = express.Router();
const userData = require("../data/users");


router.get("/:id", async(req, res) => {
    try{
        if(!req.params.id) res.redirect("/");
        else{ 
            arr = userData.getUserPosts(req.params.id);
            fav = userData.getUserFavorites(req.params.id);
            res.render('pages/profile', {title: 'Profile', posts: arr, favorites: fav});
        }

    } catch(e){
        res.redirect("/");
    }
});

router.post("/favorite/:id", async(req, res) => {
    try{
        if(!req.params.id) res.redirect("/");
        else{
            const postID = parseInt(req.params.id);
            const user = userData.userBySession(req.session.loginStatus);
            if (user == null) res.redirect("/");
            else {
                userID = user._id;
                if (userdata.isFavorite(userID, postID)) {
                    userdata.remFavorite(userID, postID);
                }
                else {
                    userdata.addFavorite(userID, postID);
                }
                res.redirect(`/post/${postID}`);
            }
        }
    }
    catch(e){
        res.status(500).json({error:e});
    }
});


module.exports = router;    