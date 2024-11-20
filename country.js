"use strict";

const countryContainer = document.querySelector(".country-container");
const neighboursContainer = document.querySelector(".neighbours");

// Extract the country name from the URL query string
const countryName = window.location.toString().split("?")[1];

const getJSON = function (url, errorMsg = "Something went wrong") {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(`${errorMsg} (${response.status})`);
    }
    return response.json();
  });
};

// Make the population more readable
const renderNumber = function (num) {
  return num.toLocaleString("en-US");
};

const renderArray = function (arr) {
  let str = arr.join(" ");
  return str;
};

const getCurrency = function (data) {
  let cur = Object.values(data);
  return cur[0].name;
};
/* 
async function neighbourHTML(border) {
  const country = await getJSON(
    `https://restcountries.com/v3.1/alpha/${border}`,
    "Failed to fetch country data"
  );
  const countryName = country[0].name.common;

  return `<p class='neighbour'>${countryName}</p>`;
}

const buildHtml = async function (borders) {
  let html = ``;
  for (const border of borders) {
    html += await neighbourHTML(border);
  }

  return html;
}; */

async function neighbourHTML(border) {
  try {
    const country = await getJSON(
      `https://restcountries.com/v3.1/alpha/${border}`,
      "Failed to fetch country data"
    );
    const countryName = country[0].name.common;
    return `<a href='country.html?${countryName}'>
    <p class='neighbour'>${countryName}</p>
    </a>
    `;
  } catch (error) {
    console.error(error);
  }
}

const buildHtml = async function (borders) {
  if (borders) {
    let html = ``;
    for (const border of borders) {
      html += await neighbourHTML(border); // Await the result here
    }
    return html;
  }
};

const renderCountry = async function (data) {
  const country = data[0];
  let text = await buildHtml(country.borders);
  const html = `
  <div class="country-flag-box">
  <img class='country-flag' src='${country.flags.svg}' >
  </div>
      <div class="contury-info-box">
        <h2 class="country-name">${country.name.common}</h2>
        <div class="content">
          <p class="country-info">
            Native name: <span class="response">${country.name.common}</span>
          </p>
          <p class="country-info">
            Top Level Domains: <span class="response">${renderArray(
              country.tld
            )}</span>
          </p>
          <p class="country-info">
            Population: <span class="response">${renderNumber(
              country.population
            )}</span>
          </p>
          <p class="country-info">
            Currencies: <span class="response">${getCurrency(
              country.currencies
            )}</span>
          </p>
          <p class="country-info">
            Region: <span class="response">${country.region}</span>
          </p>
          <p class="country-info">
            Languages: <span class="response">${Object.values(
              country.languages
            )}</span>
          </p>
          <p class="country-info">
            Sub Region: <span class="response">${country.subregion}</span>
          </p>
          <p class="country-info">
            Capital: <span class="response">${country.capital[0]}</span>
          </p>
        </div>
        <div class="neighbours-box">
          <p class="country-info">Border Countries:</p>
          <div class="neighbours">${
            text != undefined ? text : `<p>No neighbours</p>`
          }
          </div>
        </div>
      </div>`;
  /*  `
    <div class="country">
      <h2>${country.name.common}</h2>
      <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" />
      <p><strong>Region:</strong> ${country.region}</p>
      <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
      <p><strong>Capital:</strong> ${
        country.capital ? country.capital[0] : "N/A"
      }</p>
    </div> 
  `; */
  countryContainer.insertAdjacentHTML("beforeend", html);
};

const fetchCountry = async function () {
  try {
    if (!countryName) {
      throw new Error("No country specified in the URL.");
    }

    // Fetch the country data
    const country = await getJSON(
      `https://restcountries.com/v3.1/name/${countryName}`,
      "Failed to fetch country data"
    );

    // Render the country
    renderCountry(country);
  } catch (err) {
    console.error(err);
    countryContainer.textContent = err.message;
  }
};

// Fetch and display the country
fetchCountry();
