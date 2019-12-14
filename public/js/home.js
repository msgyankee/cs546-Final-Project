(function() {

    const last = document.getElementById("last");
    const next = document.getElementById("next");

    last.onclick = function(){
        let pageNum = window.location.pathname;
        pageNum = pageNum.substring(1);
        pageNum = parseInt(pageNum);
        if(pageNum === NaN) pageNum = 0;
        pageNum--;
        window.location.href = "/"+pageNum;
    };

    next.onclick = function(){
        let pageNum = window.location.pathname;
        pageNum = pageNum.substring(1);
        pageNum = parseInt(pageNum);
        if(pageNum == NaN) pageNum = 0;
        pageNum++;
        window.location.href = "/"+pageNum;
    };
})();