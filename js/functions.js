function generateList(res) {
  if (!res) {console.log('Empty request');}

  let item = document.createElement('li');
  item.classList.add('pokemons-list-item');
  item.setAttribute('data-id', `${res.id}`);

  let image = document.createElement('img');
  image.src = res.sprites.front_default;
  image.setAttribute('onclick', `showInfo(${res.id})`);
  image.classList.add('pokemons-list-item-img'); 

  let title = document.createElement('h3');
  title.classList.add('pokemons-list-item-title');
  title.innerText = res.name;

  let typesList = document.createElement('ul');
  typesList.classList.add('pokemons-list-item-types');

  res.types.map(elem => {
    let typesListItem = document.createElement('li');
    typesListItem.classList.add('pokemons-list-item-types-item');    
    typesListItem.style.background = `linear-gradient(to top, ${typesColors[elem.type.name]}, #fff )`;
    typesListItem.style.borderColor = typesColors[elem.type.name];
    typesListItem.innerText = elem.type.name;
    typesListItem.addEventListener('click', filterTypes);    
    typesListItem.setAttribute('data-id', `${res.id}`);
    typesListItem.setAttribute('data-type', `${elem.type.name}`);
    typesList.append(typesListItem);
  });            

  item.append(image);
  item.append(title);
  item.append(typesList);
  document.querySelector('.pokemons-list').append(item);
}

function getNextChunk() { 
  showLoader(); 
  $.ajax({
    url: `http://pokeapi.co/api/v2/pokemon/?offset=${offset + 12}&limit=12`,
    type: 'GET',
    success: function(respons) {
      respons.results.map((elem, index) => {
        $.ajax({
          url: elem.url,
          type: 'GET',
          success: function(res) {
            generateList(res);
            //if last element in the chunk:
            if (index == respons.results.length - 1) {
              hideLoader();
              offset = offset + 12;              
            }  
          }
        });
      });      
    }
  });}

function generateData(res) {
  let dataBox = document.getElementById('data-box');
  if (dataBox.innerHTML) {
    while (dataBox.firstChild) {
      dataBox.removeChild(dataBox.firstChild);
    }
  }
  let image = document.createElement('img');
  image.src = res.sprites.front_default;
  image.classList.add('pokemons-list-item-img');

  let title = document.createElement('h3');
  title.classList.add('pokemons-list-item-title');
  let stringId = '' + res.id;
  while(stringId.length < 3) {    
    stringId = '0' + stringId;
  }    
  title.innerText = `${res.name} #${stringId}`;
  let dataTable = document.createElement('table');
  dataTable.classList.add('data-table');
  let types = res.types.map((elem) => {
    return elem.type.name;
  });
  dataTable.innerHTML = `\
  <tr><td>Type</td><td>${types.join(', ')}</td></tr>\
  <tr><td>Attack</td><td>${res.stats[4].base_stat}</td></tr>\
  <tr><td>Defense</td><td>${res.stats[3].base_stat}</td></tr>\
  <tr><td>HP</td><td>${res.stats[5].base_stat}</td></tr>\
  <tr><td>SP attack</td><td>${res.stats[2].base_stat}</td></tr>\
  <tr><td>SP defense</td><td>${res.stats[1].base_stat}</td></tr>\
  <tr><td>Speed</td><td>${res.stats[0].base_stat}</td></tr>\
  <tr><td>Weight</td><td>${res.weight}</td></tr>\
  <tr><td>Total moves</td><td>${res.moves.length}</td></tr>\
  `;
  dataBox.append(image);
  dataBox.append(title);
  dataBox.append(dataTable);
  dataBox.onclick = closeInfo;
}

function showInfo(id) {
  $.ajax({
    url: `http://pokeapi.co/api/v2/pokemon/${id}`,
    type: 'GET',
    success: function(res) {      
      generateData(res);
    }
  });  
  let dataBox = document.getElementById('data-box');
  dataBox.classList.add('active');
  if (document.body.clientWidth < 750)
  document.querySelector('.dark-bg').style.display = 'block';
}

function closeInfo() {
  let dataBox = document.getElementById('data-box');
  dataBox.classList.remove('active');
  document.querySelector('.dark-bg').style.display = 'none';
}

function showLoader() {  
  let loader = document.querySelector('.dark-bg');
  loader.classList.add('loader');
  loader.style.display = 'block';
}

function hideLoader() {
  let loader = document.querySelector('.dark-bg');
    loader.classList.remove('loader');
  loader.style.display = 'none';
}

function filterTypes(event) {
  let pokemonsList = document.querySelector('.pokemons-list');
  prevPokemonsList = pokemonsList.cloneNode(true);

  let filteredList = document.createElement('ul');
  filteredList.classList.add('pokemons-list');   
  const itemType = event.target.getAttribute('data-type');
  let typeElements = document.querySelectorAll(`.pokemons-list-item-types-item[data-type="${itemType}"]`);
  
  typeElements.forEach((elem) => {    
    let id = elem.getAttribute('data-id');
    let resultElem = document.querySelector(`.pokemons-list-item[data-id = "${id}"]`);
    filteredList.append(resultElem);    
  });
  pokemonsList.remove();
  let pokemonsBox = document.querySelector('.pokemons-box');
  pokemonsBox.prepend(filteredList);
  document.querySelector('.main-filter-reset').style.display = 'block';
  document.querySelector('.add-btn').style.display = 'none';

  let typesItem = document.querySelectorAll('.pokemons-list-item-types-item');
  typesItem.forEach((elem) => {
    elem.style.cursor = 'default';
    elem.removeEventListener('click', filterTypes);
  });
}

function resetFilter() {
  document.querySelector('.pokemons-list').remove();
  let pokemonsBox = document.querySelector('.pokemons-box');
  pokemonsBox.prepend(prevPokemonsList);
  document.querySelector('.add-btn').style.display = 'block';
  document.querySelector('.main-filter-reset').style.display = 'none';  
  
  let typesItem = document.querySelectorAll('.pokemons-list-item-types-item');
  typesItem.forEach((elem) => {
    elem.addEventListener('click', filterTypes);
  });
}