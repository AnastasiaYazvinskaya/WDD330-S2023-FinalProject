import { loadHeaderFooter } from "./utils.mjs";
import WorkOrder from "./WorkOrder.mjs";

loadHeaderFooter();

const newOrder = new WorkOrder();
newOrder.init();

document
    .querySelector("#fullname")
    .addEventListener("change", newOrder.setContact.bind(newOrder));
document
    .querySelector("#in-work")
    .addEventListener("change", newOrder.setServicePrice.bind(newOrder));
document
    .querySelector("#in-spare")
    .addEventListener("change", newOrder.setSparePrice.bind(newOrder));
// Add buttons
document
    .querySelector(".add-service")
    .addEventListener("click", (e) => {
        e.preventDefault();
        newOrder.addService();
});
document
    .querySelector(".add-spare")
    .addEventListener("click", (e) => {
        e.preventDefault();
        newOrder.addSpare();
});
// Next button (create or close or save(?))
document
    .querySelector("#next")
    .addEventListener("click", (e) => {
        e.preventDefault();
        const myForm = document.forms[0];
        const chk_status = myForm.checkValidity();
        myForm.reportValidity();
        if(chk_status)
            newOrder.save();
});


// listening for click on the button
/*document
    .querySelector("#button")
    .addEventListener("click", (e) => {
        e.preventDefault();
        const myForm = document.forms[0];
        const chk_status = myForm.checkValidity();
        myForm.reportValidity();
        if(chk_status)
            newOrder.checkout();
});*/