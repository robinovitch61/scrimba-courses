import Stories from "./pages/stories.js";
import Item from "./pages/item.js";

const root = null;
const useHash = true;
const hash = '#!';
const router = new Navigo(root, useHash, hash);

export default class RouterHandler {
  constructor() {
    this.createRoutes();
  }

  createRoutes() {
    const routes = [
      { path: "/", page: Stories },
      { path: "/new", page: Stories },
      { path: "/ask", page: Stories },
      { path: "/show", page: Stories },
      { path: '/item', page: Item },
    ];

    routes.forEach(({ path, page }) => {
      router.on(path, () => {
        page(path);
      }).resolve();
    })
  }
}