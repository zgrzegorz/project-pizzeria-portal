import BaseWidget from './BaseWidget.js';
import { settings, select } from '../settings.js';
import { utils } from '../utils.js';

/*początek klasy HourPicker wyświetlająca godziny*/
class HourPicker extends BaseWidget {
  constructor(wrapper) { // wrapper to <div class="hour-picker range-slider"> on jest przekazywany do super class BaseWidget
    super(wrapper, settings.hours.open);
    const thisWidget = this;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);//input type="range"
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output); //<div class="output">
    thisWidget.initPlugin();
    thisWidget.value = thisWidget.dom.input.value;
  }
  /*metoda initPlugin*/
  initPlugin() {
    const thisWidget = this;
    //eslint-disable-next-line no-undef
    rangeSlider.create(thisWidget.dom.input);
    thisWidget.dom.input.addEventListener('input', () => { // każda akcja/ruch na inpucie jest rejestrowany jako zdarzenie
      thisWidget.value = thisWidget.dom.input.value; // stąd zostaje odczytana godzina w postaci stringu "12:30"
      console.log(thisWidget.value);
    });
  }
  /*metoda parseValue*/
  parseValue(value) {
    return utils.numberToHour(value); //funkcja zamienia liczby na zapis godzinowy np.12 na '12:00', a 12.5 na '12:30'
  }
  /*metoda isValid*/
  isValid() {
    return true;
  }
  /*metoda renderValue*/
  renderValue() {
    const thisWidget = this;
    thisWidget.dom.output.textContent = thisWidget.value;
  }
}
export default HourPicker;
/*koniec klasy HourPicker*/
