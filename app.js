const todayText = document.getElementById("today");
const daysOfCalendar = document.getElementsByClassName("days");

const todayDate = new Date();
const [month, day, year, dayofWeek] = [
  todayDate.getMonth(),
  todayDate.getDate(),
  todayDate.getFullYear(),
  todayDate.getDay(),
];
const [hour, minutes, seconds] = [todayDate.getHours(), todayDate.getMinutes()];

let numberOfDaysMonth;
let divStartPrint;

window.addEventListener("load", getTodayDate);
window.addEventListener("load", getDaysInMonth(month, year));
window.addEventListener("load", printDaysOnCalendar(month, year));

function getTodayDate() {
  todayText.innerText = `${day}/${month + 1}/${year} today is ${dayofWeek}`;
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
