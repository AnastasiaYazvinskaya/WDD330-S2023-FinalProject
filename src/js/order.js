import { loadHeaderFooter, getParams } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import OrderDetails from "./OrderDetails.mjs";

loadHeaderFooter();

const dataSource = new ExternalServices("orders");
const orderId = getParams("order");

const order = new OrderDetails(orderId, dataSource);
order.init();

