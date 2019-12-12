const loginRoutes = require("./login");

const data = require("../data");
const postData = data.posts;

const contructorMethod = app => {
    //Set routes for homepage or send to own file?
    //app.use for /pages

    app.use("/login", loginRoutes);    
    
    app.get("/", async (req, res) => {
        arr = postData.getTen(0);
        res.render('pages/home', {title: Home, posts: arr});
    });

    app.get('/:id', async (req, res) => {
        if(!req.params.id) res.redirect('/');
        const pageNum = parseInt(req.params.id);
        const postCount = postData.getPostNum();
        if(pageNum >= Math.floor(postCount/10)) res.redirect(`/${Math.floor(postCount/10)}`);
        arr = postData.getTen(pageNum*10)
        res.render('pages/home', {title: 'Home', posts: arr})
    });

    //All undefined pages get sent 404. Make error page?
    app.get("*", (req,res) => {
        res.sendStatus(404); 
    });
}

module.exports = constructorMethod;