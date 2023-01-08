function startRemindEvents() {
  if (arrOfEvents) {
    handleRemindEvents();
    setInterval(handleRemindEvents, 10000);
  }
}

function handleRemindEvents() {
  let now = Date.now();

  for (let i = 0; i < arrOfEvents.length; i++) {
    let date;

    if (arrOfEvents[i].endDate) {
      date = new Date(arrOfEvents[i].endDate).getTime();
    } else {
      date = new Date(arrOfEvents[i].initialDate).getTime();
    }

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

    if (arrOfEvents[i].timeRemind) {
      showWarningTimeBeforeExpire(now, date, arrOfEvents[i].timeRemind, i);
    }
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
    warningEventExpired.className =
      "warning-modal warning-event-expired warning-active";
    containerMainPage.classList.add("background-modal-active");
    setTimeout(() => {
      containerMainPage.addEventListener("click", closeWarningExpiredEvent);
    }, 1);
  }
}

function showWarningTimeBeforeExpire(
  dateNow,
  dateEvent,
  timeRemind,
  idxOfArrOfEvents
) {
  let timeBefore;
  let timeToExpireText;
  switch (timeRemind) {
    case "5min":
      timeBefore = 5 * 60000;
      timeToExpireText = "5 minutes";
      break;
    case "10min":
      timeBefore = 10 * 60000;
      timeToExpireText = "10 minutes";
      break;
    case "15min":
      timeBefore = 15 * 60000;
      timeToExpireText = "15 minutes";
    case "30min":
      timeBefore = dateNow - 30 * 60000;
      timeToExpireText = "30 minutes";
    default:
      timeBefore = 60 * 60000;
      timeToExpireText = "1 hour";
      break;
  }
  if (
    dateEvent - dateNow > -10000 + timeBefore &&
    dateEvent - dateNow <= 0 + timeBefore
  ) {
    containerRemindBeforeExpire.insertAdjacentHTML(
      "afterbegin",
      ` <h4>The event
          <span class="reminder-span">${arrOfEvents[idxOfArrOfEvents].title}</span>
          will expire in <span class="reminder-span">${timeToExpireText}</span>.</h4>`
    );
    warningTimeBeforeExpire.className =
      "warning-modal warning-time-before-expire warning-active";
    containerMainPage.classList.add("background-modal-active");
    setTimeout(() => {
      containerMainPage.addEventListener("click", closeWarningTimeBeforeExpire);
    }, 1);
  }
}

function closeWarningExpiredEvent() {
  containerEventsExpired.textContent = "";
  warningEventExpired.classList.remove("warning-active");
  containerMainPage.classList.remove("background-modal-active");
  containerMainPage.removeEventListener("click", closeWarningExpiredEvent);
}

function closeWarningTimeBeforeExpire() {
  containerRemindBeforeExpire.textContent = "";
  warningTimeBeforeExpire.classList.remove("warning-active");
  containerMainPage.classList.remove("background-modal-active");
  containerMainPage.removeEventListener("click", closeWarningTimeBeforeExpire);
}
