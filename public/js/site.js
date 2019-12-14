(function() {

    const button = document.getElementById("button");
    button.disabled = true;
    const dropdown = document.getElementById("type_form");
    const expand = document.getElementById("expand");

    const content_label = document.createElement("label");
    content_label.for = "content";
    content_label.innerHTML = "Content: ";
    content_label.id = "content_label";
    const content = document.createElement("input");
    content.type = "text";
    content.name = "content";
    content.id = "content";
    content.required = true;

    const src_label = document.createElement("label");
    src_label.for = "src";
    src_label.innerHTML = "Media Source";
    src_label.id = "src_label";
    const src = document.createElement("input");
    src.type = "text";
    src.name = "src";
    src.id = "src";
    src.required = true;

    const desc_label = document.createElement("label");
    desc_label.for = "desc";
    desc_label.innerHTML = "Media Description";
    desc_label.id = "desc_label";
    const desc = document.createElement("input");
    desc.type = "text";
    desc.name = "desc";
    desc.id = "desc";
    desc.required = true;

    dropdown.addEventListener("input", function (){
        if(dropdown.value === "select"){
            while(expand.hasChildNodes()){ expand.removeChild(expand.lastChild); }
            
            button.disabled = true;
        }
        else if(dropdown.value === "0"){
            while(expand.hasChildNodes()){ expand.removeChild(expand.lastChild); }

            expand.appendChild(content_label);
            expand.appendChild(content);
            button.disabled = false;
        }
        else{
            while(expand.hasChildNodes()){ expand.removeChild(expand.lastChild); }

            expand.appendChild(src_label);
            expand.appendChild(src);
            expand.appendChild(desc_label);
            expand.appendChild(desc);
            button.disabled = false;
        }
    });

})();