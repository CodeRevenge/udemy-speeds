const SPEEDS_LIST_SELECTOR = "playback-rate--menu--1Nk3X";
const PARENT_VIDEO_SELECTOR =
  "div[data-purpose=curriculum-item-viewer-content]";
const OPEN_MENU_BUTTON_SELECTOR = "span.playback-rate--trigger-text--3DafK";
const LI_CLASS_LIST = ["menu--menu--2Pw42", "menu--item--2IgLt"];
const BUTTON_CLASS_LIST = [
  "udlite-btn",
  "udlite-btn-large",
  "udlite-btn-ghost",
  "udlite-text-sm",
  "udlite-block-list-item",
  "udlite-block-list-item-small",
  "udlite-block-list-item-neutral"];
const SPAN_CLASS_LIST = ["udlite-text-bold"];
const VIDEO_SPEED = "videoSpeed";

let videoSpeed = parseFloat(localStorage.getItem(VIDEO_SPEED));

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const saveSpeed = (speed) => localStorage.setItem(VIDEO_SPEED, speed);

const updateSpeed = (event, speed) => {
  video = document.getElementsByTagName("video")[0];
  video.playbackRate = speed;
  video.onplay = (e) => {
    e.target.playbackRate = speed;
  };
  document.querySelector(OPEN_MENU_BUTTON_SELECTOR).textContent = speed + "x";
  document.querySelector("[aria-checked=true]").setAttribute("aria-checked", "false");
  actual = event.target;
  if (actual.tagName === "SPAN") {
    button = actual.parentNode.parentNode;
  } else if (actual.tagName === "DIV") {
    button = actual.parentNode;
  } else {
    button = actual;
  }
  button.setAttribute("aria-checked", "true");
  videoSpeed = speed;
  saveSpeed(speed);
};

const fillNewSpeeds = (list, video) => {
  let newSpeeds = [1.1, 1.2,1.3,1.4];
  for (i = 0.5; i <= 3.5; i += 0.25) {
    newSpeeds.push(i);
  }
  newSpeeds.sort((a, b) => a - b);
  list.textContent = "";
  list.style.minWidth = "110px";
  let actualSpeed = video.playbackRate;
  newSpeeds.forEach((newSpeed) => {
    let li = document.createElement("LI");
    let button = document.createElement("BUTTON");
    let div = document.createElement("DIV");
    let span = document.createElement("SPAN");

    li.setAttribute("role", "none");

    if (actualSpeed === newSpeed) {
      button.setAttribute("aria-checked", "true");
    }
    button.classList.add(...BUTTON_CLASS_LIST);
    button.setAttribute("role", "menuitemradio");
    button.setAttribute("tabindex", "-1");
    button.addEventListener("click", (e) => updateSpeed(e, newSpeed));
    button.addEventListener("onClick", (e) => updateSpeed(e, newSpeed));
    button.addEventListener("onKeyDown", (e) => updateSpeed(e, newSpeed));
    button.addEventListener("onTouchStart", (e) => updateSpeed(e, newSpeed));
    div.classList.add("udlite-block-list-item-content");
    span.classList.add(...SPAN_CLASS_LIST);
    span.appendChild(document.createTextNode(newSpeed + "x"));
    div.appendChild(span);
    button.appendChild(div);
    li.appendChild(button);
    list.appendChild(li);
  });
};

const videoChanged = (e, speed) => {
  let childList = e.filter(
    (i) =>
      i.type === "childList" &&
      i.addedNodes.length > 0 &&
      i.addedNodes[0].tagName === "VIDEO"
  );
  if (childList.length > 0) {
    udemySpeeds(speed);
  }
};

const udemySpeeds = async (speed = 1) => {
  let list;
  do {
    await sleep(1000);
    list = document.querySelector("ul." + SPEEDS_LIST_SELECTOR);
  } while (!list);
  list.parentElement.style.overflowX = "hidden";
  list.parentElement.style.width = "12rem";
  let video;
  do {
    await sleep(1000);
    video = document.querySelector("video");
  } while (!video);
  let div = document.querySelector(PARENT_VIDEO_SELECTOR);
  video.playbackRate = speed;
  video.onplay = (e) => {
    e.target.playbackRate = speed;
  };
  document.querySelector(OPEN_MENU_BUTTON_SELECTOR).textContent = speed + "x";
  videoSpeed = speed;
  let observer = new MutationObserver((e) => videoChanged(e, videoSpeed));
  observer.observe(div, {
    childList: true,
    attributes: true,
    characterData: true,
    subtree: true,
  });
  if (list.getElementsByTagName("li").length <= 7) fillNewSpeeds(list, video);
};



udemySpeeds(!isNaN(videoSpeed) ? videoSpeed : 1);
