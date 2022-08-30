import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchFunc } from "./js/fetchCountries";

const refs = {
    body: document.querySelector('js-background'),
    input: document.querySelector('input#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
} 

const DEBOUNCE_DELAY = 300;

refs.input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
    const searchCountry = refs.input.textContent = e.target.value.trim();

      if (searchCountry === '') {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    return;
    }

    console.log(searchCountry)
    fetchFunc(searchCountry).then(data => {
        renderCounryCard(data)
    }).catch(error => {
        console.log(error);
        Notiflix.Notify.failure('Oops, there is no country with that name')
    } )
}

function renderCounryCard(data) {
    if (data.length >= 10) {
        Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
        return;
    }
    if (data.length >= 2) {
        const markup = data.map(obj => {
        return `<li class="country-list_item"><img src="${obj.flags.svg}" width="50"><h2 class="country-list_headind">${obj.name.official}</h2></li>`;
        }).join(' ');
        
        refs.countryInfo.innerHTML = '';
        refs.countryList.innerHTML = markup;
    } 
    else if (data.length === 1) {
    const markupBox = data.map(obj => {
        return `
    <div class="country-info_head">
        <img src="${obj.flags.svg}" alt="${obj.name.official}" width="50">
        <h2 class="country-info_headind">${obj.name.official}</h2>
    </div>
    <p class="country-info_text">Capital: ${obj.capital}</p>
    <p class="country-info_text">Population: ${obj.population}</p>
    <p class="country-info_text">Languages: ${Object.values(obj.languages)}</p>`
    }).join(' ').replaceAll(',', ', ');
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = markupBox;
    }
}
