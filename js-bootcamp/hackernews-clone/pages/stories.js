import view from "../utils/view.js";
import Story from "../components/Story.js";
import baseUrl from "../utils/baseUrl.js";
import checkFavorite from "../utils/checkFavorite.js";
import store from "../store.js";

export default async function Stories(path) {
  const { favorites } = store.getState();
  const stories = await getStories(path);
  const hasStories = stories.length > 0;

  view.innerHTML = `<div>
    ${hasStories ? getFormattedStories(stories, favorites) : "No stories!"}
  </div>`;

  // add event listeners on all favorite buttons to add/remove accordingly
  document.querySelectorAll(".favorite").forEach(favoriteButton => {
    favoriteButton.addEventListener("click", async function() {
      const story = JSON.parse(this.dataset.story);
      const isFavorited = checkFavorite(favorites, story);
      store.dispatch({ type: isFavorited ? "REMOVE_FAVORITE" : "ADD_FAVORITE", payload: { favorite: story } });
      await Stories(path);
    });
  });
}

async function getStories(path) {
  const apiPath = getApiPath(path);
  const response = await fetch(`${baseUrl}${apiPath}`);
  const stories = await response.json();
  return stories;
}

function getApiPath(path) {
  switch(path) {
    case "/": return "/news";
    case "/new": return "/newest";
    default: return path;
  }
}

function getFormattedStories(stories, favorites) {
  return stories.map((story, idx) =>
    Story({
      ...story,
      index: idx+1,
      isFavorite: checkFavorite(favorites, story),
    })
  ).join("");
}