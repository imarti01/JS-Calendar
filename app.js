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

const todayDate = new Date();
const [month, day, year] = [
  todayDate.getMonth(),
  todayDate.getDate(),
  todayDate.getFullYear(),
];

let newEvent = {};
let arrOfEvents = [];
let arrOfEventsToPrint = [];

let numberOfDaysMonth;
let divStartPrint;

window.addEventListener("load", getTodayDate);
window.addEventListener("load", getDaysInMonth(month, year));
window.addEventListener("load", printDaysOnCalendar(month, year));
window.addEventListener("load", printEventsOnCalendar(month, year));
btnCreateEvent.addEventListener("click", addNewEvent);

function getTodayDate() {
  todayText.innerText = `${day}/${month + 1}/${year}`;
}

function getDaysInMonth(month, year) {
  numberOfDaysMonth = new Date(year, month, 0).getDate();
}

function printDaysOnCalendar(month, year) {
  const dayOfWeek = new Date(year, month, 1).getDay();
  if (dayOfWeek > 0) {
    divStartPrint = dayOfWeek - 1;
  } else {
    divStartPrint = 6;
  }

  for (let i = 0; i < numberOfDaysMonth; i++) {
    daysOfCalendar[i + divStartPrint].textContent = i + 1;
  }
}

function printEventsOnCalendar(month, year) {
  arrOfEvents = JSON.parse(localStorage.getItem("events"));

  arrOfEventsToPrint = arrOfEvents.filter((el) => {
    return (
      new Date(el.initialDate).getFullYear() === year &&
      new Date(el.initialDate).getMonth() === month
    );
  });

  arrOfEventsToPrint.forEach((el) => {
    const eventToPrint = document.createElement("div");
    eventToPrint.textContent = el.title;
    eventToPrint.style.backgroundColor = el.color;
    const day = new Date(el.initialDate).getDate();
    daysOfCalendar[day + divStartPrint - 1].appendChild(eventToPrint);
  });
}

function printNewEventOnCalendar() {
  if (
    new Date(newEvent.initialDate).getFullYear() === year &&
    new Date(newEvent.initialDate).getMonth() === month
  ) {
    const eventToPrint = document.createElement("div");
    eventToPrint.textContent = newEvent.title;
    eventToPrint.style.backgroundColor = newEvent.color;
    const day = new Date(el.initialDate).getDate();
    daysOfCalendar[day + divStartPrint - 1].appendChild(eventToPrint);
  }
}

function addNewEvent(e) {
  e.preventDefault();
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
