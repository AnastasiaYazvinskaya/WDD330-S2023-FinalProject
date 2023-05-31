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
  async check(order) {
    const url = "https://api.apitemplate.io/v1/create?template_id=00b77b2381df5a80&export_type=json&output_html=0&filename=Check";
    const options = {
      method: "POST",
      headers: {
        "X-API-KEY": "8d1cMTMwNDE6MTAwOTc6enhvQ1g4blFFd0NIcVczbw=",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({order}),
    };
    console.log(options);
    return await fetch(url, options).then(convertToJson);
  }
}