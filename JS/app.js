import 'https://flackr.github.io/scroll-timeline/dist/scroll-timeline.js';

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log(entry)
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    } else {
      entry.target.classList.remove("show")
    }
  });
});

const hiddenElements = document.querySelectorAll(".hidden");
hiddenElements.forEach((el) => observer.observe(el));

const scrollTracker = document.querySelector(".scroll-tracker");

const scrollTrackingTimeline = new ScrollTimeline({
  source: document.scrollingElement,
  orientation: "block",
  scrollOffsets: [CSS.percent(0), CSS.percent(100)],
});

scrollTracker.animate(
  {
    transform: ["scaleX(0)", "scaleX(1)"]
  },
  {
    duration: 1,
    timeline: scrollTrackingTimeline,
  }
);

const countEl = document.getElementById("count")

updateVisitCount();

function updateVisitCount() {
  fetch("https://api.countapi.xyz/update/tylerle.me/count/?amount=1")
  .then(res => res.json())
  .then(res => {
    countEl.innerHTML = res.value;
  });
}

document.getElementById("scroll-button-1").addEventListener("click", function() {
  document.getElementById("aboutme").scrollIntoView({
    behavior: "smooth"
  });
});

document.getElementById("scroll-button-2").addEventListener("click", function() {
  document.getElementById("skills").scrollIntoView({
    behavior: "smooth"
  });
});

document.getElementById("scroll-button-3").addEventListener("click", function() {
  document.getElementById("qualifications").scrollIntoView({
    behavior: "smooth"
  });
});

document.getElementById("scroll-button-4").addEventListener("click", function() {
  document.getElementById("certificates").scrollIntoView({
    behavior: "smooth"
  });
});