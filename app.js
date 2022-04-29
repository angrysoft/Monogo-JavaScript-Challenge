'use strict';
const https = require('https');

const options = {
  hostname: 'www.monogo.pl',
  port: 443,
  path: '/competition/input.txt',
  method: 'GET',
};

const req = https.request(options, res => {
  let stringData = "";
  res.on('data', d => {
    stringData += d;
  });

  res.on('end', () => {
    makeTask(stringData);
  });
});

req.on('error', error => {
  console.error(error);
});

req.end();


class Products {
    constructor() {
        this.products = {};
    }

    loadFromString(data) {
        const _data = JSON.parse(data);
        _data.products.forEach(element => {
            const id = element.id.toString();
            this.products[id] = {
              id: id,
              price: element.price,
              size: [],
              color: []
            }
        });

        _data.colors.map((el) => this._appendProperty("color", el));
        _data.sizes.map((el) => this._appendProperty("size", el));
    }

    _appendProperty(propName, prop) {
        const id = prop.id.toString();
        if (this.products.hasOwnProperty(id)) {
            this.products[id][propName].push(prop.value)
        }
    }

    productsExpensiveThan(price) {
        let results = [];
        Object.entries(this.products).forEach(([key, value]) => {
          (value.price > price) && results.push(value);
        });
        return results.sort((a, b) => {return a.price - b.price} );
    }

}


function makeTask(stringData) {
  const products = new Products();
  products.loadFromString(stringData);
  let filteredProducts = products.productsExpensiveThan(200);

  const minPrice = filteredProducts.at(0).price;
  const maxPrice = filteredProducts.at(-1).price;

  const minMaxMultiplication = Math.round(minPrice * maxPrice);

  const sumOfArray = getSumOfArray(minMaxMultiplication);

  // ul. Nałęczowska 14,
  // 20-701 Lublin
  const monogoAddressIndex = 14;


  // Wynik będzie rezultatem mnożenia indeksu numeru lubelskiego biurowca Monogo w tablicy z punktu 5, wartości, którą otrzymałeś w punkcie 4, oraz długości nazwy firmy "Monogo"
  console.log("ostatni punkt jest troche niezrozumiały chodzi o \"mnożenia indeksu numeru lubelskiego biurowca Monogo w tablicy z punktu 5\" wiec nie wiem czy go poprawnie zinterpretowałem");
  let result = (sumOfArray.length - 1) * monogoAddressIndex * minMaxMultiplication * "Monogo".length;
  console.log(result);
}

function getSumOfArray(inNumber) {
  let result = [];
  inNumber.toString().split("").forEach((e, i, arr) => {
    if (i % 2 !== 0) {
      result.push(Number(arr[i]) + Number(arr[i - 1]));
    }
  });
  return result;
}

