import Logo from "../assets/exchange-rate.png";
import Select from "./Select";
import { LuArrowRightLeft } from "react-icons/lu";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Currency } from "../types/currency";
import axios from "axios";
import { currencyToLocale } from "../utils/currencyLocale";

interface RequestDto {
  from: string;
  to: string;
}

interface ResponseDto {
  conversionRate: number;
  timestamp?: Date;
  message?: string;
}

export default function CurencyConverter() {
  const [value, setValue] = useState(1);
  const [convertedValue, setConvertedValue] = useState(0.0);
  const [conversionRate, setConvertionRate] = useState(0);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [isInverted, setIsInverted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCurrenciesChanged, setHasCurrenciesChanged] = useState(true);

  const [requestDto, setRequestDto] = useState<RequestDto>({
    from: "BRL",
    to: "USD",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    axios
      .get<Currency[]>(`${import.meta.env.VITE_API_URL}/currencies`)
      .then((response) => {
        if (response.status === 200) {
          setCurrencies(response.data);
          return;
        }

        throw new Error("Erro ao tentar conectar com a API");
      })
      .catch(() => {
        setErrorMessage("Erro ao tentar conectar com a API");
        setCurrencies([]);
      });
  }, []);

  useEffect(() => {
    if (conversionRate > 0) {
      if (!isInverted) setConvertedValue(value * conversionRate);
      else setConvertedValue(value / conversionRate);
    }
  }, [value, isInverted, conversionRate]);

  const handleInvertCurrency = () => {
    setIsRotating(() => true);
    setIsInverted((prev) => {
      const { from, to } = requestDto;
      const newFrom = to;
      const newTo = from;
      setRequestDto((prev) => {
        return { ...prev, from: newFrom, to: newTo };
      });

      return !prev;
    });
  };

  const handleConvert = async () => {
    if (requestDto.from === requestDto.to) return;

    if (!hasCurrenciesChanged) return;

    setErrorMessage("");
    setIsInverted(false);
    setIsLoading(true);

    try {
      const response = await axios.post<ResponseDto>(
        `${import.meta.env.VITE_API_URL}/convert`,
        requestDto,
      );

      const rate = response.data.conversionRate;

      setConvertionRate(rate);

      if (rate > 0) {
        setConvertedValue(() => value * rate);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
      setHasCurrenciesChanged(false);
    }
  };

  return (
    <main className="flex flex-row items-center justify-center w-dvw h-dvh">
      <section className="flex flex-col items-center justify-center gap-y-2 w-full mx-4 max-w-175 shadow-xl rounded-2xl border border-gray-300 p-4">
        <img
          className="text-center"
          src={Logo}
          width={64}
          height={64}
          alt="Logo do APp"
        />
        <h1 data-testid="app-title" className="text-3xl font-bold">
          Currency Converter
        </h1>
        <input
          data-testid="value-input"
          className="p-2 border border-gray-300 rounded-md w-full my-2 outline-blue-400"
          type="number"
          name="value"
          id="value"
          value={value}
          onChange={(e) => setValue(+e.target.value)}
          placeholder="Valor a ser convertido"
        />
        {/* #region select currency */}
        <div className="flex flex-col w-full items-stretch gap-2 lg:gap-3">
          <Select
            label="Moeda de Origem"
            currencies={currencies}
            selectedCurrency={requestDto.from}
            onSelectChange={(currency) => {
              if (requestDto.from !== currency) {
                setConvertionRate(0);
                setRequestDto((dto) => ({ ...dto, from: currency }));
                setHasCurrenciesChanged(true);
              }
            }}
            testId="from-select"
          />
          <button
            data-testid="inverter-button"
            className="flex items-center justify-center cursor-pointer p-2 min-w-full lg:min-w-10 lg:min-h-10 border-2 border-blue-400 bg-blue-100 hover:bg-blue-200 transition-colors duration-150 rounded-full"
            title="inverter moeda"
            onClick={handleInvertCurrency}
            type="button"
          >
            {" "}
            {isRotating ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.3 }}
                onAnimationComplete={() => setIsRotating(false)}
              >
                <LuArrowRightLeft className="text-blue-400 font-bold rotate-90" />
              </motion.div>
            ) : (
              <LuArrowRightLeft className="text-blue-400 font-bold rotate-90" />
            )}
          </button>
          <Select
            label="Moeda de Destino"
            selectedCurrency={requestDto.to}
            currencies={currencies}
            onSelectChange={(currency) => {
              if (requestDto.to !== currency) {
                setConvertionRate(0);
                setRequestDto((dto) => ({ ...dto, to: currency }));
                setHasCurrenciesChanged(true);
              }
            }}
            testId="to-select"
          />
        </div>
        {/* #endregion */}
        <AnimatePresence initial={false}>
          {errorMessage ? (
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full mt-2"
            >
              <p
                data-testid="error-message"
                className="border border-red-500 bg-red-300 w-full text-center text-red-700 rounded-md py-2"
              >
                {errorMessage}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <button
          data-testid="convert-button"
          className="text-white bg-blue-400 hover:bg-blue-500 disabled:bg-gray-400 disabled:cursor-default transition-colors mt-2 duration-300 cursor-pointer py-2 w-full font-medium text-lg rounded-md"
          type="button"
          disabled={
            value <= 0 ||
            requestDto.from === requestDto.to ||
            !!errorMessage ||
            isLoading
          }
          onClick={handleConvert}
        >
          {isLoading ? "Convertendo..." : "Converter"}
        </button>
        {conversionRate > 0 && (
          <p data-testid="result" className="text-3xl font-medium mt-2">
            {isLoading
              ? "Carregando..."
              : `${Intl.NumberFormat(currencyToLocale(requestDto.from), {
                  style: "currency",
                  currency: requestDto.from,
                }).format(value)} = ${Intl.NumberFormat(
                  currencyToLocale(requestDto.to),
                  {
                    style: "currency",
                    currency: requestDto.to,
                    maximumFractionDigits: 4,
                  },
                ).format(convertedValue)}`}
          </p>
        )}
      </section>
    </main>
  );
}
