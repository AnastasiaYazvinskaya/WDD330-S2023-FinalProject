import { loadHeaderFooter } from "./utils.mjs";
import WorkOrder from "./WorkOrder.mjs";

loadHeaderFooter();

const newOrder = new WorkOrder();
newOrder.init();

document
  .querySelector("#fullname")
  .addEventListener("change", newOrder.setContact.bind(newOrder));
// Add buttons
document.querySelector(".add-service").addEventListener("click", (e) => {
  e.preventDefault();
  newOrder.addService();
});
document.querySelector(".add-spare").addEventListener("click", (e) => {
  e.preventDefault();
  newOrder.addSpare();
});
// Next button (create or close or save(?))
document.querySelector("#next").addEventListener("click", (e) => {
  e.preventDefault();
  const myForm = document.forms[0];
  const chk_status = myForm.checkValidity();
  myForm.reportValidity();
  if (chk_status) {
    /*window.scrollTo(0, 0);
            document.querySelector("nav img:nth-child(1)").classList.add("order-scale");
            sleep(10000);*/
    newOrder.create();
  }
});
