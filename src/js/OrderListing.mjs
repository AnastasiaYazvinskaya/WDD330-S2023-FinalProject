import { renderListTemplate } from "./utils.mjs";

/* Generate a list of product cards in HTML from an array */
function orderRowTemplate(order) {
    return `<tr>
        <td><a href="../order/index.html?order=${order.Id}">${order.Number}</a></td>
        <td class="left">${order.Equipment.Name}<br>${order.Equipment.Brand} ${order.Equipment.Model}</td>
        <td>${order.CreationDate}</td>
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
        const list = await this.dataSource.findOrdersByType(this.type);
        //this.filterList(list);
        this.renderList(list);
        this.setTitle();
    }
    renderList(list) {
        if (list) {
            renderListTemplate(orderRowTemplate, this.listElement, list);
        }
    }
    async filterList(input) {
        this.listElement.innerHTML = "";
        const list = await this.dataSource.getData(this.type, input);
        renderListTemplate(orderRowTemplate, this.listElement, list);
    }
    setTitle() {
        const titleElement = document.querySelector("#list-type");
        titleElement.insertAdjacentHTML("afterbegin", `${this.type[0].toUpperCase()+this.type.slice(1)}`);
    }
}