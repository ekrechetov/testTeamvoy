let offset = 0;//set start offset-parameter for first 12 pokemons
let prevPokemonsList;//for save no-filtered pokemons
const pokemonsTypeObj = {};//pokemons and their types
const typesColors = {};//types colors for type-bg

// Get first 12 pokemons:
$(document).ready(function() {
  showLoader();
  $.ajax({
    url: 'https://pokeapi.co/api/v2/pokemon/?limit=12',
    type: 'GET',
    success: function(respons) {            
      respons.results.map((elem, index) => {
        $.ajax({          
          url: elem.url,
          type: "GET",
          success:  function(res) {
            generateList(res);
            //if last element in the chunk:
            if (index == respons.results.length - 1) {
              hideLoader();                         
            } 
          }
        });                
      });
    },
    error: function(req, exception) {
      console.log('Request error ', exception);
    },
    complete: function(req, status) {
      console.log('Status: ', status);
    }    
  });
  let addBtn = document.querySelector('.add-btn');
  addBtn.style.display = 'block';
  addBtn.addEventListener("click", getNextChunk);
});

// Get all pokemons types and create typesColors object for bg:
$.ajax({
  url: 'https://pokeapi.co/api/v2/type/?limit=999',
  type: 'GET',
  success: function(res) {
    res.results.map(item => {
      bgColoor = '#' + Math.random().toString(16).substr(-6);
      typesColors[item.name] = bgColoor;//random color for type bg
    });    
  }
});