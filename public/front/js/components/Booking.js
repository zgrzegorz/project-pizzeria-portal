import { select, templates, settings, classNames } from '../settings.js';
import { utils } from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

/*początek klasy Booking*/
class Booking {
  constructor(elementWrapper) { // elementWrapper to //<section> <div="booking-wrapper">
    const thisBooking = this;
    thisBooking.render(elementWrapper);
    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.initActions();
  }
  /*metoda getData*/ // jej zadaniem będzie pobieranie danych z API z adresami zawierającymi endpointy i parametry filtrujące
  getData() {
    const thisBooking = this;
    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    console.log(startDateParam); //date_gte=2021-01-26 ozn.parametr filtrujący z aktualną datę
    console.log(thisBooking.datePicker.minDate); // Tue Jan 26 2021 01:00:00 GTM+0100 i z obiektu daty wyciągniemy tylko rr-mm-dd
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);
    console.log(endDateParam); // date_lte=2021-02-09 ozn.parametr filtrujący z datą 2 tygodniową

    const params = { // to obiekt tworzący adresy endpointu
      booking: [startDateParam, endDateParam], //rezerwacje ze strony
      eventsCurrent: [settings.db.notRepeatParam, startDateParam, endDateParam], //rezerwacje jednodniowe aktualnego dnia do 2tyg.
      eventsRepeat: [settings.db.repeatParam, endDateParam], //rezerwacje cykliczne do 2 tygodni
    };
    console.log('getData params', params);

    const urls = { // obiekt przechowujący adresy API
      booking: settings.db.url + '/' + settings.db.booking + '?' + params.booking.join('&'),
      //localhost:3131/booking?date_gte=2021-01-26&date_lte=2021-02-09
      eventsCurrent: settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent.join('&'),
      //localhost:3131/event?repeat=false&date_gte=2021-01-26&date_lte=2021-02-09
      eventsRepeat: settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat.join('&'),
      //localhost:3131/event?repeat_ne=false&date_lte=2021-02-09
    };
    console.log('getData urls', urls);

    Promise.all([fetch(urls.booking), fetch(urls.eventsCurrent), fetch(urls.eventsRepeat)])
      .then(function (allResponse) {
        const bookingsResponse = allResponse[0];
        const eventsCurrentResponse = allResponse[1];
        console.log(eventsCurrentResponse);
        const eventsRepeatResponse = allResponse[2];
        return Promise.all([bookingsResponse.json(), eventsCurrentResponse.json(), eventsRepeatResponse.json()]);
      })
      .then(function ([bookings, eventsCurrent, eventsRepeat]) {
        console.log(bookings);
        console.log(eventsCurrent);
        console.log(eventsRepeat);
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      })
      .catch(error => console.warn('CONNECTION ERROR:', error));
  }

  /*metoda parseData*/ //jej zadaniem jest wyświetlenie inf. w obiekcie booked na temat zajętości stolików w oparciu o dane z API
  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;
    console.log('jestem w parseData');
    thisBooking.booked = {}; // obiekt przechowujący inf. na temat zajętości stolików
    for (let item of bookings) {// pętla iterująca po rezerwacjach
      console.log(bookings); // to [{}]
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
      //item.date to string "2021-01-27"
      //item.hour to string "16:00"
      //item.duration to number 3 ile godzin trwa rezerwacja
      //item.table to number 1 numer stolika
    }
    for (let item of eventsCurrent) {// pętla iterująca po wydarzeniach jednorazowych
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }
    const minDate = thisBooking.datePicker.minDate; // aktualny obiekt daty (obiekt ponieważ tworzy go konstruktor new Date())
    console.log(minDate);
    const maxDate = thisBooking.datePicker.maxDate; //2tyg.obiekt daty
    console.log(maxDate);
    for (let item of eventsRepeat) { // pętla iterująca po wydarzeniach cyklicznych
      if (item.repeat == 'daily') {
        for (let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)) {
          console.log(loopDate, loopDate <= maxDate);
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }
    console.log('thisBooking.booked', thisBooking.booked);
    thisBooking.updateDOM(); //metoda będzie uruchamiana po pobraniu danych z API i utworzeniu obiektu booked oraz po każdej zmianie widgecie daty i godziny przez użytkownika i będzie sprawdzała zajetość stolików
  }

  makeBooked(date, hour, duration, table) {
    const thisBooking = this;
    console.log(hour);
    if (typeof thisBooking.booked[date] == 'undefined') { // na samym początku obiekt booked jest pusty więc nie istnieje żaden klucz ma wartość undefined, próba odwołania się w obiekcie do nieistniejącej wł.zwraca undefined
      thisBooking.booked[date] = {};
    }
    const startHour = utils.hourToNumber(hour); // godzinę odczytuję jako string "12:30" a chcę ją mieć jako number 12.5 więc stosujemy metodę utils.hourToNumber()

    for (let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5) {
      if (typeof thisBooking.booked[date][hourBlock] == 'undefined') {
        thisBooking.booked[date][hourBlock] = [];
      }
      console.log(typeof table);
      if (typeof table === 'object') {
        for (let i = 0; i < table.length; i++) {
          thisBooking.booked[date][hourBlock].push(table[i]);
        }
      } else thisBooking.booked[date][hourBlock].push(table);
      // thisBooking.booked[date][hourBlock] = this.booked[date][hourBlock].concat(table).filter((number, index, array) => array.indexOf(number) === index);
    }
  }

  isAvaible() {
    const thisBooking = this;
    console.log(thisBooking.dom.duration);
  }

  updateDOM() { // metoda wykorzystująca obiekt booked(zawierający zajęte stoliki) oraz zmiany w widgetcie daty i godz.przez usera i sprawdzająca zajętość stolików
    const thisBooking = this;
    const dat = thisBooking.datePicker.value[0];// wartości wybrane przez użytkownika z widgetu, data jako obiekt
    console.log(typeof dat); // powinien być obiektem
    thisBooking.date = thisBooking.datePicker.value;
    console.log(thisBooking.date, typeof thisBooking.date);
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value); // string godz. zamieniany na postać number np.12.5
    console.log(thisBooking.date, thisBooking.hour);

    let allAvailable = false; // flaga mówiąca że wszystkie stoliki są zajęte

    // console.log(typeof thisBooking.booked[thisBooking.date]);
    // console.log(typeof thisBooking.booked[thisBooking.date][thisBooking.hour]);
    if (typeof thisBooking.booked[thisBooking.date] == 'undefined' || typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined') {
      console.log(typeof thisBooking.booked[thisBooking.date]); // undefined
      allAvailable = true; //flaga mówiąca że wszystkie stoliki o danej godzinie i dacie są dostępne/wolne czyli ma wartość true
    }
    for (let table of thisBooking.dom.tables) { // pętla iterująca przez wszystkie stoliki
      let tableId = table.getAttribute(settings.booking.tableIdAttribute); // data-table="1", "2", "3"
      if (!isNaN(tableId)) { // czy przekazana wartość nie jest typu number, ewen.ją konwertuje na typ number zwraca false i odwraca na true
        tableId = parseInt(tableId); // number 1, 2, 3
      }
      //nie wszystkie są zajęte któryś jest wolny i sprawdzamy czy o danej dacie i godzinie zajęty jest stolik o danym id
      // console.log(thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId) > -1);
      if (!allAvailable && thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)) {
        table.classList.add(classNames.booking.tableBooked); // dodanie klasy .booked stolik zajęty
        console.log('jestem w if');
      } else {
        console.log('jesem w esle');
        table.classList.remove(classNames.booking.tableBooked); // odjęcie klasy .booked stolik wolny
      }
    }
  }

  /*metoda makeReservation*/
  makeReservation() {
    const thisBooking = this;
    //endpoint booking ZRS robionych przez stronę www
    const url = `${settings.db.url}/${settings.db.booking}`;
    const booking = {
      hour: thisBooking.hourPicker.value,
      date: thisBooking.datePicker.value,
      table: [],
      starters: [],
      duration: parseInt(thisBooking.dom.duration.value),
      people: parseInt(thisBooking.dom.people.value),
      phone: thisBooking.dom.phone.value,
      adress: thisBooking.dom.adress.value,
    };

    for (let starter of thisBooking.dom.starters) {//iteracja water i bred
      if (starter.checked === true) {
        booking.starters.push(starter.value);
      }
    }

    for (let table of thisBooking.dom.tables) {
      if (table.classList.contains('selected')) {//sprawdzenie czy dany element posiada klasę 'selected'
        let tableId = table.getAttribute(settings.booking.tableIdAttribute);
        if (!isNaN(tableId)) {
          tableId = parseInt(tableId);
        }
        booking.table.push(tableId);
      }
    }
    /*ładunek dla serwera*/
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(booking)
    };

    fetch(url, options) // wysyłam zapytanie na serwer
      .then(function (rawResponse) { // i oczekuję odpowiedzi
        return rawResponse.json();
      })
      .then(function (parsedResponse) {
        console.log({ parsedResponse });
        console.log('parsedResponse', parsedResponse);
      });
  }

  /*metoda render*/
  render(elementWrapper) {
    const thisBooking = this;
    //console.log('jestem w metodzie render class Booking')
    const generatedHTML = templates.bookingWidget();
    console.log(generatedHTML);
    thisBooking.dom = {};
    thisBooking.dom.wrapper = elementWrapper;
    elementWrapper.appendChild(utils.createDOMFromHTML(generatedHTML));
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount); //<div class="widget-amount people-amount">
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount); //<div class="widget-amount hours-amount"
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper); // <div class="date-picker">
    //console.log(thisBooking.dom.datePicker);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper); //<div class="hour-picker range-slider">
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables); // to div table ze stolikiem 1,2,3
    console.log(thisBooking.dom.tables);
    thisBooking.dom.duration = thisBooking.dom.wrapper.querySelector(select.widgets.amount.hours); // input widgetu wyboru godziny
    thisBooking.dom.people = thisBooking.dom.wrapper.querySelector(select.widgets.amount.people);// input widgetu wyboru people
    thisBooking.dom.starters = thisBooking.dom.wrapper.querySelectorAll(select.booking.starters);// 2xinput water i bread
    thisBooking.dom.formSubmit = thisBooking.dom.wrapper.querySelector(select.booking.formSubmit);// button type="submit"
    thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector(select.booking.phone);
    thisBooking.dom.adress = thisBooking.dom.wrapper.querySelector(select.booking.adress);

  }
  /*metoda initWidgets*/
  initWidgets() {
    const thisBooking = this;
    //console.log('jestem w metodzie initWidgets class Booking');
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.wrapper.addEventListener('updated', function () {
      thisBooking.updateDOM();
    });
  }
  /*metoda initActions definiuje akcje na każdym z widgetów*/
  initActions() {
    const thisBooking = this;
    thisBooking.hour = thisBooking.hourPicker.dom.input;//input godz.
    thisBooking.date = thisBooking.datePicker.dom.input;//input daty kalendarza
    for (let table of thisBooking.dom.tables) {
      table.addEventListener('click', () => {
        if (table.classList.contains('booked')) { //booked ozn.zajęty
          return;
        } else {
          table.classList.toggle('selected');
        }
      });
      thisBooking.hour.addEventListener('input', () => table.classList.remove('selected'));
      thisBooking.date.addEventListener('change', () => table.classList.remove('selected'));
    }
    /*
        thisBooking.hour.addEventListener('input', () => {
          for (let table of thisBooking.dom.tables) {
            table.classList.remove('selected');
          }
        });

        thisBooking.date.addEventListener('change', () => {
          for (let table of thisBooking.dom.tables) {
            table.classList.remove('selected');
          }
        }); */

    thisBooking.dom.formSubmit.addEventListener('click', (event) => {
      event.preventDefault();
      thisBooking.makeReservation();
      for (let table of thisBooking.dom.tables) {
        table.classList.remove('selected');
      }
    });
  }
}
/*koniec klasy Booking*/
export default Booking;
