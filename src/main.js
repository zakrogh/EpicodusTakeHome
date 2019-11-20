import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

//Backend
const callApi = async function(queryInput, ingredientsInput){
  let query = queryInput;
  let ingredients = ingredientsInput;
  console.log(ingredients);
  let promise = new Promise(function(resolve, reject) {
    let request = new XMLHttpRequest();
    // let url = `https://api.betterdoctor.com/2016-03-01/doctors?location=wa-seattle&skip=0&limit=10&user_key=${process.env.API_KEY}&query=${query}&name=${name}`;
    let url = `https://cors-anywhere.herokuapp.com/http://www.recipepuppy.com/api/?q=${query}&i=${ingredients}`;
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
const displayData = function(data){
  $(".output").text("");
  console.log(data);
  if(data.results.length === 0)
    $(".output").text("No results found.");
  for(let i = 0; i < data.results.length; i++){
    $(".output").append(data.results[i].title + "<br>");
    if(data.results[i].thumbnail != "")
      $(".output").append("<img src='" + data.results[i].thumbnail + "'/><br>");
    $(".output").append("Ingredients: " + data.results[i].ingredients + "<br>");
    $(".output").append("Link " + data.results[i].href + "<br>");
    $(".output").append("<br><hr>");
  }
}
const displayError = function(data){
  $(".output").text(data);
}

$(document).ready(function(){
  $(".mainform").submit(async function(event){
    event.preventDefault();
    let query = $("#searchterm").val();
    let ingredients = $("#ingredients").val();
    ingredients = parseIngredients(ingredients);
    let data = await callApi(query,ingredients);
    if(data)
      displayData(data);
    else
      displayError(data);
  });
});
