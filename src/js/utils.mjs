// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
export function getLocatStorageByType(key, type) {
  var list = getLocalStorage(key);
  if (list) {
    return list.filter((item) => item.Type === type);
  } else {
    list = [];
  }
  return list;
}
export function getLocatStorageById(key, id) {
  var list = getLocalStorage(key);
  if (list) {
    return list.filter((item) => item.Id === id);
  } else {
    list = [];
  }
  return list;
}
export function filterLocatStorage(key, type, input) {
  var list = getLocatStorageByType(key, type);
  if (list) {
    return list.filter((item) => (
              item.Equipment.Name == input ||
              item.Equipment.Brand == input ||
              item.Equipment.Model == input ||
              item.Client.Name == input ||
              item.Client.Contact == input ||
              item.WorkStage == input ||
              item.CreationDate == input ||
              item.Number == input ));
  } else {
    list = [];
  }
  return list;
}
export function findClientByNameAndContact(key, name, contact) {
  var list = getLocalStorage(key);
  if (list) {
    return list.filter((item) => (item.Name === name && item.Contact === contact));
  } else {
    list = [];
  }
  return list;
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParams(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const urlParam = urlParams.get(param);
  return urlParam;
}

export function renderListTemplate(template, parentElement, list, position="afterBegin", clear=false) {
  const htmlStrings = list.map(template);
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function renderTemplate(template, parentElement, data, callback) {
  parentElement.insertAdjacentHTML("afterBegin", template);
  if(callback) {
    callback(data);
  }
}

async function loadTemplate(path) {
  const t = await fetch(path);
  const template = await t.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("../partials/header.html");
  const headerElement = document.querySelector("#main-header");
  const footerTemplate = await loadTemplate("../partials/footer.html");
  const footerElement = document.querySelector("#main-footer");

  renderTemplate(headerTemplate, headerElement);
  renderTemplate(footerTemplate, footerElement);
}

export function alertMessage(message, scroll = true, duration = 3000) {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.innerHTML = `<p>${message}</p><span>X</span>`;

  alert.addEventListener("click", function (e) {
    if (e.target.tagName == "SPAN") {
      main.removeChild(this);
    }
  });
  const main = document.querySelector("main");
  main.prepend(alert);
  if (scroll) window.scrollTo(0, 0);

}

export function removeAllAlerts() {
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((alert) => document.querySelector("main").removeChild(alert));
}

export function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}