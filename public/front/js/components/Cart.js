import { select, classNames, settings, templates } from '../settings.js';
import { utils } from '../utils.js';
import CartProduct from './CartProduct.js';

/* początek classy Cart */
/* obsługującej koszyk z zakupami */
class Cart {
  constructor(element) { // element to div id="cart" class="cart"
    const thisCart = this;
    thisCart.products = []; //przechowuje produkty dodane do koszyka
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee; //20
    thisCart.getElements(element);
    thisCart.initActions();

    console.log('new Cart', thisCart);
  }
  getElements(element) {
    const thisCart = this;
    thisCart.dom = {}; //przechowuje wszystkie elementy DOM  1.div koszyka #cart,2.div.cart-sumary
    thisCart.dom.wrapper = element; // div id="cart" class="cart" koszyka
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger); //div.cart__sumary
    console.log(thisCart.dom.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList); //<ul class="cart__order-summary no-spacing">
    thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];
    for (const key of thisCart.renderTotalsKeys) {
      thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
      // totalNumber to span cart-total-number
      // totalPrice to cart-total-price-strong oraz cart__order-total .cart__order-price-sum strong
      // subtotalPrice to .cart__order-subtotal .cart__order-price-sum strong
      // deliveryFee to .cart__order-delivery .cart__order-price-sum strong
    }
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    console.log(thisCart.dom.form);
    thisCart.dom.inputPhone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    console.log(thisCart.dom.inputPhone);
    thisCart.dom.inputAddress = thisCart.dom.wrapper.querySelector(select.cart.address);
    console.log(thisCart.dom.inputAddress);
    console.log('Domek', thisCart.dom);
  }

  initActions() {
    const thisCart = this;
    thisCart.dom.toggleTrigger.addEventListener('click', function () {
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });
    thisCart.dom.productList.addEventListener('updated', function () {
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function (event) {
      thisCart.remove(event.detail.cartProduct);
    });
    thisCart.dom.form.addEventListener('submit', (event) => {
      event.preventDefault();
      thisCart.weryfikuj();
      thisCart.sendOrder();
      thisCart.clearOrder();
    });
  }
  /*metoda dodająca produkty do koszyka, uzyskuje dostęp do 4 produktów, do wszystkich wł i metod instancji obiektu Product */
  add(menuProduct) {
    const thisCart = this;
    console.log('adding product', menuProduct);
    const generatedHTML = templates.cartProduct(menuProduct);
    console.log('HTML cart', generatedHTML); // kod HTML poszczególnych produktów w karcie
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    console.log(generatedDOM);
    thisCart.dom.productList.appendChild(generatedDOM);
    console.log(thisCart.dom.productList);
    //console.log('obiekt Cart', app.cart);
    /*zastępujemy ten kod pracy na orginale referencji obiektu Product.products
    thisCart.products.push(menuProduct); // za każdym razem puszuję orginalny obiekt
    console.log('thisCart.products', thisCart.products);
    utworzeniem nowej instancji przechowującej już nie orginał lecz każdy produkt osobno w tablicy */
    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    console.log('thisCart.products', thisCart.products);
    thisCart.update();
  }

  /* metoda obliczająca sumę cen wszystkich dodanych produktów do koszyka Subtotal*/
  update() {
    const thisCart = this;
    thisCart.totalNumber = 0; //liczba wszystkich ilości produktów w koszyku
    thisCart.subtotalPrice = 0; //suma wszystkich cen produktów w koszyku
    for (const product of thisCart.products) {
      thisCart.subtotalPrice += product.price;
      thisCart.totalNumber += product.amount;
    }
    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee; // cena wszystkich produktów + dostawa
    console.log('ilość Produktów', thisCart.totalNumber);
    console.log('suma cen produktów', thisCart.subtotalPrice);
    console.log('suma końcowa z dostawą', thisCart.totalPrice);
    for (const key of thisCart.renderTotalsKeys) {
      for (const elem of thisCart.dom[key]) {
        elem.innerHTML = thisCart[key];
      }
    }
  }
  /*metoda remove usuwająca product z koszyka*/
  remove(cartProduct) {
    const thisCart = this;
    const index = thisCart.products.indexOf(cartProduct);
    console.log('Kim jest index', index);
    thisCart.products.splice(index, 1);
    cartProduct.dom.wrapper.remove();
    thisCart.update();
  }
  /*metoda sprawdzZnak*/
  sprawdzZnak(address) {
    console.log('jestem w sprawdzZnak');
    for (let i = 0; i <= address.length - 1; i++) {
      console.log(i);
      if ((address.charCodeAt(i) == 64) && ((address.indexOf('o2.pl', address.length - 5)) > -1 || (address.indexOf('gmail.com', address.length - 9)) > -1 || (address.indexOf('onet.pl', address.length - 7)) > -1)) return false;
    }
    return true;
  }
  /*metoda weryfikuj*/
  weryfikuj() {
    console.log('jestem w weryfikuj');
    const thisCart = this;
    const phone = document.querySelector('[name="phone"]');
    console.log(phone);
    const numberPhone = phone.value;
    console.log(numberPhone, numberPhone.length);


    const address = document.querySelector('[name="address"]');
    const addressValue = address.value;

    if (numberPhone == '' || numberPhone.length > 9 || numberPhone.length <= 8) {
      console.log('jestem w if');
      alert('Nie prawidłowy numer');
      phone.classList.add('error');
    } else {
      console.log('jestem w else');
      phone.classList.remove('error');
    }

    if (addressValue == '' || thisCart.sprawdzZnak(addressValue)) {
      alert('Nie prawidłowy address email');
      address.classList.add('error');
    } else {
      console.log('525 jestem w else');
      address.classList.remove('error');
    }

    if (!thisCart.dom.productList.innerHTML) {
      console.log(thisCart.dom.productList.innerHTML);
      alert('Nie wybrano produktów');
    }
  }

  /*metoda sendOrder definiuje zawartość wysyłaną do serwera endpointu API*/
  sendOrder() {
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.order;
    const payload = {
      phone: thisCart.dom.inputPhone.value,
      address: thisCart.dom.inputAddress.value,
      totalNumber: thisCart.totalNumber,
      subtotalPrice: thisCart.subtotalPrice,
      totalPrice: thisCart.totalPrice,
      deliveryFee: thisCart.deliveryFee,
      products: [],
    };

    for (const product of thisCart.products) {
      console.log(product);
      const data = thisCart.getData(product);
      console.log(data);
      payload.products.push(data);
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    fetch(url, options)
      .then(rawResponse => rawResponse.json())
      .then(parsedResponse => console.log('parsedResponse', parsedResponse));
  }
  /*metoda getData*/
  getData(product) { // product jest pojedyńczą instancją obiektu new CartProduct
    return {
      id: product.id,
      amount: product.amount,
      price: product.price,
      priceSingle: product.priceSingle,
      params: product.params,
    };
  }
  /*metoda clearOrder*/
  clearOrder() {
    const thisCart = this;
    console.log('jestem w clearOrder');
    thisCart.dom.inputPhone.value = '';
    thisCart.dom.inputAddress.value = '';
    thisCart.dom.productList.innerHTML = '';
    for (const strong of thisCart.dom.totalPrice) {
      strong.textContent = 0;
    }
    thisCart.dom.subtotalPrice[0].textContent = 0;
    thisCart.dom.deliveryFee[0].textContent = 0;
    thisCart.dom.totalNumber[0].textContent = 0;
    thisCart.dom.wrapper.classList.remove(classNames.cart.wrapperActive);
  }
}
/* koniec classy Cart */
export default Cart;
