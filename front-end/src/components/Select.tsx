import { Currency } from "../types/currency";

interface SelectProps {
  label: string;
  testId: string;
  selectedCurrency: string;
  currencies: Currency[];
  onSelectChange: (currency: string) => void;
}

export default function Select({
  label,
  testId,
  selectedCurrency,
  currencies,
  onSelectChange,
}: SelectProps) {
  return (
    <div className="w-full">
      <label className="block font-semibold text-lg mb-1" htmlFor={label}>
        {label}
      </label>
      <select
        data-testid={testId}
        className="border border-gray-300 outline-blue-400 p-2 w-full rounded-md"
        name={label}
        value={selectedCurrency}
        onChange={(e) => onSelectChange(e.target.value)}
        id={label}
      >
        {currencies.map((currency) => (
          <option key={currency.currency} value={currency.currency}>
            {`${currency.currency} - ${currency.currencyName}`}
          </option>
        ))}
      </select>
    </div>
  );
}
