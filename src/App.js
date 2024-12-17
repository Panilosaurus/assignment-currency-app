import { useEffect, useState } from "react";
import styles from "./App.module.css";

// NOTES: Input Api Key kalian pada variable `API_KEY`. Dapatkan Api Key kalian dengan cara melakukan registrasi pada link berikut `https://currencyfreaks.com/`
const API_KEY = "30eea0f16aa948c9b1be990cd944c3b7";

const API_URL = `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${API_KEY}`;

function App() {
  const [currencies, setCurrencies] = useState({});

  const getPercentageValue = (numStr, percentage) => {
    const num = parseFloat(numStr);

    return (num * percentage) / 100;
  };

  const getPurchaseRate = (exchangeRate, percentage) => {
    return parseFloat(exchangeRate) + percentage;
  };

  const getSellRate = (exchangeRate, percentage) => {
    return parseFloat(exchangeRate) - percentage;
  };

  const formatApiData = (apiResult) => {
    const preferredCurrency = ["CAD", "EUR", "IDR", "JPY", "CHF", "GBP"]

    const result = {
      curr: {
        title: "Currency",
        values: [],
      },
      purchaseRate: {
        title: "We Buy",
        values: [],
      },
      exchangeRate: {
        title: "Exchange Rate",
        values: [],
      },
      sellRate: {
        title: "We Sell",
        values: [],
      },
    };

    for (const key in apiResult.rates) {
      if (preferredCurrency.includes(key)) {
        result.curr.values.push(key);
        result.exchangeRate.values.push(apiResult.rates[key]);

        const percentage = getPercentageValue(apiResult.rates[key], 5);

        const purchaseRate = getPurchaseRate(apiResult.rates[key], percentage);

        const sellRate = getSellRate(apiResult.rates[key], percentage);

        result.purchaseRate.values.push(purchaseRate);
        result.sellRate.values.push(sellRate);
      }
    }

    setCurrencies(result);
    /*
      Function ini masih belum lengkap. Cara melengkapinya adalah kita harus mengisi variable `result` dengan data-data
      yang kita dapatkan dari api `currencyfreaks`, kemudian kita harus mengisi useState `currencyfreaks` dengan variable `result`. 

      Jika kalian perhatikan, function ini dipanggil di dalam function `fetchCurrencyData`,
      dan langsung diberikan data dari api `currencyfreaks`. 
      
      Maka dari itu, temukanlah cara agar funciton ini mampu memformat data-data dari api `currencyfreaks`.
      Jangan lupa untuk memasukkan data-data dari api `currencyfreaks` ke variable `result`. 
      Jika sudah, isilah useState `currencies` dengan variable `result` yang telah berisikan data-data dari api `currencyfreaks`.
    */
  };

  // Notes: Panggil function `fetchCurrencyData` pada saat initial render. Kira-kira hooks apa yang bisa kita gunakan?
  const fetchCurrencyData = async () => {
    try {
      const res = await fetch(API_URL);

      if (!res.ok) {
        const respJson = await res.json();
        throw respJson;
      }

      const result = await res.json();

      formatApiData(result);
    } catch (error) {
      console.error("[fetchCurrencyData]:", error);
    }
  };

  useEffect(() => {
    fetchCurrencyData();
  })

  return (
    <main className={styles.main}>
      <section className={styles.container}>
        {
          Object.keys(currencies).map((section) => {
            return (
              <div key={section} style={{ width: "100%" }}>
                <h1 style={{ color: "white", marginBottom: "10px" }}>{currencies[section].title}</h1>
                {
                  currencies[section].values.map((value, index) => {
                    return (
                      <div key={`${value}-${index}`}>
                        <p style={{ marginBottom: "5px", color: "white" }}>{value}</p>
                      </div>
                    );
                  })
                }
              </div>
            )
          })
        }
      </section>
      <p style={{ marginTop: "20px", color: "white", textAlign: "center" }}>
        Rates are based from 1 USD
        <br></br>
        This Application uses API from https://currencyfreaks.com
      </p>

    </main>
  );
}

export default App;
