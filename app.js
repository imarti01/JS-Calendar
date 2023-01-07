const todayText = document.getElementById("today");
const daysOfCalendar = document.getElementsByClassName("days");
const containerToDisplayEvents = document.getElementsByClassName(
  "container-display-events"
);
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
const checkEndDate = document.getElementById("checkEndDate");
const endDateInfo = document.getElementsByClassName("datetime-finish");
const checkReminder = document.getElementById("checkReminder");
const reminderInfo = document.getElementsByClassName("reminder");
const warningEventExpired = document.querySelector(".warning-event-expired");
const containerEventsExpired = document.getElementById(
  "containerEventsExpired"
);
const btnCloseWarningExpired = document.getElementById("closeWarningExpired");

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
window.addEventListener("load", startRemindEvents);
window.addEventListener("keydown", closeModalWithEscapeKey);
btnCreateEvent.addEventListener("click", addNewEvent);
btnEditEvent.addEventListener("click", saveChangesEditedEvent);
leftArrow.addEventListener("click", moveTowardsLeft);
rightArrow.addEventListener("click", moveTowardsRight);
btnAddNewEvent.addEventListener("click", startCreateNewEvent);
btnDeleteEvent.addEventListener("click", deleteEvent);
btnCancelModalAddEvent.addEventListener("click", closeModal);
btnCloseModal.addEventListener("click", closeModal);
checkEndDate.addEventListener("change", showEndDate, false);
checkReminder.addEventListener("change", showReminder, false);
btnCloseWarningExpired.addEventListener("click", closeWarningExpiredEvent);
for (let i = 0; i < containerToDisplayEvents.length; i++) {
  containerToDisplayEvents[i].addEventListener("mouseover", showButtonAdd);
}

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
    daysOfCalendar[i + divStartPrint].insertAdjacentHTML(
      "afterbegin",
      ` 
          <h4>${i + 1}</h4>
          <div class="container-display-events" dayOfWeek=${i + 1}></div>
          <button btnDayOfWeek=${i + 1} class="btn-disactivated">+</button>
           `
    );
    document
      .querySelector(`[btnDayOfWeek="${i + 1}"]`)
      .addEventListener("click", openModalWithDate);
  }

  if (todayDate.getMonth() === month && todayDate.getFullYear() === year) {
    daysOfCalendar[todayDate.getDate() + divStartPrint - 1].classList.add(
      "todayDay"
    );
  }

  for (let i = 0; i < containerToDisplayEvents.length; i++) {
    containerToDisplayEvents[i].addEventListener("mouseover", showButtonAdd);
    containerToDisplayEvents[i].addEventListener("mouseout", hideButtonAdd);
  }
}

function openModalWithDate(e) {
  let monthTwoDigits = month + 1;
  if (monthTwoDigits < 10) {
    monthTwoDigits = "0" + monthTwoDigits;
    console.log(monthTwoDigits);
  }
  let dayOfWeek = e.target.attributes[0].value;
  if (dayOfWeek < 10) {
    dayOfWeek = "0" + dayOfWeek;
  }
  datetimeStartEvent.value = `${year}-${monthTwoDigits}-${dayOfWeek}T09:00`;
  startCreateNewEvent();
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

function startRemindEvents() {
  if (arrOfEvents) {
    handleRemindEvents();
    setInterval(handleRemindEvents, 10000);
  }
}

function handleRemindEvents() {
  let now = Date.now();

  for (let i = 0; i < arrOfEvents.length; i++) {
    const date = new Date(arrOfEvents[i].initialDate).getTime();
    if (date - now <= 0) {
      const expiredEvent = document.querySelector(
        `[data-event-id="${arrOfEvents[i].id}"]`
      );
      if (expiredEvent !== null) {
        expiredEvent.classList.add("expired-event");
        expiredEvent.removeAttribute("style");
      }
    }
    showWarningExpiredEvent(now, date, i);
  }
}

function showButtonAdd(e) {
  if (e.target.classList[0] === "container-display-events") {
    let btnToAdd = document.querySelector(
      `[btnDayOfWeek='${e.target.attributes[1].value}']`
    );
    btnToAdd.classList.add("btn-activated");
  }
}

function hideButtonAdd(e) {
  if (e.target.classList[0] === "container-display-events") {
    let btnToAdd = document.querySelector(
      `[btnDayOfWeek='${e.target.attributes[1].value}']`
    );
    btnToAdd.classList.remove("btn-activated");
  }
}

function showWarningExpiredEvent(dateNow, dateEvent, idxOfArrOfEvents) {
  if (dateEvent - dateNow > -10000 && dateEvent - dateNow <= 0) {
    containerEventsExpired.insertAdjacentHTML(
      "afterbegin",
      ` <h4>The event
        <span class="title-event-expired">${arrOfEvents[idxOfArrOfEvents].title}</span>
        has just expired.</h4>`
    );
    warningEventExpired.className = "warning-event-expired warning-active";
    containerMainPage.classList.add("background-modal-active");
    setTimeout(() => {
      containerMainPage.addEventListener("click", closeWarningExpiredEvent);
    }, 1);
  }
}

function closeWarningExpiredEvent() {
  containerEventsExpired.textContent = "";
  warningEventExpired.classList.remove("warning-active");
  containerMainPage.classList.remove("background-modal-active");
  containerMainPage.removeEventListener("click", closeWarningExpiredEvent);
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
  console.log(event);
  const eventToPrint = document.createElement("div");
  eventToPrint.setAttribute("data-event-id", event.id);
  eventToPrint.addEventListener("click", openEvent);
  eventToPrint.textContent = event.title;
  eventToPrint.style.backgroundColor = event.color;
  const day = new Date(event.initialDate).getDate();
  containerToDisplayEvents[day - 1].appendChild(eventToPrint);
}

function openModal() {
  modalAddEditEvent.classList.add("modal-active");
  containerMainPage.classList.add("background-modal-active");
  setTimeout(() => {
    containerMainPage.addEventListener("click", closeModal);
  }, 1);
}

function closeModal() {
  modalAddEditEvent.classList.remove("modal-active");
  containerMainPage.classList.remove("background-modal-active");
  modalButtonsAdd.className = "modal-container-btn-add";
  modalButtonsEdit.className = "modal-container-btn-edit";
  containerMainPage.removeEventListener("click", closeModal);
  currentEvent = {};
}

function closeModalWithEscapeKey(e) {
  if (e.code === "Escape") {
    closeModal();
    closeWarningExpiredEvent();
  }
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
  if (titleEvent.value && datetimeStartEvent.value) {
    e.preventDefault();
    currentEvent.id = Date.now();
    changeValuesCurrentEvent();
    arrOfEvents.push(currentEvent);
    localStorage.setItem("events", JSON.stringify(arrOfEvents));
    printNewEventOnCalendar();
    resetModalValues();
    closeModal();
  }
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
  colorEvent.value = "#227C70";
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

function showEndDate() {
  const isChecked = checkEndDate.checked;
  if (isChecked) {
    for (element of endDateInfo) {
      element.classList.add("datetime-finish-active");
    }
  } else {
    for (element of endDateInfo) {
      element.classList.remove("datetime-finish-active");
    }
  }
}

function showReminder() {
  const isChecked = checkReminder.checked;
  if (isChecked) {
    for (element of reminderInfo) {
      element.classList.add("reminder-active");
    }
  } else {
    for (element of reminderInfo) {
      element.classList.remove("reminder-active");
    }
  }
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
  handleRemindEvents();
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
  handleRemindEvents();
}
