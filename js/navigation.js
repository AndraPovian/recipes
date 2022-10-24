function showPage(page){
    var pages = document.getElementsByClassName("pages");
    
    for(i=0; i<pages.length; i++) {
        if(pages[i].id !== page) {
            pages[i].style.display = "none";
        }
    }
}