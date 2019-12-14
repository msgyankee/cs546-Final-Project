(function() {
    
    const search = document.getElementById("search")
    search.addEventListener("keyup", function(event){
        if(event.keyCode == 13){
            event.preventDefault();   
            let string = "localhost:3000/search/" + search.value;
            console.log(string);
            window.location = "localhost:3000/search/" + search.value;
        }
  
    });
})();
    