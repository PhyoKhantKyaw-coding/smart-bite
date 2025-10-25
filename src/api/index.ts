import * as products from "./products";
import * as todos from "./todos";
import * as food from "./food";
import * as store from "./store";

class API {
	products: typeof products;
	todos: typeof todos;
	food: typeof food;
	store: typeof store;

	constructor() {
		this.products = products;
		this.todos = todos;
		this.food = food;
		this.store = store;
	}
}

const api = new API();

export default api;
