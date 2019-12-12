const collections = require('./collections');
const users = require('./users');
const posts = collections.posts;

module.exports = {
    async create(sessionID, type, postTitle, movieTitle, genre, content){
        if (!sessionID || typeof sessionID !== String) return Promise.reject('Must provide a valid ID');
        if (!type || !type.isInteger()) return Promise.reject("Must provide a valid type");
        if (!postTitle || typeof postTitle !== String) return Promise.reject("Must provide a valid post title");
        if (!movieTitle || typeof movieTitle !== String) return Promise.reject("Must provide a valid movie title");
        if (!genre || typeof genre !== String) return Promise.reject("Must provide a valid genre");
        if (!content || typeof content !== String) return Promise.reject("Must provide valid content");

        const postCollection = await posts();
        let newPost = {
            sessionID: sessionID,
            type: type,
            postTitle: postTitle,
            movieTitle: movieTitle,
            genre: genre,
            content: content
        };

        const insertInfo = await postCollection.insertOne(newPost);
        if (insertInfo.insertedCount === 0) return Promise.reject("Could not add post");
        return insertCount.insertedId;
    },

    async getPost(id){
        if (!id) return Promise.reject('ID is required for get');
        const id = new ObjectID(id);
        const postCollection = posts();
        const post = await postCollection.findOne({_id: id});
        if (post === null) return Promise.reject('Post not found');
        return post;
    },

    async getAllPosts(){
        const postCollection = await posts();
		const post_array = await postCollection.find({}).toArray();
		post_array.forEach(function(post) {
			const id = users.userBySession(post.sessionID);
			post.sessionID = id;
		});
		return post_array;
    },

    async getByGenre(genre) {
        if (!genre || typeof(genre) !== String) return Promise.reject("Must enter a valid genre");
        const post_array = getAllPosts();
        const genreArray = [];
        for (var i = 0; i < post_array.length; i++){
            if (post_array[i].genre == genre){
                genreArray.push(post_array[i]);
            }
        }
        if (genreArray == []) return Promise.reject(`No posts with the ${genre} genre can be found`);
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
        if (typeArray == []) return Promise.reject(`No posts with type ${type} can be found`);
        return typeArray;
    },

    async getTen(start){
        if (!start || !start.isInteger()) return Promise.reject("Must enter a valid number to start at.");
        const postCollection = await posts();
        return postCollection.foo.find().sort({start:-1}).limit(10);
        
    }
}