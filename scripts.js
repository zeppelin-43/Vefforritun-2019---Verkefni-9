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

  function cleanUp(){
    while (results.firstChild) {
      results.removeChild(results.firstChild);
    }
  }

  function displayCompany(companiesList) {
    console.log("Display company");
    if (companiesList.length === 0) {
      displayError('Fann ekki fyrirtæki');
      return;
    }

    
    cleanUp();
   
    for (let i = 0; i < companiesList.length; i++) {
    const company = companiesList[i];
    const div = newElement('div');

    const name = company.name;
    const sn = company.sn;
    const active = company.active;
    const address = company.address;

    const dl = newElement('dl', null);
    const dtName = newElement('dt', 'Lén');
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
    }
    else
    {
     div.className = 'company company--inactive';
    }
    div.appendChild(dl);
    results.appendChild(div);
    
    
    }
  }



  function displayError(error) {
    const container = companies.querySelector('.results');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(document.createTextNode(error));
  }


  function loading() {
    cleanUp();
    var div = newElement('div');
    div.className = 'loading';

    var img = newElement('img');
    img.setAttribute('src', 'loading.gif');

    div.appendChild(img);
    results.appendChild(div);
  }

   function fetchData(number) {
    
  

    const url = API_URL + number;
    console.log(url);
    console.log("Fetch data");

    loading();
    fetch(`${API_URL}${number}`)
      .then((response) => {
        console.log(response);
        if (response.ok) {
          console.log("response.ok");
          return response.json();
        }
        console.log("Throw error");
        throw new Error('Villa kom upp');
      })
      .then((data) => {
        console.log("then data");
        displayCompany(data.results);
      })
      .catch((error) => {
        displayError('Villa!');
        console.log('error');
        console.error(error);
      })

  }

  function onSubmit(e) {
    e.preventDefault();

    var trimmed = input.value.trim(); // Fjarlægir öll bil vinstra og hægra megin við textann
    if(trimmed !== '')
      fetchData(input.value);
    else 
      displayError('Fyrirtæki verður að vera strengur');
    

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
