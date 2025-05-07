async function fetchCurrencies() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const countries = await response.json();

        const currencyOptions = countries
            .filter(country => country.currencies)
            .map(country => {
                const currencyCode = Object.keys(country.currencies)[0];
                const flagUrl = country.flags?.png || '';
                return {
                    currencyCode,
                    flagUrl,
                    countryName: country.name.common
                };
            });

        populateDropdown('fromCurrency', currencyOptions);
        populateDropdown('toCurrency', currencyOptions);

        // Update flags after dropdowns are populated
        setTimeout(() => {
            updateFlag('from');
            updateFlag('to');
        }, 300);
    } catch (error) {
        console.error('Error fetching currencies:', error.message);
    }
}

function populateDropdown(dropdownId, options) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = options
        .map(
            opt =>
                `<option data-flag="${opt.flagUrl}" value="${opt.currencyCode}">
                    ${opt.countryName} (${opt.currencyCode})
                </option>`
        )
        .join('');
}

function updateFlag(type) {
    const select = document.getElementById(`${type}Currency`);
    const flag = select.options[select.selectedIndex].dataset.flag;
    document.getElementById(`${type}Flag`).src = flag;
}

async function getExchangeRate(event) {
    event.preventDefault();
    const from = document.getElementById('fromCurrency').value;
    const to = document.getElementById('toCurrency').value;
    const msg = document.getElementById('msg');

    if (from === to) {
        msg.textContent = 'Please select different currencies.';
        msg.style.color = 'red';
        return;
    }

    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
        const data = await response.json();

        const rate = data.rates[to];
        if (rate) {
            msg.textContent = `1 ${from} = ${rate} ${to}`;
            msg.style.color = 'lightgreen';
        } else {
            msg.textContent = `Exchange rate not available.`;
            msg.style.color = 'red';
        }
    } catch (error) {
        msg.textContent = `Error fetching rate.`;
        msg.style.color = 'red';
    }
}

fetchCurrencies();
