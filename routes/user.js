const express = require("express");
const router = express.Router();
const userData = require("../data/users");


router.get("/:id", async(req, res) => {
    try{
        if(!req.params.id) res.redirect("/");
        else{ 
            arr = await userData.getUserPosts(req.params.id);
            fav = await userData.getUserFavorites(req.params.id);
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
            const user = await userData.userBySession(req.session.loginStatus);
            if (user == null) res.redirect("/");
            else {
                userID = user._id;
                if (await userdata.isFavorite(userID, postID)) {
                    await userdata.remFavorite(userID, postID);
                }
                else {
                    await userdata.addFavorite(userID, postID);
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