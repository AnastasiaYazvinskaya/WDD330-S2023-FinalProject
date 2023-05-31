import { getLocalStorage, setLocalStorage, alertMessage, removeAllAlerts } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

function formDataToJSON(formElement) {
    const formData = new FormData(formElement),
      convertedJSON = {};
  
    formData.forEach(function (value, key) {
      convertedJSON[key] = value;
    });
  
    return convertedJSON;
  }
  
  function packageItems(items) {
    const simplifiedItems = items.map((item) => {
      console.log(item);
      return {
        id: item.Id,
        price: item.FinalPrice,
        name: item.Name,
        quantity: 1,
      };
    });
    return simplifiedItems;
  }

export default class WorkOrder {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.orderTotal = 0;
  }
  init() {
    var number = getLocalStorage("orders");
    if (number) {
        number = number.length;
    } else {
        number = 0;
    }
    document.querySelector("#orderId").innerHTML = number+1;

    this.fillDatalist();
    this.fillService();
    this.fillSpare();
  }
  async fillDatalist() {
    const base = await new ExternalServices("basedata").getData();
    const types = base[0].EquipmentTypes;
    for (var i in types) {
        document.querySelector("#types").insertAdjacentHTML(
            "beforeEnd",
            `<option value="${types[i]}">${types[i]}</option>`
        );
    }
    const brands = base[0].Brands;
    for (var i in brands) {
        document.querySelector("#brands").insertAdjacentHTML(
            "beforeEnd",
            `<option value="${brands[i]}">${brands[i]}</option>`
        );
    }
    /*const models = base[0].Models;
    for (var i in models) {
        document.querySelector("#models").insertAdjacentHTML(
            "beforeEnd",
            `<option value="${models[i].Id}">${models[i].Name}</option>`
        );
    }*/
    const clients = await new ExternalServices("clients").getData();
    for (var i in clients) {
        document.querySelector("#clients").insertAdjacentHTML(
            "beforeEnd",
            `<option>${clients[i].Name}</option>`
        );
    }
  }
  async fillService() {
    const services = await new ExternalServices("services").getData();
    const worksIds = document.querySelectorAll(".in-work");
    for (var i in services) {
        worksIds[worksIds.length-1].insertAdjacentHTML(
            "beforeEnd",
            `<option value="${services[i].Id}">${services[i].Name}</option>`
        );
    }
  }
  async fillSpare() {
    const spares = await new ExternalServices("spares").getData();
    const sparesIds = document.querySelectorAll(".in-spare");
    for (var i in spares) {
        sparesIds[sparesIds.length-1].insertAdjacentHTML(
            "beforeEnd",
            `<option value="${spares[i].Id}">${spares[i].Name}</option>`
        );
    }
  }
  async setContact() {
    const name = document.querySelector("#fullname").value;
    const client = await new ExternalServices("clients").findOrderByName(name);
    if (client) {
        document.querySelector("#contact").value = client.Contact;
    }
  }
  async setServicePrice() {
    const ids = document.querySelectorAll(".in-work");
    const prices = document.querySelectorAll(".work-price");
    for (var i=0; i < ids.length; i++) {
        if (ids[i].value) {
            const service = await new ExternalServices("services").findOrderById(ids[i].value);
            this.orderTotal += service.Price;
            prices[i].innerHTML = service.Price + " RUB";
        } else {
            if (prices[i].innerHTML) {
                console.log(prices[i].innerHTML);
                this.orderTotal -= parseFloat(prices[i].innerHTML);
                prices[i].innerHTML = "";
            }
        }
    }
    this.calculateOrdertotal();
  }
  async setSparePrice() {
    const ids = document.querySelectorAll(".in-spare");
    const prices = document.querySelectorAll(".spare-price");
    for (var i=0; i < ids.length; i++) {
        if (ids[i].value) {
            const spare = await new ExternalServices("spares").findOrderById(ids[i].value);
            this.orderTotal += spare.Price;
            prices[i].innerHTML = spare.Price + " RUB";
        } else {
            if (prices[i].innerHTML) {
                console.log(prices[i].innerHTML);
                this.orderTotal -= parseFloat(prices[i].innerHTML);
                prices[i].innerHTML = "";
            }
        }
    }
    this.calculateOrdertotal();
  }
  calculateOrdertotal() {
    document.querySelector("#total").innerHTML = this.orderTotal;
  }
  addService() {
    if (document.querySelectorAll(".in-work").length == 4) {
        document.querySelector(".add-service").classList.add("hide");
    }
    document.querySelector("#work").insertAdjacentHTML(
        "beforeEnd",
        `<tr>
            <td>
                <select id="in-work" class="in-work" name="works">
                    <option></option>
                </select>
            </td>
            <td class="work-price"></td>
        </tr>`
    );
    this.fillService();
  }
  addSpare() {
    if (document.querySelectorAll(".in-spare").length == 4) {
        document.querySelector(".add-spare").classList.add("hide");
    }
    document.querySelector("#spares").insertAdjacentHTML(
        "beforeEnd",
        `<tr>
            <td>
                <select id="in-spare" class="in-spare" name="spares">
                    <option></option>
                </select>
            </td>
            <td class="spare-price"></td>
        </tr>`
    );
    
    this.fillSpare();
  }
  async save() {
    const formElement = document.forms["order"];
    const json = formDataToJSON(formElement);
    let content = getLocalStorage("orders");
    var number = 0;
    // add order details
    if (content) {
        number = content.length;
    }
    var order = {
        "Id": String(number),
        "Number": String(number+1),
        "Equipment": {
            "Name": json.type,
            "Brand": json.brand,
            "Model": json.model
        },
        "Client": {
            "Name": json.fullname,
            "Contact": json.contact
        },
        "Works": [],
        "Spares": [],
        "CreationDate": new Date(),
        "Type": "active",
        "WorkStage": "new",
        "Defects": json.defects,
        "Complaints": json.complaints,
        "FinalPrice": this.orderTotal
    };
    const works = document.querySelectorAll(".in-work");
    for (var i=0; i < works.length; i++) {
        if (works[i].value) {
            order.Works.push(works[i].value);
        }
    }
    const spares = document.querySelectorAll(".in-spare");
    for (var i=0; i < spares.length; i++) {
        if (works[i].value) {
            order.Spares.push(spares[i].value);
        }
    }

    if (!content || content.isTrusted) {
        content = [];
    }
    content.push(order);

    setLocalStorage("orders", content);
    location.assign("../order-listing/index.html?type=active")
  }
}