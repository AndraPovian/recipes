// Functions tied to Recipes Table functionality
// Created by Andreea

var serverAdress = 'http://localhost:8080';

var pageNumber = 1;
var itemsOnPage = 6;
var allRecipes = [];
var step = 1;
var filterField = null;

function loadRecipes() {
  fetch(serverAdress + `/recipes?page=${pageNumber}&items=${itemsOnPage}&filter=${filterField}`)
  .then((result) => result.json())
  .then((result) => {
    allRecipes = result.recipes;
    displayRecipes(result.recipes, result.totalPages);
  });
}

function displayRecipes(recipes, totalPages) {
  document.getElementById('recipes').innerHTML = '';

  var recipesPage = '<h1>Recipes</h1>' + '<button class="buttonAdd" onclick="addRecipe()">Add Recipe</button>';

  recipesPage += `<form style="display: inline-block;">
  <select name="filter" id="filter" onchange="filterBy()">
    <option value="">Filter by</option>`;

    recipesPage += '<optgroup label="categorie">';

    var categorii = [...new Set(recipes.map(item => item.categorie))].sort();


    for (i=0; i<categorii.length; i++){
      recipesPage += `<option value="${categorii[i]}">${categorii[i]}</option>`;
    }

    recipesPage += '</optgroup>';

    recipesPage += '<optgroup label="nivel de dificultate">';

    var nivele = [...new Set(recipes.map(item => item.nivel))].sort();

    for (i=0; i<nivele.length; i++){
      recipesPage += `<option value="${nivele[i]}">${nivele[i]}</option>`;
    }

  recipesPage += '</optgroup>';

  recipesPage += `</select> </form>`;

  recipesPage += '<div class="row">';

  for(i = 0; i < recipes.length; i++) {
    recipesPage += `<div class="column" onclick="showRecipe(event, '${recipes[i].nume}')"><div class="card">`;

    recipesPage += `<img src="${recipes[i].img}" alt="img" style="width:40%">`;

    recipesPage += '<div class="container">';

    recipesPage += `<h3>${recipes[i].nume}</h3>`;

    recipesPage += `<p>Categorie: <span style="color: #51B8FF; font-weight: bold;">${recipes[i].categorie}</span></p>`;

    recipesPage += `<p>Timp: <span style="color: #2EC532; font-weight: bold;">${recipes[i].timp} min</span></p>`;

    recipesPage += `<p>Nivel: <span style="color: #E5A00D; font-weight: bold;">${recipes[i].nivel}</span></p>`;

    recipesPage += '</div>';

    recipesPage += `<button style="margin-bottom:10px">Update</button>`;

    recipesPage += `<button style="margin-bottom:10px">Delete</button>`;

    recipesPage += '</div></div>';
  }

  

  recipesPage += '</div>';

  recipesPage += document.getElementById('recipes').innerHTML;

  document.getElementById('recipes').innerHTML += recipesPage;

  var pagination = '<div id="pagination" class="pagination">';

  for (i = 1; i <= totalPages; i++) {
    pagination += '<a href="#"';
    
    if (pageNumber === i) {
      pagination += 'class="active"';
    }
    
     pagination += 'onclick="page(' + (i) + ')" >' + (i) + '</a>';
  }

  pagination += '</div>';

  document.getElementById('recipes').innerHTML += pagination;
}


function filterBy(){
  pageNumber = 0;
  filterField = document.getElementById("filter").value;
  loadRecipes();
}

function addRecipe() {

  var modal = `
  <div id="myModal" class="modal">

    <!-- Modal content -->
    <div class="modal-content">
      <div class="modal-header">
        <span class="close">&times;</span>
        <h2>Add Recipe</h2>
      </div>
      <div class="modal-body">
        <span>Name:</span>
        <input type="text" placeholder="Name" id="name" />

        <span>ImageURL</span>
        <input type="text" placeholder="ImageURL" id="imageURL">

        <span>Category</span>
        <select name="categorie" id="categorie">
          <option value="felPrincipal">Main course</option>
          <option value="aperitiv">Appetizers</option>
          <option value="ciorbe">Soups</option>
          <option value="desert">Desert</option>
        </select>

        <span>Time</span><br>
        <input type="number" min="1" placeholder="Time" id="time" /><br><br>

        <span>Level</span>
        <select name="nivel" id="nivel">
          <option value="incepator">Begginer</option>
          <option value="intermediar">Intermediar</option>
          <option value="avansat">Advanced</option>
        </select>

        <span>Method of preparation</span>
        <div id="stepPlaceholder">
          <textarea class="step" placeholder="First step"></textarea>
        </div>

        <button id="addStep" onclick="addStep()">Next step</button>
      
      
      <div class="modal-footer">
        <button class="save" onclick="save()">Save</button>
      </div>

      
    </div>

  </div>
  `;

  document.getElementById('recipes').innerHTML += modal;

  var myModal = document.getElementById('myModal');

  var span = document.getElementsByClassName("close")[0];

  span.onclick = function() {
    myModal.outerHTML = '';
    step = 1;
  }

}

function createRecipe(id, name, img, categorie, time, nivel, stepsValue) {
  return fetch("http://localhost:8080/recipes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      name,
      img,
      categorie,
      time,
      nivel,
      stepsValue,
    }),
  }).then((r) => r.json());
}

function deleteRecipe(id) {
  return fetch(serverAdress + `/recipes?id=${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((r) => r.json());
}



function addStep(){    
  var steps = document.getElementsByClassName("step"); 
  var stepsValue = [];
  for (i = 0; i < steps.length; i++){
    stepsValue.push(steps[i].value);
  }
  
  step++;
  var stepToAdd = `<textarea class="step" placeholder="Step ${step}"></textarea>`;

  document.getElementById("stepPlaceholder").innerHTML += stepToAdd;

  for (i = 0; i < stepsValue.length; i++) {
    document.getElementsByClassName("step")[i].value = stepsValue[i];
  }

}

function save(isUpdate){
  var id = document.getElementById("recipeId").innerHTML;
  var name = document.getElementById("name").value;
  var img = document.getElementById("imageURL").value;
  var categorie = document.getElementById("categorie").value;
  var time = document.getElementById("time").value;
  var nivel = document.getElementById("nivel").value;
  var steps = document.getElementsByClassName("step");
  var stepsValue = [];
  for (i = 0; i < steps.length; i++){
    stepsValue.push(steps[i].value);
  }

  var savedRecipe = null;
  if (isUpdate) {
    savedRecipe = updateRecipe (id, name, img, categorie, time, nivel, stepsValue);
  } else {
    savedRecipe = createRecipe(id, name, img, categorie, time, nivel, stepsValue);
  }
  
  if (savedRecipe) {
    myModal.outerHTML = '';
    step = 1;
  }

  loadRecipes();

}

function updateRecipe(id, name, img, categorie, time, nivel, stepsValue) {
  return fetch("http://localhost:8080/recipes", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      name,
      img,
      categorie,
      time,
      nivel,
      stepsValue,
    }),
  }).then((r) => r.json());
}

function showRecipe(event, recipeName) {

  event.stopPropagation();
  
  var recipe = allRecipes.find((reteta) => reteta.nume == recipeName);

  if (event.target.innerHTML === 'Update') {
    update(recipe);
    return false;
  }

  if (event.target.innerHTML === 'Delete') {
    deleteRecipe(recipe.id);
    loadRecipes();
    return false;
  }

  var modal = `
  <div id="myModal" class="modal">

    <!-- Modal content -->
    <div class="modal-content">
      <div class="modal-header">
        <span class="close">&times;</span>
        <h2>${recipe.nume}</h2>
      </div>
      <div class="modal-body" style="text-align: center">
        <img src="${recipe.img}" alt="img" style="width:40%; ">

        <div style="text-align: left">

          <h3>Categorie: ${recipe.categorie}</h3>

          <h3>Timp: ${recipe.timp} min</h3>

          <h3>Nivel: ${recipe.nivel}</h3>

          <h2>Mod de preparare</h2>
  `;

  for(i=0; i<recipe.modDePreparare.length; i++) {
    modal += `<h3>Pasul ${i + 1}</h3>`;
    modal += `<p>${recipe.modDePreparare[i]}</p>`;
  }

  modal += `
  </div>
    </div>
    <div class="modal-footer">
    </div>
  </div>

  </div>`;

  document.getElementById('recipes').innerHTML += modal;

  var myModal = document.getElementById('myModal');

  var span = document.getElementsByClassName("close")[0];

  span.onclick = function() {
    myModal.outerHTML = '';

  }
}

function page(pageNo) {
  pageNumber = pageNo;

  document.getElementById('recipes').innerHTML = '';

  loadRecipes();
}

  



let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}



function update(recipe){
  
  var modal = `
  <div id="myModal" class="modal">

    <!-- Modal content -->
    <div class="modal-content">
      <div class="modal-header">
        <span class="close">&times;</span>
        <h2>Add Recipe</h2>
      </div>
      <div class="modal-body">
        <h3 style="display: none;" id="recipeId">${recipe.id}</h3>
        <span>Name:</span>
        <input type="text" placeholder="Name" id="name" value="${recipe.nume}"/>

        <span>ImageURL</span>
        <input type="text" placeholder="ImageURL" id="imageURL" value="${recipe.img}"/>

        <span>Category</span>
        <select name="categorie" id="categorie">
          <option value="felPrincipal">Main course</option>
          <option value="aperitiv">Appetizers</option>
          <option value="ciorbe">Soups</option>
          <option value="desert">Desert</option>
        </select>

        <span>Time</span><br>
        <input type="number" min="1" placeholder="Time" id="time" value="${recipe.timp}" /><br><br>

        <span>Level</span>
        <select name="nivel" id="nivel">
          <option value="incepator">Begginer</option>
          <option value="intermediar">Intermediar</option>
          <option value="avansat">Advanced</option>
        </select>

        <span>Method of preparation</span>
        <div id="stepPlaceholder">`;


        for(i=0; i<recipe.modDePreparare.length; i++) {
          modal += `<h3>Pasul ${i + 1}</h3>`;
          modal += `<textarea class="step" placeholder="First step">${recipe.modDePreparare[i]}</textarea>`;
        }

        step = recipe.modDePreparare.length;
         
        modal += `
        </div>

        <button id="addStep" onclick="addStep()">Next step</button>
      
      
      <div class="modal-footer">
        <button class="save" onclick="save('update')">Save</button>
      </div>

      
    </div>

  </div>
  `;

  document.getElementById('recipes').innerHTML += modal;

  document.getElementById('categorie').value = recipe.categorie;

  document.getElementById('nivel').value = recipe.nivel;

  var myModal = document.getElementById('myModal');

  var span = document.getElementsByClassName("close")[0];

  span.onclick = function() {
    myModal.outerHTML = '';
    step = 1;
  }
}



// Wrap every letter in a span
var textWrapper = document.querySelector('.ml9 .letters');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline({loop: true})
  .add({
    targets: '.ml9 .letter',
    scale: [0, 1],
    duration: 1500,
    elasticity: 600,
    delay: (el, i) => 45 * (i+1)
  }).add({
    targets: '.ml9',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 1000
  });