const API_URL = 'https://apis.is/company?name=';

/**
 * Leit að fyrirtækjum á Íslandi gegnum apis.is
 */
const program = (() => {
  let companies;
  let input;
  let results;


  function newElement(type, text) {
    const el = document.createElement(type);
    if (typeof text === 'string') {
      el.appendChild(document.createTextNode(text));
    } else if (text) {
      el.appendChild(text);
    }
    return el;
  }

  function cleanUp() {
    while (results.firstChild) {
      results.removeChild(results.firstChild);
    }
  }

  function displayError(error) {
    const container = companies.querySelector('.results');

    cleanUp();

    container.appendChild(document.createTextNode(error));
  }

  function displayCompany(companiesList) {
    if (companiesList.length === 0) {
      displayError('Ekkert fyrirtæki fannst fyrir leitarstreng');
      return;
    }


    cleanUp();

    let name;
    let sn;
    let active;
    let address;

    for (let i = 0; i < companiesList.length; i += 1) {
      const company = companiesList[i];
      const div = newElement('div');

      name = company.name;
      sn = company.sn;
      active = company.active;
      address = company.address;

      const dl = newElement('dl', null);
      const dtName = newElement('dt', 'Nafn');
      const ddName = newElement('dd', name);
      dl.appendChild(dtName);
      dl.appendChild(ddName);

      const dtSN = newElement('dt', 'Kennitala');
      const ddSN = newElement('dd', sn);
      dl.appendChild(dtSN);
      dl.appendChild(ddSN);

      if (active === 1) {
        const dtaddress = newElement('dt', 'Heimilisfang');
        const ddaddress = newElement('dd', address);
        dl.appendChild(dtaddress);
        dl.appendChild(ddaddress);
        div.className = 'company company--active';
      } else {
        div.className = 'company company--inactive';
      }
      div.appendChild(dl);
      results.appendChild(div);
    }
  }


  function loading() {
    cleanUp();
    const div = newElement('div');
    div.className = 'loading';

    const img = newElement('img');
    img.setAttribute('src', 'loading.gif');

    const text = document.createTextNode('Leita að fyrirtækjum...');
    div.appendChild(img);
    div.appendChild(text);
    results.appendChild(div);
  }

  function fetchData(number) {
    loading();
    fetch(`${API_URL}${number}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Villa við að sækja gögn');
      })
      .then((data) => {
        displayCompany(data.results);
      })
      .catch((error) => {
        displayError('Villa!');
        console.error(error); /* eslint-disable-line */
      });
  }

  function onSubmit(e) {
    e.preventDefault();
    const trimmed = input.value.trim(); // Fjarlægir öll bil vinstra og hægra megin við textann
    if (trimmed !== '') {
      fetchData(input.value);
    } else {
      displayError('Fyrirtæki verður að vera strengur');
    }
  }

  function init(_companies) {
    companies = _companies;

    const form = companies.querySelector('form');
    form.addEventListener('submit', onSubmit);
    input = form.querySelector('input');
    results = companies.querySelector('.results');
  }


  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const companies = document.querySelector('section');
  program.init(companies);
});
