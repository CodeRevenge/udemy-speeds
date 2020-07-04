const SPEEDS_LIST_SELECTOR = "menu--playback-rate-menu--11hOW";
const PARENT_VIDEO_SELECTOR =
  "div[data-purpose=curriculum-item-viewer-content]";
const SPAN_CLASS_LIST = ["playback-rate--playback-rate--1XOKO"];
const LI_CLASS_LIST = ["menu--menu--2Pw42", "menu--item--2IgLt"];
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
  document.getElementById("playback-rate-menu").textContent = speed;
  document.getElementsByClassName("active")[0].classList.remove("active");
  actual = event.target;
  if (actual.tagName === "SPAN") {
    li = actual.parentNode.parentNode;
  } else if (actual.tagName === "A") {
    li = actual.parentNode;
  }
  li.classList.add("active");
  videoSpeed = speed;
  saveSpeed(speed);
};

const fillNewSpeeds = (list, video) => {
  let newSpeeds = [];
  for (i = 0.5; i <= 3.5; i += 0.25) {
    newSpeeds.push(i);
  }
  list.textContent = "";
  list.style.minWidth = "110px";
  let actualSpeed = video.playbackRate;
  newSpeeds.forEach((newSpeed) => {
    let li = document.createElement("LI");
    let a = document.createElement("A");
    let span = document.createElement("SPAN");

    li.setAttribute("role", "presentation");
    li.classList.add(...LI_CLASS_LIST);
    if (actualSpeed === newSpeed) {
      li.classList.add("active");
    }
    a.setAttribute("role", "menuitem");
    a.setAttribute("tabindex", "-1");
    a.addEventListener("click", (e) => updateSpeed(e, newSpeed));
    a.addEventListener("onClick", (e) => updateSpeed(e, newSpeed));
    a.addEventListener("onKeyDown", (e) => updateSpeed(e, newSpeed));
    span.classList.add(...SPAN_CLASS_LIST);
    span.appendChild(document.createTextNode(newSpeed));
    a.appendChild(span);
    li.appendChild(a);
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
  console.log(`Udemy Speed Working... Speed set to ${speed}`);

  let list;
  do {
    await sleep(1000);
    list = document.getElementsByTagName("ul")[1];
  } while (list != undefined && !list.classList.contains(SPEEDS_LIST_SELECTOR));
  let div = document.querySelector(PARENT_VIDEO_SELECTOR);
  const video = document.querySelector("video");
  video.playbackRate = speed;
  video.onplay = (e) => {
    e.target.playbackRate = speed;
  };
  document.getElementById("playback-rate-menu").textContent = speed;
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

if (videoSpeed) {
  udemySpeeds(videoSpeed);
} else {
  udemySpeeds();
}
