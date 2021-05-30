export default class ApiService {
  constructor({ root, query, loaderSelector, onResolved, onRejected }) {
    this.root = root;
    this.query = query;
    this.onResolved = onResolved;
    this.onRejected = onRejected;
    this.loader = this.getLoader(loaderSelector);
  }

  getLoader(loader) {
    const spinner = document.querySelector(`${loader}`);
    return { spinner };
  }

  fetch() {
    this.loader.spinner.classList.remove("is-hidden");
    fetch(`${this.root}${this.query}`)
      .then(this.onFetch)
      .then((response) => {
        this.loader.spinner.classList.add("is-hidden");
        this.onResolved(response);
      })
      .catch((response) => {
        this.loader.spinner.classList.add("is-hidden");
        this.onRejected(response);
      });
  }

  onFetch(response) {
    if (response.ok) {
      return response.json();
    } else if (response.status === 404) {
      throw "Invalid entry. Please try again.";
    } else {
      throw "It seems there are some server issues.";
    }
  }
}
