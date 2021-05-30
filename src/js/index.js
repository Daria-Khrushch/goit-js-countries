import '../sass/styles.scss';
import ApiService from "./api";
import { error } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";
import countryMarkup from "../templates/country.hbs";
import countriesMarkup from "../templates/countries.hbs";

const debounce = require("lodash.debounce");


const refs = {
  countryContainer: document.querySelector(".country"),
  input: document.querySelector("input[data-country]"),
};
const { countryContainer, input } = refs;

addPlaceholder();
input.addEventListener("input", debounce(getRequestedCountryInfo, 500));
countryContainer.addEventListener("click", onCountryClick);

function getRequestedCountryInfo(e) {
  const name = e.target.value.trim();

  if (e.target.value.length === 0) {
    countryContainer.innerHTML = "";
    addPlaceholder();
    return;
  }

  fetchRequest(name);
}

function makeMarkup(data) {
  countryContainer.innerHTML = "";

  if (input.value.length === 0) {
    countryContainer.innerHTML = "";
    return;
  }

  if (data.length === 1) {
    countryContainer.insertAdjacentHTML("beforeend", countryMarkup(data));
  } else if (data.length > 10) {
    addPlaceholder();
    error({
      text: "Too many matches found. Please enter a more specific query!",
      delay: 4000,
    });
  } else {
    countryContainer.insertAdjacentHTML("beforeend", countriesMarkup(data));
  }
}

function onError(err) {
  countryContainer.innerHTML = "";
  const error = document.createElement("h1");
  error.textContent = "Sorry, we couldn't pull up requested data :(";
  error.classList.add("header");
  countryContainer.appendChild(error);
  console.warn(err);
}

function addPlaceholder() {
  const placeholderRow = `<li class="placeholder-item">
              <div class="placeholder-mark"></div>
              <div class="placeholder-row"></div>
            </li>`;
  countryContainer.insertAdjacentHTML(
    "beforeend",
    `<ul class="placeholder-list">${placeholderRow.repeat(4)}</ul>`
  );
}

function onCountryClick(e) {
  e.preventDefault();

  if (e.target.nodeName === "IMG") {
    const name = e.target.parentNode.textContent;
    fetchRequest(name);
    return;
  }

  if (e.target.nodeName === "A") {
    const name = e.target.textContent;
    fetchRequest(name);
  }
}

function fetchRequest(name) {
  const apiService = new ApiService({
    root: "https://restcountries.eu/rest/v2/name/",
    query: name,
    loaderSelector: ".loader",
    onResolved: makeMarkup,
    onRejected: onError,
  });

  apiService.fetch();
}
