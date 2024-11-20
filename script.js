"use strict";
const countriesContainer = document.querySelector(".countries");

const renderCountry = function (data, className = "") {
  const html = `
  <article class="country ${className} option active" data-reg="${data.region}">
  <a href='country.html?${data.name.common}'>
      <img class="country__img" src="${Object.values(data.flags)[1]}" />
      <div class="country__data">
        <h3 class="country__name">${data.name.common}</h3>
        <p class="country__row"><span>Population:</span>${(+data.population).toLocaleString(
          "en-US"
        )} </p>
        <p class="country__row"><span>Region:</span>${data.region}</p>
        <p class="country__row"><span>Capital:</span>${data.capital}</p>
      </div>
      </a>
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
    countries.forEach((country) => {
      if (country.name.common.toUpperCase() != "ISRAEL") renderCountry(country);
    });
  } catch (error) {
    console.error(error);
    renderError("Something went wrong while loading the countries.");
  } finally {
    countriesContainer.style.opacity = 1;
  }
};

// Call the function to fetch and display all countries
fetchAndDisplayCountries();

/* Filtering: SEARCH BAR */
const searchEl = document.querySelector("#search-bar");

// Function to filter countries
const search = () => {
  const optionsEl = document.querySelectorAll(".option");
  const searchValue = searchEl.value.toUpperCase();

  optionsEl.forEach((el) => {
    const countryName = el
      .querySelector(".country__name")
      .textContent.toUpperCase();
    el.style.display = countryName.includes(searchValue) ? "" : "none";
  });
};

// Add event listener to the search bar
searchEl.addEventListener("input", search);

let filterActive;

function filterCategory(category) {
  if (filterActive !== category) {
    // Reset results list
    const options = document.querySelectorAll(".option");
    options.forEach((option) => option.classList.add("hidden"));

    // Filter elements based on data-reg attribute
    options.forEach((option) => {
      if (option.getAttribute("data-reg") === category) {
        option.classList.remove("hidden");
      }
    });

    // Update the active filter
    filterActive = category;
  }
}

// Handle select element change
document
  .getElementById("category-filter")
  .addEventListener("change", function () {
    const selectedCategory = this.value;

    if (selectedCategory === "Filter by Region") {
      // Show all items
      const items = document.querySelectorAll(".option");
      items.forEach((item) => item.classList.remove("hidden"));
      filterActive = "Filter by Region";
    } else {
      // Filter by selected category
      filterCategory(selectedCategory);
    }
  });
