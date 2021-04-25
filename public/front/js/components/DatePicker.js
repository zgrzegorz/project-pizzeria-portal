import { settings, select } from '../settings.js';
import BaseWidget from './BaseWidget.js';
import { utils } from '../utils.js';

/*początek klasy DatePicker wyświetlająca kalendarz daty*/
class DatePicker extends BaseWidget {
  constructor(wrapper) { // wrapper to <div class="date-picker"> czyli widget kalendarza
    super(wrapper, utils.dateToStr(new Date()));
    //utils.dateToStr() przekształca aktualną datę na format 'rok-miesiąc-dzień'
    const thisWidget = this;
    // <input type="text" name="date"> DatePicker przechowuje/ma dostęp do wł.inputa stąd mogę pobrać jego value
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);
    thisWidget.initPlugin();
  }
  /*metoda initPlugin*/
  initPlugin() {
    const thisWidget = this;
    thisWidget.minDate = new Date(thisWidget.value); // data formatu rr-mm-dd ponownie przekazana do konstruktora Date() zwróci dla danego dnia obiekt daty(thisWidget.minDate) zawierający wszystkie parametry dni, godz i strefę czasową
    console.log(thisWidget.minDate); //Tue Jan 26 2021 01:00:00 GMT+0100 01:00
    thisWidget.maxDate = utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture); // zwraca obiekt daty Tue Feb 09 2021 GMT+0100 01:00
    console.log(thisWidget.maxDate);
    //zainicjalizować czyli uruchomić plugin flatpickr
    // eslint-disable-next-line no-undef
    flatpickr(thisWidget.dom.input, {
      defaultData: thisWidget.minDate,
      minDate: thisWidget.minDate,
      maxDate: thisWidget.maxDate,
      //dateFormat: "Y-m-d",
      disable: [
        function (date) {
          return date.getDay() === 1;
        }
      ],
      locale: {
        firstDayOfWeek: 1,
      },
      onChange: function (dateStr) {
        console.log(dateStr); // dateStr to [{z obiektem daty}]
        return thisWidget.value = dateStr; // stąd jest brana data wybierana przez użytkownika ale próba przypisania wartości do wł. obiektu value powoduje wywołanie metody set value()
      },
      // wrap: true,
    });
  }

  /*metoda parseValue nadpisuje metodę z class BaseWidget*/
  parseValue(value) {
    const objDaty = value[0];
    const year = objDaty.getFullYear();
    let month = objDaty.getMonth() + 1;
    if (month < 10) month = '0' + month;
    let day = objDaty.getDate();
    if (day < 10) day = '0' + day;
    console.log(year, month, day);
    return (`${year}-${month}-${day}`);
    /*console.log(utils.dateToStr(value[0]));
    console.log(value); // value jest tablicą stąd może ten index
    return utils.dateToStr(value[0]); funkcja źle przetważała obiekt daty brała poprzedni dzień*/
  }
  /*metoda isValid nadpisuje metodę z class BaseWidget*/
  isValid() {
    return true;
  }
  /*metoda renderValue nadpisuje metodę z class BaseWidget*/
  renderValue() {
    console.log('jestem w DatePicker');
    //return null;
  }
  //przykład utworzenia daty
  newDate() {
    const thisWidget = this;

    thisWidget.value = new Date();

    const addDays = utils.addDays(thisWidget.value, thisWidget.maxDate);
    utils.dateToStr(addDays);
  }

}

/*koniec klasy DatePicker*/
export default DatePicker;
