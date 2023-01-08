const todayText = document.getElementById("today");
const daysOfCalendar = document.getElementsByClassName("days");
const containerToDisplayEvents = document.getElementsByClassName(
  "container-display-events"
);
const containerCalendar = document.querySelector(".calendar");
const titleEvent = document.querySelector('[name = "title"]');
const datetimeStartEvent = document.querySelector('[name="datetime-start"]');
const datetimeFinishEvent = document.querySelector('[name="datetime-finish"]');
const timeRemindEvent = document.querySelector('[name="time-remind"]');
const colorEvent = document.querySelectorAll('[name="color"]');
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
const containerRemindBeforeExpire = document.getElementById(
  "containerRemindBeforeExpire"
);
const warningTimeBeforeExpire = document.querySelector(
  ".warning-time-before-expire"
);
const btnCloseWarningTimeBefore = document.getElementById(
  "closeWarningTimeBefore"
);
const modalConfirmDelete = document.querySelector(".modal-confirm-delete");
const btnNoDelete = document.getElementById("btnNoDelete");
const btnYesDelete = document.getElementById("btnYesDelete");

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
btnCloseWarningTimeBefore.addEventListener(
  "click",
  closeWarningTimeBeforeExpire
);
btnNoDelete.addEventListener("click", cancelDeleteEvent);
btnYesDelete.addEventListener("click", confirmToDeleteEvent);
