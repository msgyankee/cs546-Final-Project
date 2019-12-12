const loginRoutes = require("./login");
const createRoutes = require("./create");

const data = require("../data");
const postData = data.posts;

const contructorMethod = app => {
    //Set routes for homepage or send to own file?
    //app.use for /pages

    app.use("/login", loginRoutes);    
    app.use("/create", createRoutes);
    
    app.get("/", async (req, res) => {
        arr = await postData.getTen(0);
        res.render('pages/home', {title: Home, posts: arr});
    });

    app.get('/:id', async (req, res) => {
        if(!req.params.id) res.redirect('/');
        const pageNum = parseInt(req.params.id);
        const postCount = await postData.getPostNum();
        if(pageNum < 0) res.redirect('/');
        if(pageNum >= Math.floor(postCount/10)) res.redirect(`/${Math.floor(postCount/10)}`);
        arr = await postData.getTen(pageNum*10)
        res.render('pages/home', {title: 'Home', posts: arr})
    });

    //All undefined pages get sent 404. Make error page?
    app.get("*", (req,res) => {
        res.sendStatus(404); 
    });
}

module.exports = constructorMethod;