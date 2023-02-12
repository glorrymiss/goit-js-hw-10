import '../css/styles.css';
// затримка часу
import fetchCountries from './fetchCountries.js';
const debounce = require('lodash.debounce');
// сповіщення
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const DEBOUNCE_DELAY = 300;

const inputField = document.querySelector('#search-box');
const wrapMarkup = document.querySelector('.country-info');
inputField.addEventListener(
  'input',
  debounce(handleShowCountry, DEBOUNCE_DELAY)
);

function handleShowCountry(event) {
  event.preventDefault();

  const inputValue = event.target.value.trim();
  console.log(inputValue);
  if (inputValue === '') {
    return (wrapMarkup.innerHTML = '');
  } else {
    fetchCountries(inputValue)
      .then(data => {
        const country = data[0];

        if (data.length > 10) {
          Notiflix.Notify.info(
            '"Too many matches found. Please enter a more specific name."'
          );
          return '';
        } else if (data.length > 1 && data.length < 10) {
          return data.reduce(
            (markup, country) => createListMarkup(country) + markup,
            ''
          );
        } else {
          return data.reduce(
            (markup, country) => createMarkup(country) + markup,
            ''
          );
        }
      })

      .then(CreateInterfaceMarkup)
      .catch(onError);
  }
}

function createMarkup({ name, capital, population, flags, languages }) {
  return `
  <div  class="country-card">
   <div class="wrap">
    <img src=${flags.svg} alt="flag" width="40px" height="40px">
    <h2 class="name">${name.official}</h2>
   </div>
   <p class="text"><b>Capital:</b> ${capital[0] || ''}</p>
   <p class="text"><b>Population:</b> ${population}</p>
   <p class="text"><b>Languages:</b> ${Object.values(languages).join(', ')}</p>
  </div>`;
}

function createListMarkup({ flags, name }) {
  return `
          <div  class="country-card">
           <div class="wrap">
            <img src=${flags.svg} alt="flag" width="30px" height="30px>
            <h2 class="name">${name.official}</h2>
           </div>
          </div>
        `;
}

function CreateInterfaceMarkup(markup) {
  wrapMarkup.innerHTML = markup;
}

function onError(err) {
  console.log(err);
  wrapMarkup.innerHTML = '';
  return Notiflix.Notify.failure(
    'Too many matches found. Please enter a more specific name.'
  );
}
