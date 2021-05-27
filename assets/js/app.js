/*VARIÁVEIS COM ELEMENTOS HTML */

/*SELECT COM OS PAISES DISPONÍVEIS PARA CONSULTA */
let optionCountries = document.querySelector('#select-country');

/*HTML ONDE APARECEM OS VALORES TOTAIS DE CADA OPÇÃO ESCOLHIDA */
const totalCases = document.querySelector('.total-cases span');
const totalDeaths = document.querySelector('.total-deaths span');
const totalRecoverys = document.querySelector('.total-recoverys span');

/*NOME DA OPÇÃO SELECIONADA PELO USUÁRIO */
const country = document.querySelectorAll('.world h3');

/*DADOS DE CADA OPÇÃO EM PORCENTAGEM */
const percentageCase = document.getElementById('cases');
const percentageDeaths = document.getElementById('deaths');
const percentageRocovered = document.getElementById('recovered');

/*BARRA DINÂMICA DO PERCENTUAL GERADO */
const barPercentageBlue = document.querySelector('.blue');
const barPercentageRed = document.querySelector('.red');
const barPercentageGreen = document.querySelector('.green');

/*DATA ATUAL */
const dataFormated = document.querySelector('.data');

/*VARIÁVEIS PARA SEGURAR DADOS GERADOS QUE IRAM PREENCHER O HTML */
let initialOption = 'Mundo'; //INCIA A APLICAÇÃO COM A OPÇÃO 'MUNDO' SELECIONADA
/*SEGURA A PORCENTAGEM CALCULADA E FORMATADA */
let casesFormated;
let deathsFormated;
let recoveredFormated;

/*FAZ A CHAMADA DA API PARA RECEBER A LISTAGEM COM OS PAISES DISPONÍVEIS PARA CONSULTA */
const totalCountries = 'https://api.covid19api.com/countries';
fetch(totalCountries)
    .then(resp => resp.json())
    .then(countryJson => {
        countryJson.forEach(item => {
            let option = document.createElement('OPTION');
            option.textContent = item.Country;
            optionCountries.appendChild(option);
            option.setAttribute('value', item.Slug)
        })
        optionCountries.addEventListener('change', () => {
            if (optionCountries.value === 'mundo') {
                initialState();
            } else {
                initialOption = optionCountries.value;
                dataComparisson(initialOption);
            }
        })
    })

/*INICIA COM OS DADOS MUNDIAIS */
function initialState(worldValue = 'Mundo') {
    const totalWorldwid = 'https://api.covid19api.com/world/total';
    fetch(totalWorldwid)
        .then(resp => resp.json())
        .then(totalWorld => {

            country.forEach(e => e.textContent = worldValue);

            casesFormated = Number(totalWorld.TotalConfirmed);
            deathsFormated = Number(totalWorld.TotalDeaths);
            recoveredFormated = Number(totalWorld.TotalRecovered);

            totalCases.textContent = (casesFormated).toLocaleString('pt-BR');
            totalDeaths.textContent = (deathsFormated).toLocaleString('pt-BR');
            totalRecoverys.textContent = (recoveredFormated).toLocaleString('pt-BR');

            percentageCase.textContent = '100';
            percentageDeaths.textContent = '100';
            percentageRocovered.textContent = '100';

            barPercentageBlue.style.width = '100%';
            barPercentageRed.style.width = '100%';
            barPercentageGreen.style.width = '100%';
        })
}

/*FAZ OS CÁUCULOS PARA RECEBER A PORCENTAGEM QUE CADA PAÍS REPRESENTA NOS DADOS MUNDIAIS */
function dataComparisson(data) {
    country.forEach((e) => e.textContent = data);
    let urlCountry = `https://api.covid19api.com/total/country/${data}`
    fetch(urlCountry)
        .then(resp => resp.json())
        .then(totalCountry => {
            let totalPerCountry = totalCountry[totalCountry.length - 1];
            let casesPerCountryFormated = Number(totalPerCountry.Active)
            let deathsPerCountryFormated = Number(totalPerCountry.Deaths)
            let recoveredPerCountryFormated = Number(totalPerCountry.Recovered)

            let casesPercentage = (casesPerCountryFormated / casesFormated) * 100;
            let deathsPercentage = (deathsPerCountryFormated / deathsFormated) * 100;
            let recoveredPercentage = (recoveredPerCountryFormated / recoveredFormated) * 100;

            totalCases.textContent = (casesPerCountryFormated).toLocaleString('pt-BR');
            totalDeaths.textContent = (deathsPerCountryFormated).toLocaleString('pt-BR');
            totalRecoverys.textContent = (recoveredPerCountryFormated).toLocaleString('pt-BR');

            percentageCase.textContent = casesPercentage.toFixed(3);
            percentageDeaths.textContent = deathsPercentage.toFixed(3);
            percentageRocovered.textContent = recoveredPercentage.toFixed(3);

            barPercentageBlue.style.width = `${casesPercentage.toFixed(2)}%`;
            barPercentageRed.style.width = `${deathsPercentage.toFixed(2)}%`;
            barPercentageGreen.style.width = `${recoveredPercentage.toFixed(2)}%`;
        })
}
initialState();



/*FORMATA A DATA */
function dataAtualFormatada() {
    var data = new Date(),
        dia = data.getDate().toString().padStart(2, '0'),
        mes = (data.getMonth() + 1).toString().padStart(2, '0'), //+1 pois no getMonth Janeiro começa com zero.
        ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}
dataFormated.textContent = dataAtualFormatada();



