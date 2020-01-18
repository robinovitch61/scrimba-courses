import view from "../utils/view.js";

export default async function Stories(path) {
  const stories = await getStories(path);
  const hasStories = stories.length > 0;

  view.innerHTML = `<div>
    ${hasStories ? stories.map(story => JSON.stringify(story)) : "No stories!"}
  </div>`;
}

async function getStories(path) {
  const apiPath = getApiPath(path);
  const response = await fetch(`https://node-hnapi.herokuapp.com${apiPath}`);
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