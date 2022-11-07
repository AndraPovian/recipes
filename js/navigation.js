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


/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
  function filterFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
      txtValue = a[i].textContent || a[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
      } else {
        a[i].style.display = "none";
      }
    }
  }

