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
          <button btnDayOfWeek=${i + 1} class="btn-disactivated">+</button>
          <h4>${i + 1}</h4>
          <div class="container-display-events" dayOfWeek=${i + 1}></div>
           `
    );
    document
      .querySelector(`[btnDayOfWeek="${i + 1}"]`)
      .addEventListener("click", openModalWithDate);
  }

  for (day of daysOfCalendar) {
    if (day.textContent === "") {
      day.classList.add("disabled-day");
    }
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
  eventToPrint.style.color = "#52524e";
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
  resetModalValues();
  currentEvent = {};
}

function closeModalWithEscapeKey(e) {
  if (e.code === "Escape") {
    closeModal();
    closeWarningExpiredEvent();
  }
}

function openModalWithDate(e) {
  let monthTwoDigits = month + 1;
  if (monthTwoDigits < 10) {
    monthTwoDigits = "0" + monthTwoDigits;
  }
  let dayOfWeek = e.target.attributes[0].value;
  if (dayOfWeek < 10) {
    dayOfWeek = "0" + dayOfWeek;
  }
  datetimeStartEvent.value = `${year}-${monthTwoDigits}-${dayOfWeek}T09:00`;
  startCreateNewEvent();
}

function openEvent(e) {
  const eventToOpen = arrOfEvents.filter((el) => {
    return el.id == e.target.dataset.eventId;
  });

  currentEvent = eventToOpen[0];

  titleEvent.value = currentEvent.title;
  datetimeStartEvent.value = currentEvent.initialDate;
  if (currentEvent.endDate) {
    checkEndDate.checked = true;
    showEndDate();
    datetimeFinishEvent.value = currentEvent.endDate;
  }
  if (currentEvent.timeRemind) {
    checkReminder.checked = true;
    showReminder();
    timeRemindEvent.value = currentEvent.timeRemind;
  }
  for (color of colorEvent) {
    if (color.value === currentEvent.color) {
      color.checked = true;
    }
  }
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
  for (color of colorEvent) {
    if (color.checked) currentEvent.color = color.value;
  }
  currentEvent.description = descriptionEvent.value;
  currentEvent.type = typeOfEvent.value;
}

function resetModalValues() {
  titleEvent.value = "";
  datetimeStartEvent.value = "";
  checkEndDate.checked = false;
  showEndDate();
  datetimeFinishEvent.value = "";
  checkReminder.checked = false;
  showReminder();
  timeRemindEvent.value = "";
  colorEvent[0].checked = true;
  descriptionEvent.value = "";
  typeOfEvent.value = "";
}

function deleteEvent(e) {
  e.preventDefault();
  modalConfirmDelete.classList.add("open-confirm-delete");
}

function cancelDeleteEvent() {
  modalConfirmDelete.classList.remove("open-confirm-delete");
}

function confirmToDeleteEvent() {
  arrOfEvents = arrOfEvents.filter((event) => event.id !== currentEvent.id);
  localStorage.setItem("events", JSON.stringify(arrOfEvents));

  const printedEventToDelete = document.querySelector(
    `[data-event-id="${currentEvent.id}"]`
  );

  printedEventToDelete.remove();
  modalConfirmDelete.classList.remove("open-confirm-delete");
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
    day.className = "days";
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
  containerCalendar.className = "calendar";
  setTimeout(() => {
    containerCalendar.classList.add("calendar-animation-left");
  }, 1);
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
  containerCalendar.className = "calendar";
  setTimeout(() => {
    containerCalendar.classList.add("calendar-animation-right");
  }, 1);
}
