import { filterLocatStorage, getLocatStorageByType, renderListTemplate } from "./utils.mjs";

/* Generate a list of product cards in HTML from an array */
function orderRowTemplate(order) {
    return `<tr>
        <td><a href="../order/index.html?order=${order.Id}">${order.Number}</a></td>
        <td class="left">${order.Equipment.Name}<br>${order.Equipment.Brand} ${order.Equipment.Model}</td>
        <td>${order.CreationDate.slice(0,10)}</td>
        <td>${order.WorkStage}</td>
        <td class="mobile-hide left">${order.Client.Name}</td>
        <td class="mobile-hide">${order.Client.Contact}</td>
        <td class="mobile-hide">${order.FinalPrice} RUB</td>
    </tr>`;
}

export default class OrderListing {
    constructor(type, dataSource, listElement) {
      this.type = type;
      this.dataSource = dataSource;
      this.listElement = listElement;
    }
    async init(){
        const list = getLocatStorageByType("orders", this.type);//await this.dataSource.findOrdersByType(this.type);
        this.renderList(list);
        this.setTitle();
    }
    renderList(list) {
        if (list) {
            if (list.length != 0) {
                renderListTemplate(orderRowTemplate, this.listElement, list);
            } else {
                this.listElement.innerHTML = "<tr><td colspan='7'>No orders</td></tr>";
            }
        } else {
            this.listElement.innerHTML = "<tr><td colspan='7'>No orders</td></tr>";
        }
    }
    async filterList() {
        this.listElement.innerHTML = "";
        const input = document.querySelector("#search-text").value;
        const list = filterLocatStorage("orders", this.type, input)//await this.dataSource.findOrdersByType(this.type, input);
        if (list) {
            renderListTemplate(orderRowTemplate, this.listElement, list);
        } else {
            this.listElement.innerHTML = "<tr><td colspan='7'>No orders</td></tr>";
        }
    }
    resetList() {
        const list = getLocatStorageByType("orders", this.type);
        this.listElement.innerHTML = "";
        document.querySelector("#search-text").value = "";
        this.renderList(list);
    }
    setTitle() {
        const titleElement = document.querySelector("#list-type");
        titleElement.insertAdjacentHTML("afterbegin", `${this.type[0].toUpperCase()+this.type.slice(1)}`);
        if (this.type === "active") {
            document.querySelector("#new").classList.remove("hide");
        }
    }
    cleareLocalStorage() {
        setLocalStorage("clients", null);
        setLocalStorage("orders", null);
    }
}