import '../assets/style.css';
import "slick-carousel";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Imports for range sliders used in ABV, IBU search
import * as noUiSlider from 'nouislider/distribute/nouislider.js';
import 'nouislider/distribute/nouislider.css';

// header hamburger menu behavior
const navInner = document.getElementById('nav-inner');
const navToggler = document.getElementById('nav-toggler');
const navTitle = document.getElementById('nav-title');

navToggler.addEventListener('click', function() {
  navInner.classList.toggle('active');
  navToggler.classList.toggle('open');
  if (navTitle.innerText === "I feel like searching for a beer by...") {
    navTitle.innerText = "";
  } else {
    navTitle.innerText = "I feel like searching for a beer by...";
  }
});

class Slider {
  constructor() {
    this.init();
  }

  async fetchRandomBeer() {
    try {
      const response = await fetch("https://api.punkapi.com/v2/beers/random");
      const data = await response.json();
      return data;
    } catch (err) {
      console.log("Error!", error);
    }
  }

  async getBeersForSlider() {
    const beers = [];
    for (let i = 0; i < 3; i++) {
      const beer = await this.fetchRandomBeer();
      beers.push(...beer);
    }
    return beers;
  }

  async setSliderContent(beers) {
    const slides = document.querySelectorAll(".slider__item-content");
    slides.forEach((slide, i) => {
      const frag = document.createDocumentFragment();

      const title = document.createElement("h2");
      title.innerText = beers[i].name;
      title.classList.add("slider__item-title");
      frag.appendChild(title);

      const subtitle = document.createElement("h3");
      subtitle.innerText = beers[i].tagline;
      subtitle.classList.add("slider__item-subtitle");
      frag.appendChild(subtitle);

      const description = document.createElement("p");
      description.innerText = beers[i].description;
      description.classList.add("slider__item-description");
      frag.appendChild(description);

      slide.appendChild(frag);
    });
  }

  showSlider() {
    $(document).ready(function() {
      $(".slider").slick({
        autoplay: true,
        speed: 1000,
        autoplaySpeed: 2000,
        dots: true
      });
    });
  }

  init() {
    this.getBeersForSlider()
      .then(beers => this.setSliderContent(beers))
      .then(() => this.showSlider());
  }
}

const slider = new Slider();

// search results - warning! this function takes array as a parameter

const searchReasultsBox = document.getElementById('search-results');

const setResults = searchResults => {
    searchReasultsBox.innerHTML = null;
    searchResults.map(result => {
        const {
            name,
            image_url,
            abv,
            ibu,
            tagline,
            description,
            food_pairing
        } = result;

        const searchResultItem = document.createElement('li');
        const foodPairingList = food_pairing.map((food) => {
            return `<li class="search-results__food-list-item">${food}</li>`;
        }).join('');
        
        const searchResultContent = `
            <div class="search-results__img-wrapper">
                <img class="search-results__img" src= ${image_url} />
            </div>
            <div class="search-results__properties">
                <h3 class="search-results__title">${name}</h3>         
                <p class="search-results__tagline">${tagline}</p>
                <p class="search-results__description">${description}</p>
                <p class="search-results__abv">abv: ${abv}%</p>
                <p class="search-results__ibu">ibu: ${ibu}</p>   
                <div class="search-results__food">
                    <p class="search-results__food-title">Food pairing advice:</p>
                    <ul class="search-results__food-list">
                        ${foodPairingList}
                    </ul>
                </div>
            </div>
        `;
        
        searchResultItem.innerHTML = searchResultContent;
        searchResultItem.classList.add("search-results__item");
        searchReasultsBox.appendChild(searchResultItem);
    });
}

//Searching by description

const searchByDescriptionInput = document.getElementById(
  "search-by-description-input"
);
const searchByDescriptionBtn = document.getElementById(
  "search-by-description-btn"
);

searchByDescriptionBtn.addEventListener("click", () =>
  fetchBeers(searchByDescriptionInput.value)
);

function fetchBeers(beerProperty) {
  fetch("https://api.punkapi.com/v2/beers?page=1&per_page=80")
    .then(response => {
      return response.json();
    })
    .then(data => {
        let results = [];
        data.filter(beer => {
            const description = beer.description.toLowerCase();
            if(description.includes(beerProperty.toLowerCase())){
                results.push(beer);
            }
        })
        setResults(results);
    }).catch( error => {
        console.log('Błąd!', error);
    });
}

// this fetch is needed in searching by name

//  choosenBeerName - name put in input by user

function fetchBeerByName(choosenBeerName) {
  fetch(`https://api.punkapi.com/v2/beers?beer_name=${choosenBeerName}`)
    .then(response => {
      return response.json();
    })
    .then(data => {
      console.log(data);
      //add here what we want to do with data
    })
    .catch(error => {
      console.log("Błąd!", error);
    });
}

// Searching by ABV,IBU

// ABV, IBU search - get target elements to make range sliders
const rangeSliderAbvBar = document.getElementById('range-slider-abv-bar');
const rangeSliderAbvChoice = document.getElementById('range-slider-abv-choice');
const searchByAbvBtn = document.getElementById('search-by-abv-btn');
const rangeSliderIbuBar = document.getElementById('range-slider-ibu-bar');
const rangeSliderIbuChoice = document.getElementById('range-slider-ibu-choice');
const searchByIbuBtn = document.getElementById('search-by-ibu-btn');

// ABV, IBU search - create variables to store user input from range sliders
let choosenMinAbvValue, 
    choosenMaxAbvValue,
    choosenMinIbuValue,
    choosenMaxIbuValue;

// ABV, IBU search - create two range sliders
noUiSlider.create(rangeSliderAbvBar, {
  start: [3, 30],
  connect: true,
  range: {
    min: 0.5,
    max: 56
  },
  step: 0.5
});
noUiSlider.create(rangeSliderIbuBar, {
  start: [30, 530],
  connect: true,
  range: {
    min: 0,
    max: 1158
  },
  step: 1
});

// ABV, IBU search - create functions to show user search criteria next to range slider
function showUserAbvChoice(values) {
    values = values.map(element => {
        return element
            .substring(0, element.length-1)
            .concat('%');
    });
    values = values.join(' - ');
    rangeSliderAbvChoice.innerHTML = `Your choice: ${values}`;
}
function showUserIbuChoice(values) {
    values = values.map(element => {
        return element.substring(0, element.length-3);
    });
    values = values.join(' - ');
    rangeSliderIbuChoice.innerHTML = `Your choice: ${values}`;   
}

// ABV, IBU search - create function to get user input from range sliders to be used in fetch 
function getUserAbvInputs(values) {
    choosenMinAbvValue = values[0];
    choosenMaxAbvValue = values[1];
    return choosenMinAbvValue, choosenMaxAbvValue;
};
function getUserIbuInputs(values) {
    choosenMinIbuValue = values[0];
    choosenMaxIbuValue = values[1];
    return choosenMinIbuValue, choosenMaxIbuValue;
};

// ABV, IBU search - listen for update values on range slider, handle them 
rangeSliderAbvBar.noUiSlider.on('update', (values) => {
    showUserAbvChoice(values);
    getUserAbvInputs(values);
});
rangeSliderIbuBar.noUiSlider.on('update', (values) => {
    showUserIbuChoice(values);
    getUserIbuInputs(values);
});

// ABV search - create function fetching data and returning array with data 
function fetchBeerByAbv(choosenMinAbvValue, choosenMaxAbvValue){
    fetch(`https://api.punkapi.com/v2/beers?abv_gt=${choosenMinAbvValue}&abv_lt=${choosenMaxAbvValue}`)
    .then(response => {
      return response.json();
    })
    .then(data => { 
        setResults(data);
    }).catch( error => {
        console.log('Błąd!', error);
    });
}

// IBU search - create function fetching data and returning array with data 
function fetchBeerByIbu(choosenMinIbuValue, choosenMaxIbuValue){
    fetch(`https://api.punkapi.com/v2/beers?ibu_gt=${choosenMinIbuValue}&ibu_lt=${choosenMaxIbuValue}`)
    .then(response => {
      return response.json();
    })
    .then(data => { 
        setResults(data);
    }).catch( error => {
        console.log('Error!', error);
    });
};

// ABV, IBU search - listen for user to click search button and call fetch functions 
searchByAbvBtn.addEventListener('click', () => fetchBeerByAbv(choosenMinAbvValue, choosenMaxAbvValue));
searchByIbuBtn.addEventListener('click', () => fetchBeerByIbu(choosenMinIbuValue, choosenMaxIbuValue));
