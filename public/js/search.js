(function() {
    
    const search = document.getElementById("search")
    search.addEventListener("keyup", function(event){
        if(event.keyCode == 13){
            event.preventDefault();   
            let string = "localhost:3000/search/" + search.value;
            window.location.href = "/search/" + search.value;
            return false;
        }
  
    });
})();
    