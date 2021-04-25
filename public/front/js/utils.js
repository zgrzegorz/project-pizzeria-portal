/* global Handlebars, dataSource */

export const utils = {}; // eslint-disable-line no-unused-vars

utils.createDOMFromHTML = function (htmlString) {
  let div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  console.log(div);
  return div.firstChild; // z tego diva pobierz pierwsze dziecko czyli <article> oraz <li>
};

utils.createPropIfUndefined = function (obj, key, value = []) {
  if (!obj.hasOwnProperty(key)) {
    obj[key] = value;
  }
};

utils.serializeFormToObject = function (form) {
  let output = {};
  if (typeof form == 'object' && form.nodeName == 'FORM') {
    console.log('form', form.elements);
    for (let field of form.elements) { // field to pojedyńczy input lub select
      if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
        if (field.type == 'select-multiple') {
          for (let option of field.options) {
            if (option.selected) {
              utils.createPropIfUndefined(output, field.name);
              output[field.name].push(option.value);
            }
          }
        } else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
          utils.createPropIfUndefined(output, field.name);
          output[field.name].push(field.value);
        } else if (!output[field.name]) output[field.name] = [];
      }
    }
  }
  return output;
};

utils.queryParams = function (params) {
  return Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');
};

utils.convertDataSourceToDbJson = function () {
  const productJson = [];
  for (let key in dataSource.products) {
    console.log(dataSource.products);
    console.log(dataSource.products[key]);
    productJson.push(Object.assign({ id: key }, dataSource.products[key]));
  }

  console.log(JSON.stringify({ product: productJson, order: [] }, null, '  '));
};

utils.numberToHour = function (number) {
  //console.log(number, Math.floor(number));
  return (Math.floor(number) % 24) + ':' + (number % 1 * 60 + '').padStart(2, '0');
};

utils.hourToNumber = function (hour) {
  const parts = hour.split(':'); //utworzy z ciągu znakowego tablicę pojedynczych znaków likwidując separator ['16','00']
  console.log(parts, parseInt(parts[0]), parseInt(parts[1]) / 60);
  return parseInt(parts[0]) + parseInt(parts[1]) / 60;
};

//funkcja otrzymuje obiekt daty i na tym obiekcie daty za pomocą metody .toISOString()
//konwertuję datę na ciąg znakowy formatu rr-mm-dd i wycina wszystko między indeksem 0 a 10 bez 10
utils.dateToStr = function (dateObj) {
  console.log(dateObj);
  // console.log(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), dateObj.getHours(), dateObj.getMinutes(), dateObj.getSeconds());
  return dateObj.toISOString().slice(0, 10);
};

utils.addDays = function (dateStr, days) {
  const dateObj = new Date(dateStr); // na podstawie przekazanego obiektu daty tworzy nowy obiekt daty na nim wywołuje metodę ustaw datę
  dateObj.setDate(dateObj.getDate() + days); // polegającą na dodaniu do dni pobranego obiektu daty liczby 14 i ustawienie nowej daty którą zwraca
  return dateObj;
};

Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

/*nowy moduł pomocniczy do szablonów*/
Handlebars.registerHelper('joinValues', function (input, options) {
  return Object.values(input).join(options.fn(this));
});
