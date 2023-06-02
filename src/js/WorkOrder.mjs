import { getLocatStorageById, findClientByNameAndContact, getLocalStorage, setLocalStorage, alertMessage, removeAllAlerts } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";


function formDataToJSON(formElement) {
    const formData = new FormData(formElement),
      convertedJSON = {};
  
    formData.forEach(function (value, key) {
      convertedJSON[key] = value;
    });
  
    return convertedJSON;
  }

export default class WorkOrder {
  constructor(orderId) {
    this.orderId = orderId;
    this.orderTotal = 0;
    this.order = null;
  }
  init() {
    var number = this.orderId;
    if (!number) {
        number = getLocalStorage("orders");
        if (number) {
            number = number.length;
        } else {
            number = 0;
        }
    }
    document.querySelector("#orderId").innerHTML = parseInt(number)+1;
    if (!this.orderId) {
        this.fillDatalist();
        this.fillService();
        this.fillSpare();
        document.querySelector(".w1").addEventListener("change", this.setPrice.bind(this));
        document.querySelector(".s1").addEventListener("change", this.setPrice.bind(this));
    } else {
        this.fillClosedata();
    }
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
    const clients = getLocalStorage("clients");
    for (var i in clients) {
        document.querySelector("#clients").insertAdjacentHTML(
            "beforeEnd",
            `<option value="${clients[i].Name}">${clients[i].Contact}</option>`
        );
    }
  }
  async fillService(service=null) {
    const services = await new ExternalServices("services").getData();
    const worksIds = document.querySelectorAll(".in-work");
    for (var i in services) {
        if (service != null && service === services[i].Name) {
            worksIds[worksIds.length-1].insertAdjacentHTML(
                "beforeEnd",
                `<option value="${services[i].Id}" selected>${services[i].Name}</option>`
            );
        } else {
            worksIds[worksIds.length-1].insertAdjacentHTML(
                "beforeEnd",
                `<option value="${services[i].Id}">${services[i].Name}</option>`
            );
        }
    }
  }
  async fillSpare(spare=null) {
    const spares = await new ExternalServices("spares").getData();
    const sparesIds = document.querySelectorAll(".in-spare");
    for (var i in spares) {
        if (spare != null && spare === spares[i].Name) {
            sparesIds[sparesIds.length-1].insertAdjacentHTML(
                "beforeEnd",
                `<option value="${spares[i].Id}" selected>${spares[i].Name}</option>`
            );
        } else {
            sparesIds[sparesIds.length-1].insertAdjacentHTML(
                "beforeEnd",
                `<option value="${spares[i].Id}">${spares[i].Name}</option>`
            );
        }
    }
  }
  async fillClosedata() {
    this.order = getLocatStorageById("orders", this.orderId)[0];

    document.querySelector("#equipment").insertAdjacentHTML("beforeEnd", ` ${this.order.Equipment.Name} ${this.order.Equipment.Brand} ${this.order.Equipment.Model}`);
    document.querySelector("#client").insertAdjacentHTML("beforeEnd", ` ${this.order.Client.Name} (${this.order.Client.Contact})`);
    document.querySelector("#defects").innerHTML = this.order.Defects;
    document.querySelector("#complaints").innerHTML = this.order.Complaints;
    //Works
    const works = document.querySelector("#work");
    if (this.order.Works.length != 0 && this.order.Works[0] != "") {
        for (var i=0; i < this.order.Works.length; i++) {
            const service = await new ExternalServices("services").findOrderById(this.order.Works[i]);
            this.orderTotal += service.Price;
            works.insertAdjacentHTML("beforeEnd", `<tr>
                <td>
                    <select class="in-work w${parseInt(i)+1}" name="works">
                        <option></option>
                    </select>
                </td>
                <td class="work-price">${service.Price} RUB</td>
            </tr>`)
            this.fillService(service.Name);
            this.calculateOrdertotal();
            document.querySelector(".w"+(parseInt(i)+1)).addEventListener("change", this.setPrice.bind(this));
            //document.querySelector("#w"+(i+1)).addEventListener("change", this.setServicePrice.bind(this));
        }
    } else {
        works.insertAdjacentHTML("beforeEnd", `<tr>
            <td>
                <select class="in-work w1" name="works">
                    <option></option>
                </select>
            </td>
            <td class="work-price"></td>
        </tr>`)
        this.fillService();
        document.querySelector(".w1").addEventListener("change", this.setPrice.bind(this));
    }
    const spares = document.querySelector("#spares");
    if (this.order.Spares.length != 0  && this.order.Spares[0] != "") {
        for (var i in this.order.Spares) {
            const spare = await new ExternalServices("spares").findOrderById(this.order.Spares[i]);
            this.orderTotal += spare.Price;
            spares.insertAdjacentHTML("beforeEnd", `<tr>
                <td>
                    <select class="in-spare s${parseInt(i)+1}" name="spare" value="${spare.Id}">
                        <option></option>
                    </select>
                </td>
                <td class="spare-price">${spare.Price} RUB</td>
            </tr>`)
            this.fillSpare(spare.Name);
            this.calculateOrdertotal();
            document.querySelector(".s"+(parseInt(i)+1)).addEventListener("change", this.setPrice.bind(this));
        }
    } else {
        spares.insertAdjacentHTML("beforeEnd", `<tr>
            <td>
                <select class="in-spare s1" name="spare">
                    <option></option>
                </select>
            </td>
            <td class="spare-price"></td>
        </tr>`)
        this.fillSpare();
        document.querySelector(".s1").addEventListener("change", this.setPrice.bind(this));
    }
  }
  async setContact() {
    const name = document.querySelector("#fullname").value;
    const contact = document.querySelector("option[value='"+name+"']");
    if (contact) {
        document.querySelector("#contact").value = contact.textContent;
    }
  }
  async saveClient(name, contact) {
    var clients = getLocalStorage("clients");
    if (!clients) {
        clients = [];
    }
    clients.push({
        "Id": String(clients.length+1),
        "Name": name,
        "Contact": contact
    });  
    setLocalStorage("clients", clients);
  }
  setPrice() {
    this.orderTotal = 0;
    this.setServicePrice();
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
            prices[i].innerHTML = "";
        }
    }
    this.setSparePrice();
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
            prices[i].innerHTML = "";
        }
    }
    this.calculateOrdertotal();
  }
  calculateOrdertotal() {
    document.querySelector("#total").innerHTML = this.orderTotal;
  }
  addService() {
    const num = document.querySelectorAll(".in-work").length;
    if (num == 4) {
        document.querySelector(".add-service").classList.add("hide");
    }
    document.querySelector("#work").insertAdjacentHTML(
        "beforeEnd",
        `<tr>
            <td>
                <select class="in-work w${parseInt(num)+1}" name="works">
                    <option></option>
                </select>
            </td>
            <td class="work-price"></td>
        </tr>`
    );
    
    this.fillService();
    document.querySelector(".w"+(parseInt(num)+1)).addEventListener("change", this.setPrice.bind(this));
  }
  addSpare() {
    const num = document.querySelectorAll(".in-spare").length;
    if (num == 4) {
        document.querySelector(".add-spare").classList.add("hide");
    }
    document.querySelector("#spares").insertAdjacentHTML(
        "beforeEnd",
        `<tr>
            <td>
                <select class="in-spare s${parseInt(num)+1}" name="spares">
                    <option></option>
                </select>
            </td>
            <td class="spare-price"></td>
        </tr>`
    );
    
    this.fillSpare();
    document.querySelector(".s"+(parseInt(num)+1)).addEventListener("change", this.setPrice.bind(this));
  }
  async create() {
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
        "FinalPrice": this.orderTotal,
        "Check": ""
    };
    const works = document.querySelectorAll(".in-work");
    for (var i=0; i < works.length; i++) {
        if (works[i].value) {
            order.Works.push(works[i].value);
        }
    }
    const spares = document.querySelectorAll(".in-spare");
    for (var i=0; i < spares.length; i++) {
        if (spares[i].value) {
            order.Spares.push(spares[i].value);
        }
    }

    if (!content || content.isTrusted) {
        content = [];
    }
    content.push(order);

    setLocalStorage("orders", content);

    const client = findClientByNameAndContact("clients", order.Client.Name, order.Client.Contact);
    if (client.length === 0) {
        this.saveClient(order.Client.Name, order.Client.Contact);
    }

    location.assign("../order-listing/index.html?type=active")
  }
  async close() {
    let content = getLocalStorage("orders");
    
    this.order.WorkStage = "closed";
    this.order.Type = "closed";
    this.order.FinalPrice = this.orderTotal;
    const preVal = {
        "Works": this.order.Works,
        "Spares": this.order.Spares
    };
    this.order.Works = [];
    this.order.Spares = [];
    const works = document.querySelectorAll(".in-work");
    for (var i=0; i < works.length; i++) {
        if (works[i].value) {
            const work = await new ExternalServices("services").findOrderById(works[i].value);
            this.order.Works.push({
                "Name": work.Name,
                "Price": work.Price
            });
        }
    }
    const spares = document.querySelectorAll(".in-spare");
    for (var i=0; i < spares.length; i++) {
        if (spares[i].value) {
            const spare = await new ExternalServices("spares").findOrderById(spares[i].value);
            this.order.Spares.push({
                "Name": spare.Name,
                "Price": spare.Price
            });
        }
    }
    try {
        removeAllAlerts();
        alertMessage("Data saved! A check is being generated...");
        const res = await new ExternalServices().check(this.order);
        console.log(res);
        this.order.Check = res.download_url;
    } catch (err) {
        console.log(err);
    }
    
    this.order.Works = preVal.Works;
    this.order.Spares = preVal.Works;

    content[this.orderId] = this.order;

    setLocalStorage("orders", content);

    location.assign("../order-listing/index.html?type=active")
  }
  save() {
    let content = getLocalStorage("orders");
    
    this.order.Works = [];
    this.order.Spares = [];
    this.order.WorkStage = "in work";
    this.order.FinalPrice = this.orderTotal;
    
    const works = document.querySelectorAll(".in-work");
    for (var i=0; i < works.length; i++) {
        if (works[i].value) {
            this.order.Works.push(works[i].value);
        }
    }
    const spares = document.querySelectorAll(".in-spare");
    for (var i=0; i < spares.length; i++) {
        if (spares[i].value) {
            this.order.Spares.push(spares[i].value);
        }
    }

    content[this.orderId] = this.order;

    setLocalStorage("orders", content);

    removeAllAlerts();
    alertMessage("Order data saved!");
    
    //location.assign("../order-listing/index.html?type=active")
  }
  async check() {
    this.order.WorkStage = "in work";
    this.order.FinalPrice = this.orderTotal;
    const preVal = {
        "Works": this.order.Works,
        "Spares": this.order.Spares
    };
    this.order.Works = [];
    this.order.Spares = [];
    const works = document.querySelectorAll(".in-work");
    for (var i=0; i < works.length; i++) {
        if (works[i].value) {
            const work = await new ExternalServices("services").findOrderById(works[i].value);
            this.order.Works.push({
                "Name": work.Name,
                "Price": work.Price
            });
        }
    }
    const spares = document.querySelectorAll(".in-spare");
    for (var i=0; i < spares.length; i++) {
        if (spares[i].value) {
            const spare = await new ExternalServices("spares").findOrderById(spares[i].value);
            this.order.Spares.push({
                "Name": spare.Name,
                "Price": spare.Price
            });
        }
    }
    try {
        removeAllAlerts();
        alertMessage(`A check is being generated`);
        const res = await new ExternalServices().check(this.order);
      console.log(res);
      removeAllAlerts();
      alertMessage(`Order check created! You can see it <a href="${res.download_url}">HERE</a>`);
      window.open(res.download_url);
    } catch (err) {
      console.log(err);
    }

    this.order.Works = preVal.Works;
    this.order.Spares = preVal.Works;
  }
}