// Описаний в документації
import flatpickr from "flatpickr";
// Додатковий імпорт стилів
import "flatpickr/dist/flatpickr.min.css";


document.body.style.backgroundColor = 'rgb(224 210 224)';
const startBtn = document.querySelector('[data-start]');
// console.log(startBtn);
const inputCalendar = document.querySelector('input#datetime-picker');
const dataDays = document.querySelector('[data-days]');
const dataHours = document.querySelector('[data-hours]');
const dataMinutes = document.querySelector('[data-minutes]');
const dataSeconds = document.querySelector('[data-seconds]');
const SECOND_DELAY = 1000;

let selectedDate = null;
let currentDate = null;
let timerId = null;
startBtn.disabled = true;


// console.dir(inputCalendar);
const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
     //   console.log(selectedDates[0].getTime());
      
     // if - Якщо користувач вибрав дату в минулому, 
     // покажи window.alert() з текстом "Please choose a date in the future".
     //else - Якщо користувач вибрав валідну дату (в майбутньому), 
     //кнопка «Start» стає активною.
      if(selectedDates[0].getTime() < Date.now()) {
        // alert("Please choose a date in the future");
        Report.failure(
            'Oops!',
            'Please choose a date in the future.',
            'Okay',
            );
      } else {
        Report.success(
            'Super!',
            'Please, click on button start.',
            'Okay',
            );
        startBtn.disabled = false;
        selectedDate = selectedDates[0].getTime();
        // console.log(selectedDate);
      }
    },
  };
const fp = flatpickr(inputCalendar, options);


// Якщо користувач вибрав дату в минулому, 
// покажи window.alert() з текстом "Please choose a date in the future".
// console.log(new Date().getTime());
// console.log(Date.now());


// Натисканням на кнопку «Start» починається відлік часу до обраної дати з моменту натискання.
const counter = {
    start() {
        timerId = setInterval(() => {
            startBtn.disabled = true;
            inputCalendar.disabled = true;
            currentDate = Date.now();
            const delta = selectedDate - currentDate;
            // console.log(delta);
            convertMs(delta);
            // console.log(convertMs(delta));
            updateInterfaceTimer(convertMs(delta));
            if (delta <= 1000) {
                this.stop();
                Report.info(
                    'Time is over',
                    'You can choose a new date and time',
                    'Okay',
                    );
            }
        }, SECOND_DELAY);
    }, 
    stop() {
        clearInterval(timerId);
        startBtn.disabled = true;
        inputCalendar.disabled = false;
        return;
    },
}
startBtn.addEventListener("click", onStart);
function onStart () {
    counter.start()
}

// оновлювати інтерфейс таймера
function updateInterfaceTimer ({ days, hours, minutes, seconds }) {
    dataDays.textContent = addLeadingZero(days);
    dataHours.textContent = addLeadingZero(hours);
    dataMinutes.textContent = addLeadingZero(minutes);
    dataSeconds.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
    return String(value).padStart(2, '0');
  }

function convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
  
    // Remaining days
    const days = Math.floor(ms / day);
    // Remaining hours
    const hours = Math.floor((ms % day) / hour);
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  
    return { days, hours, minutes, seconds };
  }