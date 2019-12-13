const express = require("express");
const router = express.Router();
const userData = require("../data/users");


router.get("/:id", async(req, res) => {
    try{
        if(!req.params.id) res.redirect("/");
        else{ 
            let arr = await userData.getUserPosts(req.params.id);
            let fav = await userData.getUserFavorites(req.params.id);
            
            if(arr.length == 0 && fav.length == 0) res.render('pages/profile', {title: 'Profile', noPost: true, noFav: true});
            else if(arr.length == 0) res.render('pages/profile', {title: 'Profile', favorites: fav, noPost: true});
            else if(fav.length == 0) res.render('pages/profile', {title: 'Profile', posts: arr, noFav: true});
            else { res.render('pages/profile', {title: 'Profile', posts: arr, favorites: fav}); }
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