const todayText = document.getElementById("today");
const daysOfCalendar = document.getElementsByClassName("days");
const titleEvent = document.querySelector('[name = "title"]');
const datetimeStartEvent = document.querySelector('[name="datetime-start"]');
const datetimeFinishEvent = document.querySelector('[name="datetime-finish"]');
const timeRemindEvent = document.querySelector('[name="time-remind"]');
const colorEvent = document.querySelector('[name="color"]');
const descriptionEvent = document.querySelector('[name="description"]');
const typeOfEvent = document.querySelector('[name="type"]');
const btnCancelModalAddEvent = document.getElementById("cancelModalAddEvent");
const btnCreateEvent = document.getElementById("createEvent");
const leftArrow = document.getElementById("leftArrow");
const rightArrow = document.getElementById("rightArrow");

const todayDate = new Date();
let [month, day, year] = [
  todayDate.getMonth(),
  todayDate.getDate(),
  todayDate.getFullYear(),
];

let newEvent = {};
let arrOfEvents = [];

let numberOfDaysMonth;
let divStartPrint;

const arrMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

window.addEventListener("load", getActualMonth);
window.addEventListener("load", getDaysInMonth());
window.addEventListener("load", printDaysOnCalendar());
window.addEventListener("load", printEventsOnCalendar());
btnCreateEvent.addEventListener("click", addNewEvent);
leftArrow.addEventListener("click", moveTowardsLeft);
rightArrow.addEventListener("click", moveTowardsRight);

function getActualMonth() {
  todayText.innerText = `${arrMonths[month]} ${year}`;
}

function getDaysInMonth() {
  numberOfDaysMonth = new Date(year, month + 1, 0).getDate();
}

function printDaysOnCalendar() {
  const dayOfWeek = new Date(year, month, 1).getDay();
  if (dayOfWeek > 0) {
    divStartPrint = dayOfWeek - 1;
  } else {
    divStartPrint = 6;
  }

  for (let i = 0; i < numberOfDaysMonth; i++) {
    daysOfCalendar[i + divStartPrint].textContent = i + 1;
  }

  if (todayDate.getMonth() === month && todayDate.getFullYear() === year) {
    daysOfCalendar[todayDate.getDate() + divStartPrint - 1].classList.add(
      "todayDay"
    );
  }
}

function printEventsOnCalendar() {
  arrOfEvents = JSON.parse(localStorage.getItem("events"));

  if (arrOfEvents) {
    let arrOfEventsToPrint = arrOfEvents.filter((el) => {
      return (
        new Date(el.initialDate).getFullYear() === year &&
        new Date(el.initialDate).getMonth() === month
      );
    });

    arrOfEventsToPrint.forEach((el) => {
      const eventToPrint = document.createElement("div");
      eventToPrint.setAttribute("data-event-id", el.id);
      eventToPrint.addEventListener("click", openEvent);
      eventToPrint.textContent = el.title;
      eventToPrint.style.backgroundColor = el.color;
      const day = new Date(el.initialDate).getDate();
      daysOfCalendar[day + divStartPrint - 1].appendChild(eventToPrint);
    });
  } else {
    arrOfEvents = [];
  }
}

function printNewEventOnCalendar() {
  if (
    new Date(newEvent.initialDate).getFullYear() === year &&
    new Date(newEvent.initialDate).getMonth() === month
  ) {
    const eventToPrint = document.createElement("div");
    eventToPrint.setAttribute("data-event-id", newEvent.id);
    eventToPrint.addEventListener("click", openEvent);
    eventToPrint.textContent = newEvent.title;
    eventToPrint.style.backgroundColor = newEvent.color;
    const day = new Date(newEvent.initialDate).getDate();
    daysOfCalendar[day + divStartPrint - 1].appendChild(eventToPrint);
  }
}

function openEvent(e) {
  console.log(arrOfEvents);

  const eventToOpen = arrOfEvents.filter((el) => {
    return el.id == e.target.dataset.eventId;
  });

  console.log(eventToOpen);
}

function addNewEvent(e) {
  e.preventDefault();
  newEvent.id = Date.now();
  newEvent.title = titleEvent.value;
  newEvent.initialDate = datetimeStartEvent.value;
  newEvent.endDate = datetimeFinishEvent.value;
  newEvent.timeRemind = timeRemindEvent.value;
  newEvent.color = colorEvent.value;
  newEvent.description = descriptionEvent.value;
  newEvent.type = typeOfEvent.value;
  arrOfEvents.push(newEvent);
  localStorage.setItem("events", JSON.stringify(arrOfEvents));
  printNewEventOnCalendar();
  resetModalValues();
  newEvent = {};
}

function resetModalValues() {
  titleEvent.value = "";
  datetimeStartEvent.value = "";
  datetimeFinishEvent.value = "";
  timeRemindEvent.value = "";
  colorEvent.value = "";
  descriptionEvent.value = "";
  typeOfEvent.value = "";
}

function deletePrintedDays() {
  for (day of daysOfCalendar) {
    day.textContent = "";
  }
}

function moveTowardsLeft() {
  for (day of daysOfCalendar) {
    if (day.className !== "days") {
      day.classList.remove("todayDay");
    }
  }

  if (month === 0) {
    year -= 1;
    month = 11;
  } else {
    month -= 1;
  }
  deletePrintedDays();
  getActualMonth();
  getDaysInMonth();
  printDaysOnCalendar();
  printEventsOnCalendar();
}

function moveTowardsRight() {
  for (day of daysOfCalendar) {
    if (day.className !== "days") {
      day.classList.remove("todayDay");
    }
  }

  if (month === 11) {
    year += 1;
    month = 0;
  } else {
    month += 1;
  }
  deletePrintedDays();
  getActualMonth();
  getDaysInMonth();
  printDaysOnCalendar();
  printEventsOnCalendar();
}
