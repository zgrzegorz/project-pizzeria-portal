import { settings, select } from '../settings.js';
import BaseWidget from './BaseWidget.js';

/* początek classy AmountWidget */
class AmountWidget extends BaseWidget {
  constructor(element) { // div class="widget-amount"
    super(element, settings.amountWidget.defaultValue); // 1
    const thisWidget = this;
    thisWidget.getElements(element);
    thisWidget.initActions();
    //thisWidget.value = settings.amountWidget.defaultValue;
    //thisWidget.setValue(thisWidget.value); // jest to wartość domyślna
    console.log('AmountWidget', thisWidget);
    console.log('argument element', element);
  }
  /*metoda getElements która z div widget-amount pobierze inputa oraz dwa linki <a> inkrementujący i dekrementujący*/
  getElements() {
    const thisWidget = this;
    //thisWidget.element = element;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    console.log(thisWidget.dom.input);
    console.log('wartość poprzednia value', thisWidget.dom.input.value);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    console.log('link odejmujący', thisWidget.dom.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
    console.log('link dodajacy', thisWidget.dom.linkIncrease);
  }
  /*metoda announce wywołująca customowe własne zdarzenie updated zostaje przeniesiona do class BaseWidget*/

  /*metoda setValue ustawiająca nową wartość*/
  /*
  setValue(value) {
    //value jest wartością domyślną =1
    const thisWidget = this;
    console.log('wartość domyślna i aktualna', value, typeof (value));
    const newValue = parseInt(value); // newValue jest nową wartością
    console.log(newValue, (newValue != thisWidget.value));
    //walidacja kodu czyli dopuszczenie do działania w przypadku spełnienia jakiegoś warunku
    // warunek if na wypadek gdyby w HTMLu nie podano value lub podano literę to value przypiszemy wartość domyślną
    if (isNaN(newValue) || newValue == thisWidget.value) {
      //thisWidget.value = thisWidget.value;
      console.log(thisWidget.value);
    } else {
      if (newValue != thisWidget.value && thisWidget.input.value >= settings.amountWidget.defaultMin && thisWidget.input.value <= settings.amountWidget.defaultMax) {
        thisWidget.value = newValue;
        thisWidget.announce();
      }
    }
    thisWidget.input.value = thisWidget.value; // dodanie do obiektu AmountWidget wł. input.value nowej wartości value
    console.log('new Value', thisWidget.input.value);
  }
  */

  isValid(value) {
    return !isNaN(value)
      && value >= settings.amountWidget.defaultValue
      && value <= settings.amountWidget.defaultMax;
  }

  renderValue() {
    const thisWidget = this;
    console.log('to ja');
    thisWidget.dom.input.value = thisWidget.value; // próba odczytania wartości właściwości value uruchomi metodę getter() która zwróci wartość w te miejsce
  }
  /*metoda initAction wyłapująca zdarzenia w inpucie oraz w linkach <a> */
  initActions() {
    const thisWidget = this;
    thisWidget.dom.input.addEventListener('change', function () {
      //thisWidget.setValue(thisWidget.input.value);
      thisWidget.value = thisWidget.dom.input.value;
    });

    thisWidget.dom.linkDecrease.addEventListener('click', function (event) {
      event.preventDefault();
      const clickedElement = this;
      console.log(clickedElement);
      // walidacja
      //if (thisWidget.input.value > 1 && thisWidget.input.value <= 9) {}
      thisWidget.setValue(--thisWidget.dom.input.value);
    });

    thisWidget.dom.linkIncrease.addEventListener('click', function (event) {
      event.preventDefault();
      // walidacja
      //if (thisWidget.input.value >= 1 && thisWidget.input.value < 9) {}
      thisWidget.setValue(++thisWidget.dom.input.value);
    });
  }
}
/* koniec classy AmountWidget */
export default AmountWidget;
