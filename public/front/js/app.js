import { settings, select, classNames, templates } from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';
import Carousel from './components/Carousel.js';
//import AmountWidget from './components/AmountWidget.js';
//import CartProduct from './components/CartProduct.js';
//import { utils } from './utils.js';

const app = {
  initData: function () {
    const thisApp = this;
    //thisApp.data = dataSource; zastępujemy
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product; //localhost:3131/product
    //metoda fetch() wysyłająca zapytanie do servera o dane aby je pobrać które znajdują się pod adresem endpointu
    fetch(url)
      .then(rawResponse => {
        // if (rawResponse.status >= 200 && rawResponse.ststus < 300) {
        return rawResponse.json();
        // } else {
        //   return Promise.reject(rawResponse.status + ' ' + rawResponse.statusText);
        // }
      })
      .then(parsedResponse => {
        console.log(parsedResponse);
        /* save parsedResponse as thisApp.data.products */
        thisApp.data.products = parsedResponse; // parsedResponse jest tablicą 4 elementową, przech. 4 obiekty
        /* execute initMenu method */
        thisApp.initMenu();
        console.log('thisApp.data', JSON.stringify(thisApp.data));
      });
    /* .catch((error) => {
        console.log('CONNECTION ERROR', error);
      }); */

    console.log('thisApp.data', JSON.stringify(thisApp.data));
  },
  initPages: function () {
    const thisApp = this; //app
    thisApp.pages = document.querySelector(select.containerOf.pages).children; //pobierze <div id="pages"> jego dzieci <section>
    thisApp.navLinks = document.querySelectorAll(select.nav.links); // pobierze trzy linki <a> <diva main-nav>
    console.log(thisApp.pages, thisApp.navLinks);
    const idFromHash = window.location.hash.replace('#/', ''); // pierwszy raz zwraca undefined
    console.log(window.location);
    console.log('idFromHash', typeof (idFromHash), idFromHash.textContent);
    let pageMatchingHash = thisApp.pages[0].id; // mainpage
    for (const page of thisApp.pages) {
      if (page.id == idFromHash) {
        pageMatchingHash = page.id;
        break;
      }
    }
    thisApp.activatePage(pageMatchingHash);
    for (const link of thisApp.navLinks) {
      link.addEventListener('click', function (event) {
        const clickedElement = this;
        console.log(clickedElement);
        event.preventDefault();
        /*get page id from href attribute*/
        const id = clickedElement.getAttribute('href').replace('#', '');
        console.log(id);
        /*run thisApp.activatePage with that id*/
        thisApp.activatePage(id);
        /*change URL hash*/
        window.location.hash = '#/' + id;
      });
    }
  },
  activatePage: function (pageId) { // pageId==mainpage
    const thisApp = this;
    /*add class "active" to matching pages, remove from non-matching*/
    /*for (const page of thisApp.pages) {
      if (page.id == pageId) {
        page.classList.add(classNames.pages.active);
      } else {
        page.classList.remove(classNames.pages.active);
      }
    }*/
    for (const page of thisApp.pages) {
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }
    /*add class "active" to matching links, remove from non-matching*/
    for (const link of thisApp.navLinks) {
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#' + pageId
      );
    }
  },
  initBooking: function () {
    const thisApp = this;
    thisApp.bookingWrapper = document.querySelector(select.containerOf.booking);
    console.log(thisApp.bookingWrapper); //<section> <div="booking-wrapper">
    new Booking(thisApp.bookingWrapper);
  },
  initCarousel: function () {
    new Carousel();
  },
  initMenu: function () {
    const thisApp = this;
    console.log('thisApp.data:', thisApp.data);
    /* całość zastępujemy nowym kodem
    for (const productData in thisApp.data.products) {
      new Product(productData, thisApp.data.products[productData]); //productData nazwa produktów cake,brekfast,pizza,salad */
    for (const productData in thisApp.data.products) {
      console.log(productData); // iterując po tablicy iteruję po indexach
      console.log(thisApp.data.products);
      console.log(thisApp.data.products[productData]);
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
    /* const testProduct = new Product();
    console.log('testProduct:', testProduct); */
    console.log(app);
  },
  initCart: function () { //metoda inicjalizująca/tworząca instancję koszyka
    const thisApp = this;
    const cartElem = document.querySelector(select.containerOf.cart); //div koszyka div id="cart" class="cart"
    console.log('cartElem', cartElem, typeof (cartElem));
    thisApp.cart = new Cart(cartElem);
    console.log('new Cart', thisApp.cart);
    thisApp.productList = document.querySelector(select.containerOf.menu); // w section order <div id="product-list">
    console.log(thisApp.productList);
    thisApp.productList.addEventListener('add-to-cart', function (event) {
      app.cart.add(event.detail.product); // przekazuję całą IO thisProduct
    });
  },
  init: function () {
    const thisApp = this;
    console.log('*** App starting ***');
    console.log('thisApp:', thisApp);
    console.log('classNames:', classNames);
    console.log('settings:', settings);
    console.log('templates:', templates);
    thisApp.initPages();
    thisApp.initData();
    //thisApp.initMenu();
    thisApp.initCart();
    thisApp.initBooking();
    thisApp.initCarousel();
  },
};
app.init();



