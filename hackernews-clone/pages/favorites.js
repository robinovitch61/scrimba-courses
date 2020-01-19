import view from "../utils/view.js";
import Story from "../components/Story.js";
import store from "../store.js";

export default function Favorites() {
  const { favorites } = store.getState();
  const hasFavorites = favorites.length > 0;

  view.innerHTML = `
    ${ hasFavorites ? favorites.map((story, idx) =>
      Story({
        ...story,
        index: idx+1,
        isFavorite: true,
      })
    ).join("") : "No favorites!"}
  `

  // add event listeners on all favorite buttons to remove accordingly
  document.querySelectorAll(".favorite").forEach(favoriteButton => {
    favoriteButton.addEventListener("click", function() {
      const story = JSON.parse(this.dataset.story);
      store.dispatch({ type: "REMOVE_FAVORITE", payload: { favorite: story } });
      Favorites();
    });
  });
}