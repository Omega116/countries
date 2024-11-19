"use strict";
const countriesContainer = document.querySelector(".countries");

const renderCountry = function (data, className = "") {
  console.log(data);
  const html = `
    <article class="country ${className}">
      <img class="country__img" src="${Object.values(data.flags)[1]}" />
      <div class="country__data">
        <h3 class="country__name">${data.name.common}</h3>
        <p class="country__row"><span>Population:</span>${(
          +data.population / 1000000
        ).toFixed(1)} M</p>
        <p class="country__row"><span>Region:</span>${data.region}</p>
        <p class="country__row"><span>Capital:</span>${data.capital}</p>
      </div>
    </article>
  `;
  countriesContainer.insertAdjacentHTML("beforeend", html);
};

const renderError = function (errorText) {
  countriesContainer.insertAdjacentText("beforeend", errorText);
};

const getJSON = function (url, errorMsg = "Something went wrong") {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(`${errorMsg} (${response.status})`);
    }
    return response.json();
  });
};

// Function to fetch and display all countries
const fetchAndDisplayCountries = async function () {
  try {
    // Fetch the countries
    const countries = await getJSON(
      "https://restcountries.com/v3.1/all",
      "Failed to fetch countries"
    );

    // Display countries
    countriesContainer.innerHTML = ""; // Clear the container
    countries.forEach((country) => renderCountry(country));
  } catch (error) {
    console.error(error);
    renderError("Something went wrong while loading the countries.");
  } finally {
    countriesContainer.style.opacity = 1;
  }
};

// Call the function to fetch and display all countries
fetchAndDisplayCountries();

const body = document.querySelector("body");
window.addEventListener("click", function (e) {
  const btn = e.target.closest(".btn-change-mode");
  if (btn) {
    body.classList.toggle("darkmode");
  }
});
