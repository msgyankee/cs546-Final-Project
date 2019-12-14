const dbConnection = require("../data/connection");
const data = require("../data");
const userData = data.users;
const postData = data.posts;

async function main(){
    const db = await dbConnection();
    await db.dropDatabase();

    const MarvelFan1 = await userData.create("MarvelFan1", "marvel");
    const DemonicNeko = await userData.create("DemonicNeko", "anime");
    const MusicalGeek = await userData.create("MusicalGeek", "musicals");

    await postData.create(MarvelFan1, "MarvelFan1", 0, "Endgame Runtime??", "Avengers Endgame", "Superhero", "", "The runtime is going to be 3 hours! I cant believe they would do that! I better not get a large drink...");
    await postData.create(DemonicNeko, "DemonicNeko", 0, "The Best Studio Ghibli Movie", "Kiki’s Delivery Service", "Coming of Age","", "Kiki’s Delivery Service is one of the first Studio Ghibli movies I’ve watched and although I watched it at least 10 times, it never gets old.");
    await postData.create(MusicalGeek, "MusicalGeek",1, "Cats!!!", "Cats(2019 film)", "Musical", "https://i.ytimg.com/vi/FtSd844cI7U/maxresdefault.jpg", "Looking forward to seeing it opening day!");
    await postData.create(DemonicNeko, "DemonicNeko", 1, "This is the First Movie to Make me Cry", "Hotarubi no Mori e", "Slice of Life", "http://cdn.myanimelist.net/images/anime/8/38229l.jpg", "The story was so moving, and it was very easy to get attached to the characters. You definitely need to have a box of tissues nearby when you watch this.");
    await postData.create(MarvelFan1, "MarvelFan1", 2, "Teaser Trailer!", "Black Widow", "Superhero", '<iframe width="560" height="315" src="https://www.youtube.com/embed/RxAtuMu_ph4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>', "This movie is long overdue!");
    await postData.create(MarvelFan1, "MarvelFan1", 1, "Spider-Man Poster", "Spider-Man Far From Home", "Superhero", "https://cdn.collider.com/wp-content/uploads/2019/05/spider-man-far-from-home-poster-fury-mysterio-2.jpg", "This really isnt their best poster. Especially coming off of Endgame"); 
    await postData.create(MusicalGeek, "MusicalGeek", 0, "Charming Holiday Romance?", "A Christmas Prince", "Romance","", "This was quite a bland and cheesy take on a film that could have been romantic and something to rave about.");
    await postData.create(DemonicNeko, "DemonicNeko", 2, "Why Kimi No Na Wa is Such a Great Movie", "Kimi No Na Wa", "Fantasy", `<iframe width="560" height="315" src="https://www.youtube.com/embed/xU47nhruN-Q" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`, "Just look at the art and animation in this! The character designs and overall plot were very well thought out.");
    await postData.create(MusicalGeek, ("MusicalGeek", 2, "First Official Trailer!", "In the Heights", "Musical", `<iframe width="560" height="315" src="https://www.youtube.com/embed/U0CL-ZSuCrQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`, "I am so excited for this to release!");
    await postData.create(MarvelFan1, "MarvelFan1", 0, "Future of the MCU", "Marvel Cinematic Universe", "Superhero", "", "Where do you think they will go next? What stories will they adopt? Let me know! Maybe one day theyll add comments to this website...");
    await postData.create(DemonicNeko, ("DemonicNeko", 1, "An Unexpectedly Disturbing Movie", "Paprika", "Psychological" "https://m.media-amazon.com/images/M/MV5BNDliMTMxOWEtODM3Yi00N2QwLTg4YTAtNTE5YzBlNTA2NjhlXkEyXkFqcGdeQXVyNjE5MjUyOTM@._V1_.jpg", "Don’t be fooled by this movie. It make seem quirky and fun but things escalate fast. It is so scary but this song is nice.");
    await postData.create(MusicalGeek, "MusicalGeek", 2, "Let It Go!", "Frozen", "Disney", `<iframe width="560" height="315" src="https://www.youtube.com/embed/L0MK7qz13bU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`, "Wish I had the voice to sing this. Favorite song from this film!");
    await postData.create(DemonicNeko, "DemonicNeko", 2, "Best Movie Soundtrack", "Sherlock Holmes", "Mystery", `<iframe width="560" height="315" src="https://www.youtube.com/embed/HRTlVh7CrjQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`, "This movie is amazing and the soundtrack is hands down one of the best soundtracks of all time.");

    console.log("Done seeding database");
    await db.serverConfig.close();
}

main();