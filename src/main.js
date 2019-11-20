import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

const callApi = async function(queryInput, ingredientsInput){
  let query = queryInput;
  let ingredients = ingredientsInput;
  let promise = new Promise(function(resolve, reject) {
    let request = new XMLHttpRequest();
    // let url = `https://api.betterdoctor.com/2016-03-01/doctors?location=wa-seattle&skip=0&limit=10&user_key=${process.env.API_KEY}&query=${query}&name=${name}`;
    let url = `http://www.recipepuppy.com/api/?q=${query}&i=${ingredients}`;
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
