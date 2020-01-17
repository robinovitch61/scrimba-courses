import Stories from "./pages/stories.js";

const root = null;
const useHash = true;
const hash = '#';
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
    ];

    routes.forEach(({ path, page }) => {
      router.on(path, () => {
        page(path);
      }).resolve();
    })
  }
}