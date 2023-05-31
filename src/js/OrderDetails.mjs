import { getLocalStorage, setLocalStorage, alertMessage, getLocatStorageById} from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

/* This script file will contain the code to dynamically produce the order detail pages. */
function orderDetailsTemplate(order) {
    return `<div class="block">
        <h3>Info</h3>
        <div class="flex">
            <p><b>Equpment:</b> ${order.Equipment.Name} ${order.Equipment.Brand} ${order.Equipment.Model}</p>
            <p><b>Client:</b> ${order.Client.Name} (${order.Client.Contact})</p>
        </div>
        <div class="row">
            <label for="defects"><b>Defects:</b></label>
            <textarea id="defects" name="defects" readonly>${order.Defects}</textarea>
        </div>
        <div class="row">
            <label for="complaints"><b>Complaints:</b></label>
            <textarea id="complaints" name="complaints" readonly>${order.Complaints}</textarea>
        </div>
    </div>
    <div class="block">
        <div class="table-data">
            <p><b>Work</b></p>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th id="price">Price</th>
                    </tr>
                </thead>
                <tbody id="work"></tbody>
            </table>
        </div>
        <div class="table-data">
            <p><b>Spares</b></p>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th id="price">Price</th>
                    </tr>
                </thead>
                <tbody id="spares"></tbody>
            </table>
        </div>
        <p id="final-price"><b>Final price: ${order.FinalPrice} RUB</b></p>
    </div>`;
  }
function orderWorksTemplate(work) {
    return `<tr>
        <td class="left">${work.Name}</td>
        <td>${work.Price} RUB</td>
    </tr>`;
}
function orderSparesTemplate(spare) {
    return `<tr>
        <td class="left">${spare.Name}</td>
        <td>${spare.Price} RUB</td>
    </tr>`;
}
  
  export default class orderDetails {
    constructor(orderId, dataSource) {
      this.orderId = orderId;
      this.order = {};
      this.dataSource = dataSource;
    }
    async init(form="view"){
        this.order = getLocatStorageById("orders", this.orderId)[0];//await this.dataSource.findOrderById(this.orderId);
        
        if (form == "view"){
            this.renderOrderDetails("#order-details");
            document.querySelector("#orderId").insertAdjacentHTML("afterbegin", `${this.order.Number}`);
        } else if (form == "create") {
            console.log("create");
        } else if (form == "close") {
            console.log("close");
        }
    }
    renderOrderDetails(selector) {
        const element = document.querySelector(selector);
        element.insertAdjacentHTML(
            "afterBegin",
            orderDetailsTemplate(this.order)
        );
        this.renderOrderWorks();
        this.renderOrderSpares();
        if (this.order.Type === "active") {
            this.renderButtonInWork();
        } else if (this.order.Type === "closed") {
            console.log("closed");
            //this.renderButtonReopen();
        }
    }
    async renderOrderWorks() {
        const element = document.querySelector("#work");
        for (var i in this.order.Works) {
            const work = await new ExternalServices("services").findOrderById(this.order.Works[i]);
            element.insertAdjacentHTML(
                "beforeEnd",
                orderWorksTemplate(work)
            );
        }
    }
    async renderOrderSpares() {
        const element = document.querySelector("#spares");
        for (var i in this.order.Spares) {
            const spare = await new ExternalServices("spares").findOrderById(this.order.Spares[i]);
            element.insertAdjacentHTML(
                "beforeEnd",
                orderSparesTemplate(spare)
            );
        }
    }
    renderButtonInWork()  {
        const element = document.querySelector("#buttons");
        for (var i in this.order.Spares) {
            element.insertAdjacentHTML(
                "afterBegin",
                `<a class="button" href="#">In work</a>`
            );
        }
    }
  }