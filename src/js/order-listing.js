import { loadHeaderFooter, getParams } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import OrderListing from "./OrderListing.mjs";

loadHeaderFooter();

const type = getParams("type");
const dataSource = new ExternalServices("orders");
const element = document.querySelector(".order-list");

const list = new OrderListing(type, dataSource, element);
list.init();

document.querySelector("#filterList").addEventListener("click", (e) => {
  e.preventDefault();
  list.filterList();
});
document.querySelector("#filterReset").addEventListener("click", (e) => {
  e.preventDefault();
  list.resetList();
});
document.querySelector("#clearLS").addEventListener("click", (e) => {
  e.preventDefault();
  list.cleareLocalStorage();
});
