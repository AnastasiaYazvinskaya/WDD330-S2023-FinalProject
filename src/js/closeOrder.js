import { loadHeaderFooter, getParams } from "./utils.mjs";
import WorkOrder from "./WorkOrder.mjs";

loadHeaderFooter();

const orderId = getParams("order");
const newOrder = new WorkOrder(orderId);
newOrder.init();

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
document.querySelector("#save").addEventListener("click", (e) => {
  e.preventDefault();
  const myForm = document.forms[0];
  const chk_status = myForm.checkValidity();
  myForm.reportValidity();
  if (chk_status) newOrder.save();
});
document.querySelector("#next").addEventListener("click", (e) => {
  e.preventDefault();
  const myForm = document.forms[0];
  const chk_status = myForm.checkValidity();
  myForm.reportValidity();
  if (chk_status)
    /*window.scrollTo(0, 0);
            document.querySelector("nav img:nth-child(2)").classList.add("order-scale");
            */
    newOrder.close();
});
document.querySelector("#check").addEventListener("click", (e) => {
  e.preventDefault();
  const myForm = document.forms[0];
  const chk_status = myForm.checkValidity();
  myForm.reportValidity();
  if (chk_status) newOrder.check();
});
