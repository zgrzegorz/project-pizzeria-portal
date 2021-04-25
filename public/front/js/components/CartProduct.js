import { select } from '../settings.js';
import AmountWidget from './AmountWidget.js';

/* początek classy CartProduct */
/* odpowiedzialna za przechowanie pojedyńczego produktu każdy inny nie opierający się na orginale */
class CartProduct {
  constructor(menuProduct, element) { // elementem jest cały <li> komponentu koszyka
    const thisCartProduct = this;
    thisCartProduct.id = menuProduct.id;
    thisCartProduct.name = menuProduct.name;
    thisCartProduct.price = menuProduct.price;
    thisCartProduct.priceSingle = menuProduct.priceSingle;
    thisCartProduct.amount = menuProduct.amount;
    /*obiekt params zawierający informacje na temat dodanego produktu do koszyka jest kopiowany i zamieniany na string aby nie pracować na jego orginale a potem z powrotem zamieniany-parsowany na object*/
    thisCartProduct.params = JSON.parse(JSON.stringify(menuProduct.params));
    thisCartProduct.getElements(element);
    thisCartProduct.initAmountWidget();
    thisCartProduct.initActions();
    console.log('klasa CartProduct', thisCartProduct);
  }
  getElements(element) {
    const thisCartProduct = this;
    thisCartProduct.dom = {};
    thisCartProduct.dom.wrapper = element; //element to <li> zawarty w Handlerbars <script>
    console.log(thisCartProduct.dom.wrapper);
    // element div class="widget-amount" odpowiada za ilość produktów w koszyku
    thisCartProduct.dom.amountWidget = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);
    // element strong ceny po dodaniu produktu do koszyka
    thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);
    // element link/favikon edycji
    thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);
    // element link/favikon usunięcia
    thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);
  }
  /* metoda tworząca klasę AmountWidget w koszyku */
  initAmountWidget() {
    const thisCartProduct = this;
    thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidget); // dom.amountWidget to div widget-amount koszyka
    thisCartProduct.dom.amountWidget.addEventListener('updated', function () {
      thisCartProduct.amount = thisCartProduct.amountWidget.value;
      thisCartProduct.price = thisCartProduct.amount * thisCartProduct.priceSingle;
      thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
      //app.cart.update(); zastosowanie miało sens gdy korzystaliśmy z instancji Event
    });
  }
  /* metoda tworząca event remove */
  remove() {
    const thisCartProduct = this;
    const event = new CustomEvent('remove', {
      bubbles: true,
      detail: {
        cartProduct: thisCartProduct,
      }
    });
    thisCartProduct.dom.wrapper.dispatchEvent(event); /* customowe zdarzenie może zostać zainicjalizowane na dowolnym elemencie dziecka np. <li> w <script>*/
    console.log('wywołuje się remove()');
  }
  /*metoda initActions*/
  initActions() {
    const thisCartProduct = this;
    thisCartProduct.dom.edit.addEventListener('click', (event) => {
      event.preventDefault();
    });
    thisCartProduct.dom.remove.addEventListener('click', (event) => {
      event.preventDefault();
      thisCartProduct.remove();
    });
  }
}
/* koniec classy CartProduct */
export default CartProduct;
