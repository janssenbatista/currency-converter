import React, { useEffect, useRef, useState } from "react";
import logo from "./assets/exchange-rate.png";
import "./App.css";
import axios, { AxiosError } from "axios";

interface Currency {
  currencyName: string;
  currency: string;
}

interface ApiRequest {
  from: string;
  to: string;
}

interface ApiResponse {
  conversionRate: number;
}

function App() {
  const valueInputRef = useRef<HTMLInputElement>(null);
  const fromSelectRef = useRef<HTMLSelectElement>(null);
  const toSelectRef = useRef<HTMLSelectElement>(null);

  const [value, setValue] = useState("");
  const [convertButtonText, setConvertButtonText] = useState("Converter");
  const [isValidInput, setValidInput] = useState(true);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [result, setResult] = useState("");
  const [apiRequest, setApiRequest] = useState<ApiRequest>({
    from: "Dólar Americano (USD)",
    to: "Real Brasileiro (BRL)",
  });
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    async function getCurrencies() {
      try {
        const response = await axios.get<Currency[]>(
          "http://localhost:8080/currencies"
        );
        if (response.status === 200) {
          setCurrencies(response.data);
        }
        if (currencies.length) {
          console.log(currencies);
        }
      } catch (e: any) {
        console.error(e);
      }
    }
    getCurrencies();
  }, []);

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const { value } = event.target;
    if (!value) {
      setResult("");
    }
    setValue(value.trim());
    validateInput(value);
  };

  const handleSelectChange: React.ChangeEventHandler<HTMLSelectElement> = (
    event
  ) => {
    const { value } = event.target;
    event.target.id === "from"
      ? setApiRequest({ ...apiRequest, from: value })
      : setApiRequest({ ...apiRequest, to: value });
  };

  const handleConvert = async () => {
    if (!value) {
      alert("Preencher o campo de valor");
      if (valueInputRef.current) {
        valueInputRef.current.focus();
      }
      return;
    }

    if (apiRequest.from === apiRequest.to) {
      alert("As moedas devem possuir valores diferentes");
      return;
    }

    setResult("");
    setConvertButtonText("Convertendo...");
    setLoading(true);

    let requestBody: ApiRequest = { from: "", to: "" };

    if (fromSelectRef.current && toSelectRef.current) {
      const from = currencies.find(
        (c) =>
          c.currencyName === removeCurrencySymbol(fromSelectRef.current!.value)
      )?.currency;

      const to = currencies.find(
        (c) =>
          c.currencyName === removeCurrencySymbol(toSelectRef.current!.value)
      )?.currency;

      requestBody = {
        from: from!,
        to: to!,
      };
    }

    try {
      const response = await axios.post<ApiResponse>(
        "http://localhost:8080/convert",
        requestBody
      );

      if (response.status === 200) {
        const convertionRate: number = (response.data as ApiResponse)
          .conversionRate;
        const conversionResult = (
          Number.parseFloat(value) * convertionRate
        ).toFixed(2);
        setResult(
          `${value} em ${apiRequest.from} equivale a ${conversionResult} em ${apiRequest.to}`
        );
      }
    } catch (e: AxiosError | any) {
      console.error((e as AxiosError).response?.data);
    } finally {
      setValue("");
      setLoading(false);
      setConvertButtonText("Converter");
      if (valueInputRef.current) valueInputRef.current.focus();
    }
  };

  function validateInput(value: string) {
    var regex = /^(\d+)([.,](\d)+)?$/;
    setValidInput(regex.test(value));
  }

  function removeCurrencySymbol(currency: string): string {
    return currency.replace(/\([A-Z]{3}\)/, "").trim();
  }

  return (
    <main>
      <div className="logo-container">
        <img src={logo} className="logo" alt="logo do aplicativo" />
      </div>
      <h1 className="title">Conversor de Moeda</h1>

      <input
        value={value}
        ref={valueInputRef}
        onChange={handleInputChange}
        type="text"
        className="input"
        name="value-input"
        id="value-input"
        placeholder="Valor a ser convertido"
      />
      {!isValidInput && value && (
        <p className="error-message">valor inválido</p>
      )}
      <div id="select-container">
        <div className="select-item">
          <label className="select-item__label" htmlFor="from">
            Moeda de Origem
          </label>
          <select
            name="from"
            id="from"
            data-testid="from-select"
            ref={fromSelectRef}
            value={apiRequest.from}
            onChange={handleSelectChange}
          >
            {currencies.length &&
              currencies.map((c) => (
                <option
                  key={c.currency}
                >{`${c.currencyName} (${c.currency})`}</option>
              ))}
          </select>
        </div>
        <div className="select-item">
          <label className="select-item__label" htmlFor="from">
            Moeda de Destino
          </label>
          <select
            name="to"
            id="to"
            data-testid="to-select"
            ref={toSelectRef}
            value={apiRequest.to}
            onChange={handleSelectChange}
          >
            {currencies.length &&
              currencies.map((c) => (
                <option
                  key={c.currency}
                >{`${c.currencyName} (${c.currency})`}</option>
              ))}
          </select>
        </div>
      </div>

      <button
        id="convert-button"
        disabled={!value.trim() || !isValidInput}
        onClick={handleConvert}
      >
        {convertButtonText}
      </button>
      {isLoading && (
        <div className="progress-container">
          <div className="progress" data-testid="progress-indicator"></div>
        </div>
      )}
      {result && (
        <p className="result-message" data-testid="result-message">
          {result}
        </p>
      )}
    </main>
  );
}

export default App;
