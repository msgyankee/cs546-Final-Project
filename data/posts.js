const collections = require('./collections');
const users = require('./users');
const posts = collections.posts;

module.exports = {
    async create(sessionID, type, postTitle, movieTitle, genre, content){
        
        console.log(sessionID);
        console.log(type);
        console.log(postTitle);if (!sessionID || typeof sessionID !== 'string') return Promise.reject('Must provide a valid session');
        if (!type && parseInt(type) !== 0) return Promise.reject("Must provide a valid type");
        if (!postTitle || typeof postTitle !== 'string') return Promise.reject("Must provide a valid post title");
        if (!movieTitle || typeof movieTitle !== 'string') return Promise.reject("Must provide a valid movie title");
        if (!genre || typeof genre !== 'string') return Promise.reject("Must provide a valid genre");
        if (!content || typeof content !== 'string') return Promise.reject("Must provide valid content");
        console.log("here");
        const user = await users.userBySession(sessionID);
        console.log(user);
        if(user == null) return Promise.reject("User not found!");
        else{
            //Type: 0 for Text, 1 for Image, 2 for Video
            const typeInt = parseInt(type);
            const postCollection = await posts();
            let newPost = {
                author: user.username,
                authorID: user._id,
                type: typeInt,
                postTitle: postTitle,
                movieTitle: movieTitle,
                genre: genre,
                content: content
            };

            const insertInfo = await postCollection.insertOne(newPost);
            if (insertInfo.insertedCount === 0) return Promise.reject("Could not add post");
            return insertCount.insertedId;
        }
    },

    async getPost(id){
        if (!id) return Promise.reject('ID is required for get');
        const newid = new ObjectID(id);
        const postCollection = await posts();
        const post = await postCollection.findOne({_id: newid});
        if (post === null) return Promise.reject('Post not found');
        return post;
    },

    async getAllPosts(){
        const postCollection = await posts();
		const post_array = await postCollection.find({}).toArray();
		return post_array;
    },

    async getByGenre(genre) {
        if (!genre || typeof(genre) !== 'string') return Promise.reject("Must enter a valid genre");
        const post_array = getAllPosts();
        const genreArray = [];
        for (var i = 0; i < post_array.length; i++){
            if (post_array[i].genre == genre){
                genreArray.push(post_array[i]);
            }
        }
        if (genreArray == []) return null;
        return genreArray;
        
    },

    async getByType(type){
        if (!type || !type.isInteger()) return Promise.reject("Must enter a valid type.");
        const post_array = getAllPosts();
        const typeArray = [];
        for (var i = 0; i < post_array.length; i++){
            if (post_array[i].type == type){
                typeArray.push(post_array[i]);
            }
        }
        if (typeArray == []) return null;
        return typeArray;
    },

    async getTen(start){
        if (!start && parseInt(start) !== 0) {return Promise.reject("Must enter a valid number to start at.");}
        const index = parseInt(start);
        const postCollection = await posts();
        arr = await postCollection.find().sort({_id:-1}).limit(10 + index).toArray();
        if(arr == []) return null; 
        return arr.splice(0, index);
    },

    async getRandom(){
        const post_array = getAllPosts();
        const num = Math.floor(Math.random() * post_array.length);
        return post_array[num]._id;
    },

    async getPostNum(){
        post_array = getAllPosts();
        return post_array.length;

    },

    async searchPost(keyword){
        if (!keyword || typeof(keyword) !== 'string') return Promise.reject("Must enter a valid keyword");
        post_array = getAllPosts();
        const arr = [];
        for (var i = 0; i < post_array.length; i++){
            if (post_array[i].postTitle.includes(keyword) || post_array[i].content.includes(keyword)){
                arr.push(post_array[i]);
            }
        }
        return arr;
    }
}