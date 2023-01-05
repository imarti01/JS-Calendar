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
const btnDeleteEvent = document.getElementById("deleteEvent");
const btnEditEvent = document.getElementById("editEvent");
const leftArrow = document.getElementById("leftArrow");
const rightArrow = document.getElementById("rightArrow");
const btnAddNewEvent = document.getElementById("addNewEvent");
const modalAddEditEvent = document.querySelector(".modal-add-edit-event");
const btnCloseModal = document.getElementById("closeModal");
const containerMainPage = document.querySelector(".container-main-page");
const modalButtonsAdd = document.querySelector(".modal-container-btn-add");
const modalButtonsEdit = document.querySelector(".modal-container-btn-edit");

const todayDate = new Date();
let [month, year] = [todayDate.getMonth(), todayDate.getFullYear()];

let currentEvent = {};
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

window.addEventListener("load", printDaysOnCalendar);
window.addEventListener("load", printEventsOnCalendar);
window.addEventListener("keydown", closeModalWithEscapeKey);
btnCreateEvent.addEventListener("click", addNewEvent);
btnEditEvent.addEventListener("click", saveChangesEditedEvent);
leftArrow.addEventListener("click", moveTowardsLeft);
rightArrow.addEventListener("click", moveTowardsRight);
btnAddNewEvent.addEventListener("click", startCreateNewEvent);
btnDeleteEvent.addEventListener("click", deleteEvent);
btnCancelModalAddEvent.addEventListener("click", closeModal);
btnCloseModal.addEventListener("click", closeModal);

function printDaysOnCalendar() {
  todayText.innerText = `${arrMonths[month]} ${year}`;
  numberOfDaysMonth = new Date(year, month + 1, 0).getDate();

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
      createDivToShowEvent(el);
    });
  } else {
    arrOfEvents = [];
  }
}

function printNewEventOnCalendar() {
  if (
    new Date(currentEvent.initialDate).getFullYear() === year &&
    new Date(currentEvent.initialDate).getMonth() === month
  ) {
    createDivToShowEvent(currentEvent);
  }
}

function createDivToShowEvent(event) {
  const eventToPrint = document.createElement("div");
  eventToPrint.setAttribute("data-event-id", event.id);
  eventToPrint.addEventListener("click", openEvent);
  eventToPrint.textContent = event.title;
  eventToPrint.style.backgroundColor = event.color;
  const day = new Date(event.initialDate).getDate();
  daysOfCalendar[day + divStartPrint - 1].appendChild(eventToPrint);
}

function openModal() {
  modalAddEditEvent.classList.add("modal-active");
  containerMainPage.classList.add("background-modal-active");
}

function closeModal() {
  modalAddEditEvent.classList.remove("modal-active");
  containerMainPage.classList.remove("background-modal-active");
  modalButtonsAdd.className = "modal-container-btn-add";
  modalButtonsEdit.className = "modal-container-btn-edit";
  currentEvent = {};
}

function closeModalWithEscapeKey(e) {
  if (e.code === "Escape") closeModal();
}

function openEvent(e) {
  const eventToOpen = arrOfEvents.filter((el) => {
    return el.id == e.target.dataset.eventId;
  });

  currentEvent = eventToOpen[0];

  titleEvent.value = currentEvent.title;
  datetimeStartEvent.value = currentEvent.initialDate;
  datetimeFinishEvent.value = currentEvent.endDate;
  timeRemindEvent.value = currentEvent.timeRemind;
  colorEvent.value = currentEvent.color;
  descriptionEvent.value = currentEvent.description;
  typeOfEvent.value = currentEvent.type;

  modalButtonsEdit.classList.add("btns-active");
  openModal();
}

function addNewEvent(e) {
  e.preventDefault();
  currentEvent.id = Date.now();
  changeValuesCurrentEvent();
  arrOfEvents.push(currentEvent);
  localStorage.setItem("events", JSON.stringify(arrOfEvents));
  printNewEventOnCalendar();
  resetModalValues();
  closeModal();
}

function saveChangesEditedEvent(e) {
  e.preventDefault();

  changeValuesCurrentEvent();

  for (let i = 0; i < arrOfEvents.length; i++) {
    if (arrOfEvents[i].id === currentEvent.id) {
      arrOfEvents[i] = currentEvent;
    }
  }

  localStorage.setItem("events", JSON.stringify(arrOfEvents));

  const printedEventToChange = document.querySelector(
    `[data-event-id="${currentEvent.id}"]`
  );

  printedEventToChange.remove();

  createDivToShowEvent(currentEvent);
  resetModalValues();
  closeModal();
}

function startCreateNewEvent() {
  modalButtonsAdd.classList.add("btns-active");
  openModal();
}

function changeValuesCurrentEvent() {
  currentEvent.title = titleEvent.value;
  currentEvent.initialDate = datetimeStartEvent.value;
  currentEvent.endDate = datetimeFinishEvent.value;
  currentEvent.timeRemind = timeRemindEvent.value;
  currentEvent.color = colorEvent.value;
  currentEvent.description = descriptionEvent.value;
  currentEvent.type = typeOfEvent.value;
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

function deleteEvent(e) {
  e.preventDefault();

  arrOfEvents = arrOfEvents.filter((event) => event.id !== currentEvent.id);
  localStorage.setItem("events", JSON.stringify(arrOfEvents));

  const printedEventToDelete = document.querySelector(
    `[data-event-id="${currentEvent.id}"]`
  );

  printedEventToDelete.remove();
  resetModalValues();
  closeModal();
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
  printDaysOnCalendar();
  printEventsOnCalendar();
}
