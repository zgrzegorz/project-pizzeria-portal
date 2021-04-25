/*początek klasy BaseWidget klasa która będzie dziedziczona przez inne klasy*/
class BaseWidget {
  constructor(wrapperElement, initialValue) { // wrapperElement przechowuje Widget (div class="widget-amount") czyli element odpowiedzialny za ilość produktów +/- ale również inne Widgety jak kalendarz, godziny
    const thisWidget = this;                    //a initialValue początkowa wartość widgetu domyślna
    thisWidget.dom = {};
    thisWidget.dom.wrapper = wrapperElement;
    console.log(initialValue);
    thisWidget.correctValue = initialValue;
    console.log(thisWidget.correctValue, initialValue);
  }

  get value() {
    const thisWidget = this;
    return thisWidget.correctValue;
  }

  set value(value) {
    const thisWidget = this;
    const newValue = thisWidget.parseValue(value);
    console.log(newValue);
    if (newValue != thisWidget.correctValue && thisWidget.isValid(newValue)) {
      thisWidget.correctValue = newValue; // metoda set ustawia nową wartość dla istniejącej już wł.obiektu correctValue ale jednocześnie jest ustawieniem nowej wartości dla nowej wł. value obiektu thisWidget?
      console.log(thisWidget.correctValue);
      thisWidget.announce();
    }
    thisWidget.renderValue();
  }

  setValue(value) {
    const thisWidget = this;
    console.log('kiedy się wykonuje');
    thisWidget.value = value;
  }

  parseValue(value) {
    return parseInt(value);
  }

  isValid(value) {
    console.log('hej hej');
    return !isNaN(value);
  }

  renderValue() {
    const thisWidget = this;
    console.log('jestem w BaseWidget');
    thisWidget.dom.wrapper.innerHTML = thisWidget.correctValue;
  }
  /*metoda announce tworząca własny event*/
  announce() {
    const thisWidget = this;
    console.log('jestem w announce BaseWidget');
    const event = new CustomEvent('updated', {
      bubbles: true,
    });
    thisWidget.dom.wrapper.dispatchEvent(event);
  }
}
/*koniec klasy BaseWidget*/
export default BaseWidget;
