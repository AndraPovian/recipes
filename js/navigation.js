function showMenu() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

function showPage(page){
    var pages = document.getElementsByClassName("pages");
    
    for(i=0; i<pages.length; i++) {
        if(pages[i].id !== page) {
            pages[i].style.display = "none";
            if (document.getElementById(pages[i].id + 'Menu').classList) {
                document.getElementById(pages[i].id + 'Menu').classList.remove('isActive');
            } 
        } else {
            pages[i].style.display = "block";
            if(!pages[i].className.includes('isActive')) {
                document.getElementById(page + 'Menu').className += ' isActive';
            }
        }
    }
}

showPage("home");


function messageSubmit(){
  alert("Message submitted");
}



