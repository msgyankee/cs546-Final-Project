const contructorMethod = app => {
    //Set routes for homepage or send to own file?
    //app.use for /pages

    //All undefined pages get sent 404. Make error page?
    app.get("*", (req,res) => {
        res.sendStatus(404); 
    });
}