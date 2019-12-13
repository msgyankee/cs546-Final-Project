const express = require("express");
const router = express.Router();
const userData = require("../data/users");

router.get("/:id", async(req, res) => {
    try{
        const result = await userData.get(req.params.id);
        res.json(result);
    } catch(e){
        res.status(404).json({error:e});
    }
});

router.post("/:id", async(req, res) => {
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

module.exports = router;    