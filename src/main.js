import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

//Backend
const callApi = async function(queryInput, ingredientsInput, pageInput){
  let query = queryInput;
  let ingredients = ingredientsInput;
  let page = pageInput;
  console.log(ingredients);
  let promise = new Promise(function(resolve, reject) {
    let request = new XMLHttpRequest();
    let url = `https://cors-anywhere.herokuapp.com/http://www.recipepuppy.com/api/?q=${query}&i=${ingredients}&p=${page}`;
    request.onload = function() {
      if (this.status === 200) {
        resolve(request.response);
      } else {
        reject(Error(request.statusText));
      }
    }
    request.open("GET", url, true);
    request.send();

  });
  let apiData = promise.then(async function(response) {
    let content = JSON.parse(response);
    return content;
  }, async function(error) {
    return error;
  });
  return apiData;
}
const parseIngredients = function(ingredients){
  let output = ingredients.split("\n").join(", ");
  return output;
}

//Frontend
// const displayData = function(data){
//   $(".output").text("");
//   console.log(data);
//   if(data.results.length === 0)
//     $(".output").text("No results found.");
//   for(let i = 0; i < data.results.length; i++){
//     $(".output").append(data.results[i].title + "<br>");
//     if(data.results[i].thumbnail != "")
//       $(".output").append("<img src='" + data.results[i].thumbnail + "'/><br>");
//     $(".output").append("Ingredients: " + data.results[i].ingredients + "<br>");
//     $(".output").append("Link " + data.results[i].href + "<br>");
//     $(".output").append("<br><hr>");
//   }
// }
var displayData = function(data){
  // $(".output").show();
  $(".output").text("");
  for(let i = 0; i < data.results.length; i++){
    var placeHolder = "";
    var oldWrapper;
    var wrapper;
    // var listItems = '<ul><li>Cheese</li><li>Sauce</li>';
    // for(let j = 0; j < myOrder.pizzas[i].toppings.length; j++){
    //   listItems += '<li>' + myOrder.pizzas[i].toppings[j] + '</li>';
    // }
    // listItems += '</ul>';

    placeHolder += '<div class="col-md-4 column' + i + '">';
    placeHolder += '<div class="card card-info recipe' + i + '" id="recipe' + i + '">';
    placeHolder += '<div class="card-header heading' + i + '">' + '<a target="_blank" href="'+ data.results[i].href + '">'+ data.results[i].title + '</a></div>';
    placeHolder += '<div class="card-body body' + i + '">' + "<img src='" + data.results[i].thumbnail + "'/><br><hr>" + "Ingredients: " + data.results[i].ingredients + '</div>';
    placeHolder += '</div></div>';
    $(".output").append(placeHolder);
    if((i % 3) === 0 && i > 0){
      wrapper = ".column" + (i);
      $(wrapper).wrap('<div class="row"></div>');
    }else if((i % 3) === 1){
      oldWrapper = ".column" + (i - 1);
      wrapper = ".column" + (i) + ", " + oldWrapper;
      $(oldWrapper).unwrap()
      $(wrapper).wrapAll('<div class="row"></div>');
    }else if((i % 3 ) === 2){
      oldWrapper = ".column" + (i - 2) + ", " + ".column" + (i - 1);
      wrapper = ".column" + (i) + ", " + oldWrapper;
      $(oldWrapper).unwrap();
      $(wrapper).wrapAll('<div class="row"></div>');
    }else{
      $(".column0").wrap('<div class="row"></div>');
    }
  }
}
const displayError = function(data){
  $(".output").text(data);
}

$(document).ready(function(){
  let data;
  let query;
  let ingredients;
  let page;
  $(".mainform").submit(async function(event){
    event.preventDefault();
    page = 1;
    $(".btn").prop('disabled', false);
    query = $("#searchterm").val();
    ingredients = $("#ingredients").val();
    ingredients = parseIngredients(ingredients);
    data = await callApi(query,ingredients,page);
    if(data)
      displayData(data);
    else
      displayError(data);
  });
  $("#pagePrev").click(async function(){
    console.log(data);
    if(page > 1){
        page--;
      data = await callApi(query,ingredients,page);
      if(data)
        displayData(data);
      else
        displayError(data);
      }
  });
  $("#pageNext").click(async function(){
    console.log(data);
    page++;
    data = await callApi(query,ingredients,page);
    if(data)
      displayData(data);
    else
      displayError(data);
  });
});
