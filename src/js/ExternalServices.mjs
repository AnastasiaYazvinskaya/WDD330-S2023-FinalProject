function convertToJson(res) {
    if (res.ok) {
        return res.json();
    } else {
        throw new Error("Bad Response");
    }
}

export default class ExternalServices {
  constructor(category) {
    this.category = category;
    this.path = `../json/${this.category}.json`;
  }
  getData() {
    return fetch(this.path)
        .then(convertToJson)
        .then((data) => data);
  }
  async findOrdersByType(type) {
    const orders = await this.getData();
    return orders.filter((item) => item.Type === type);
  }
  async findOrderById(id) {
    const orders = await this.getData();
    return orders.find((item) => item.Id === id);
  }
  async findOrderByName(name) {
    const orders = await this.getData();
    return orders.find((item) => item.Name === name);
  }  
  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    return await fetch(baseURL + "checkout/", options).then(convertToJson);
  }
}