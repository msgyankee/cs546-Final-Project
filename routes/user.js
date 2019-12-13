const express = require("express");
const router = express.Router();
const userData = require("../data/users");


router.get("/:id", async(req, res) => {
    try{
        if(!req.params.id) res.redirect("/");
        else{ 
            let arr = await userData.getUserPosts(req.params.id);
            let fav = await userData.getUserFavorites(req.params.id);
            
            let login = true;
            let userID = "";
            if(!req.session.loginStatus) login = false;
            else try{
                const user = await userData.userBySession(req.session.loginStatus);
                if(user !== null){
                    userID = user._id;
                }
            } catch(e){
                login = false
                userID = false;
            }

            if(arr.length == 0 && fav.length == 0) res.render('pages/profile', {title: 'Profile', login: login, userID: userID, noPost: true, noFav: true});
            else if(arr.length == 0) res.render('pages/profile', {title: 'Profile', login: login, userID: userID, favorites: fav, noPost: true});
            else if(fav.length == 0) res.render('pages/profile', {title: 'Profile', login: login, userID: userID, posts: arr, noFav: true});
            else { res.render('pages/profile', {title: 'Profile', posts: arr, login: login, userID: userID, favorites: fav}); }
        }

    } catch(e){
        res.redirect("/");
    }
});

router.post("/favorite/:id", async(req, res) => {
    try{
        if(!req.params.id) res.redirect("/");
        else{
            const postID = req.params.id;
            const user = await userData.userBySession(req.session.loginStatus);
            console.log("postID: "+postID);
            console.log("User: "+user);
            if (user == null) res.redirect("/");
            else {
                userID = user._id;
                console.log("UserID: "+userID);
                if (await userData.isFavorite(userID, postID)) {
                    await userData.remFavorite(userID, postID);
                }
                else {
                    await userData.addFavorite(userID, postID);
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