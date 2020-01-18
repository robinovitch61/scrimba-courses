import view from "../utils/view.js";
import Story from "../components/Story.js";
import baseUrl from "../utils/baseUrl.js";

export default async function Stories(path) {
  const stories = await getStories(path);
  const hasStories = stories.length > 0;

  view.innerHTML = `<div>
    ${hasStories ? stories.map((story, idx) => Story({ ...story, index: idx+1 })).join("") : "No stories!"}
  </div>`;
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