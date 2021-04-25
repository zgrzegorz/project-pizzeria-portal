import { utils } from '../utils.js';
import { select, classNames, templates } from '../settings.js';
import AmountWidget from './AmountWidget.js';

/* początek classy Product */
class Product {
  constructor(id, data) {
    const thisProduct = this;
    thisProduct.id = id;
    thisProduct.data = data; // obiekt poszczególnych produktów np. cake={} itp.
    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();

    console.log(thisProduct.id, thisProduct.data);
    console.log('new Product:', thisProduct);
  }

  renderInMenu() {
    const thisProduct = this; // this wskazuje nam na IO i mając dostęp do instancji obiektu mam dostęp do jej właściwości
    /*generate HTML based on template*/
    const generatedHTML = templates.menuProduct(thisProduct.data);
    console.log(generatedHTML);
    /*create element using utils.createElementFromHTML */
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);
    console.log(thisProduct.element);
    /*find menu container*/
    const menuContainer = document.querySelector(select.containerOf.menu);
    /*add element to menu*/
    menuContainer.appendChild(thisProduct.element);
  }

  // metoda odp. za szukanie elementów produktu w tagu <article> dla pojedyńczych instancji
  getElements() {
    const thisProduct = this;
    //wyszukanie nagłówka <header>
    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    //wyszukanie tagu formularza <form>
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    console.log(thisProduct.form);
    //wyszukanie inputów i selecta
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    console.log(thisProduct.formInputs);
    //wyszukanie przycisku add to cart
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    //wyszukanie Total Price ceny ostatecznej kolor orange
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    //wyszukanie diva przechowującego images obrazy produktów
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    console.log(typeof (thisProduct.imageWrapper), thisProduct.imageWrapper);
    //wyszukanie diva widget-amount
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    console.log(thisProduct.amountWidgetElem);
  }

  initAccordion() {
    const thisProduct = this;
    /* find the clickable trigger (the element that should react to clicking) */
    // const header = thisProduct.element.querySelector(select.menuProduct.clickable);
    const header = thisProduct.accordionTrigger;
    console.log(header);
    /* START: click event listener to trigger */
    header.addEventListener('click', function (event) {
      /* prevent default action for event */
      event.preventDefault();
      /* toggle active class on element of thisProduct */
      thisProduct.element.classList.toggle('active');
      /* find all active products */
      const activeProducts = document.querySelectorAll(select.all.menuProductsActive);
      console.log(activeProducts);
      /* START LOOP: for each active product */
      for (const activeProduct of activeProducts) {
        console.log(activeProduct, thisProduct.element); // poprzedni i bieżący
        console.log(typeof (activeProduct), typeof (thisProduct.element));
        /* START: if the active product isn't the element of thisProduct */
        if (activeProduct != thisProduct.element) { // jeżeli poprzedni jest różny od bieżącego
          /* remove class active for the active product */
          activeProduct.classList.remove('active');
        }
        /* END: if the active product isn't the element of thisProduct */
      }
      /* END LOOP: for each active product */
    });
  }
  /* END: click event listener to trigger */

  initOrderForm() {
    const thisProduct = this;
    console.log('metoda initOrderForm');
    thisProduct.form.addEventListener('submit', function (event) {
      console.log('jestem submit');
      event.preventDefault();
      thisProduct.processOrder();
    });

    for (const input of thisProduct.formInputs) {
      console.log(input);
      input.addEventListener('change', function () {
        thisProduct.processOrder();
        console.log('jestem zmianą kontrolki w inpucie');
      });
    }

    thisProduct.cartButton.addEventListener('click', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
      console.log('kliknełeś add-to-cart');
      thisProduct.addToCart();
      thisProduct.clearAddToCart();
    });
  }

  processOrder() { // metoda obliczająca cenę produktu dla wysłania formularza,dla zmian w inputach i selectie oraz w Add-to-cart
    const thisProduct = this;
    console.log('metoda processOrder');
    console.log(typeof (thisProduct.form));
    const formData = utils.serializeFormToObject(thisProduct.form);
    console.log('formData', formData);
    // początek metody
    thisProduct.params = {}; //obiekt przechowuje wybrane opcje
    let price = thisProduct.data.price;
    console.log('Kim jest price 1', typeof (price));
    console.log('Cena podstawowa-domyślna $' + thisProduct.data.price);
    console.log(thisProduct.data); // obiekt {} poszczególnych produktów cake,breakfast,pizza,salad
    // 1 pętla
    for (const productId in thisProduct.data.params) { //coffee/ sauce,toppings,crust/ ingredients
      // console.log("hej to ja", productId, typeof (productId));
      const param = thisProduct.data.params[productId];
      /*wersja 1 utworzenia obiektu params przechowującego dodatki w karcie koszyka
       if (!thisProduct.params[productId]) {
       thisProduct.params[productId] = {
          label: param.label, // nazwa produktów
         options: [], // nazwa dodatków
        };
      }*/
      /* wersja 2 utworzenia obiektu params przechowującego dodatki w karcie koszyka*/
      if (!thisProduct.params[productId]) {
        thisProduct.params[productId] = {
          label: param.label, // nazwa produktów
          options: {}, // nazwa dodatków
        };
      }
      for (const optionId in param.options) { //latte,cappucciono,ecspresso,macchiato, itp.
        console.log('jestem w opcjach produktów ' + optionId);
        const option = param.options[optionId];
        const optionSelected = formData.hasOwnProperty(productId) && formData[productId].indexOf(optionId) > -1;
        //warunek 1 ozn. że kontrolka została zaznaczona i że jest niedomyślna (undefined brak wartości)
        if (optionSelected && !option.default) {
          // console.log("jestem!!!");
          price += option.price;
        }
        //warunek 2 ozn. że kontrolka została odznaczona i że jest domyślna (default==true)
        else if (!optionSelected && option.default) {
          price -= option.price;
          console.log('$ ' + price);
          console.log(typeof (price));
        }
        const images = thisProduct.imageWrapper.querySelectorAll('.' + productId + '-' + optionId);
        console.log(images); // nodeList
        // warunek gdy kontrolka zaznaczona lub odznaczona dodający dodatki do produktu w img
        if (formData.hasOwnProperty(productId) && formData[productId].indexOf(optionId) > -1) {
          console.log('jestem');
          /*wersja 1 utworzenia obiektu params przechowującego dodatki w karcie koszyka
          if (thisProduct.params[productId]) {
            console.log('jestem też');
            thisProduct.params[productId].options.push(option.label);
            console.log(thisProduct.params);
          }*/
          /*wersja 2 utworzenia obiektu params przechowującego dodatki w karcie koszyka*/
          if (!thisProduct.params[productId].options[optionId]) {
            console.log('jestem też');
            thisProduct.params[productId].options[optionId] = [];
            thisProduct.params[productId].options[optionId].push(option.label);
            console.log(thisProduct.params);
          }

          for (const img of images) {
            img.classList.add(classNames.menuProduct.imageVisible);
          }
        } else {
          for (const img of images) {
            img.classList.remove(classNames.menuProduct.imageVisible);
          }
        }
      }
    }
    // koniec metody
    console.log(thisProduct.amountWidget.value);
    /* kod zamieniamy na ten pod spodem
    price *= thisProduct.amountWidget.value;
    thisProduct.priceElem.innerHTML = price;*/
    thisProduct.priceSingle = price; // cena za pojedyńcza sztukę
    thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value; // cena całkowita to pojedyńcza cena * ilość
    thisProduct.priceElem.innerHTML = thisProduct.price;
    // console.log("Cena: ", thisProduct.priceElem);
  }
  /*metoda tworząca instancję klasy AmountWidget*/
  initAmountWidget() {
    const thisProduct = this;
    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem); // thisProduct.amountWidgetElem to div widget-amount
    thisProduct.amountWidgetElem.addEventListener('updated', function () {
      thisProduct.processOrder();
    });
  }
  /*metoda która przekazuje poszczególne kliknięte produkty do obiektu Cart-koszyka*/
  addToCart() {
    const thisProduct = this; // przekazujemy całą instancję obiektu Product wraz z jej wszystkimi właściwościami i metodami
    thisProduct.name = thisProduct.data.name; // nazwa produktu
    thisProduct.amount = thisProduct.amountWidget.value; // ilość produktów
    //app.cart.add(thisProduct);
    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });
    thisProduct.element.dispatchEvent(event); // zdarzenie wywołane na <article class="product">
  }
  /*metoda clearAddToCart*/
  clearAddToCart() {
    /*const thisProduct = this;
    const div = document.querySelector('.product-list.container');
    console.log(div);
    div.innerHTML = '';
    console.log(div);
    console.log(app.data.products);
    const element = [];
    for (const product of app.data.products) {
      console.log(product);
      const generatedHTML = templates.menuProduct(product);
      console.log(generatedHTML);
      element.push(utils.createDOMFromHTML(generatedHTML));
    }
    console.log(element);
    for (const article of element) {
      div.insertAdjacentHTML('beforeend', article.innerHTML);
    }*/
    /*thisProduct.amountWidget.input.value = settings.amountWidget.defaultValue;
    thisProduct.priceElem.innerHTML = thisProduct.data.price;
    thisProduct.element.classList.remove('active');
    thisProduct.imageWrapper.querySelectorAll*/
  }
}
/* koniec classy Product */
export default Product;
