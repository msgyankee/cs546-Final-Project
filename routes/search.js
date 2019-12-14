const express = require("express");
const router = express.Router();
const userData = require("../data/users");
const postData = require("../data/posts");

router.get("/:query", async (req,res) => {
    if(!req.params.query) res.redirect('/');
    else try{
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

        const arr = await postData.searchPost(req.params.query);
        if(arr.length == 0) res.render("pages/search", {title: "Search Results", login: login, userID: userID, noneFound: true});
        else{ res.render("pages/search", {title: "Search Results", login:login, userID: userID, posts: arr}); }
    } catch(e){
        res.status(500).json({error: e});
    }
});


module.exports = router;    