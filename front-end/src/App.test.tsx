import "@testing-library/jest-dom";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it, vitest } from "vitest";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import App from "./App";
import currencies from "./assets/currencies.json";

describe("App", () => {
  let mockAxios: MockAdapter;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.restore();
  });

  it("should render the component correctly", async () => {
    mockAxios.onGet("http://localhost:8080/currencies").reply(200, currencies);

    const { getByText, getAllByText, getByLabelText, getByPlaceholderText } =
      render(<App />);

    expect(getByText("Conversor de Moeda")).toBeInTheDocument();
    expect(getByPlaceholderText("Valor a ser convertido")).toBeInTheDocument();
    expect(getByLabelText("Moeda de Origem")).toBeInTheDocument();
    expect(getByLabelText("Moeda de Destino")).toBeInTheDocument();

    const convertButton = getByText("Converter");

    expect(convertButton).toBeInTheDocument();
    expect(convertButton).toBeDisabled();

    await waitFor(() => {
      expect(getAllByText("Dólar Americano (USD)")[0]).toBeInTheDocument();
      expect(getAllByText("Real Brasileiro (BRL)")[0]).toBeInTheDocument();
    });
  });

  it("should show alert message when from select and to select are equal", () => {
    mockAxios.onGet("http://localhost:8080/currencies").reply(200, []);

    const alertError = vitest.fn();
    window.alert = alertError;

    const { getByPlaceholderText, getByTestId, getByText } = render(<App />);
    const valueInput = getByPlaceholderText("Valor a ser convertido");
    const fromSelect = getByTestId("from-select");
    const toSelect = getByTestId("to-select");
    const convertButton = getByText("Converter");
    waitFor(() => {
      fireEvent.input(valueInput, { target: { value: "100" } });
      fireEvent.change(fromSelect, {
        target: { value: "Real Brasileiro (BRL)" },
      });
      fireEvent.change(toSelect, {
        target: { value: "Real Brasileiro (BRL)" },
      });
      fireEvent.click(convertButton);
    });
    expect(alertError).toHaveBeenCalledWith(
      "As moedas devem possuir valores diferentes"
    );
    window.alert = alert;
  });

  it("should show error message when input value is invalid", async () => {
    mockAxios.onGet("http://localhost:8080/currencies").reply(200, currencies);

    const { getByPlaceholderText, getByText } = render(<App />);
    const valueInput = getByPlaceholderText("Valor a ser convertido");

    fireEvent.change(valueInput, { target: { value: "abc" } });

    await waitFor(() => {
      expect(getByText("valor inválido")).toBeInTheDocument();
      expect(getByText("Converter")).toBeDisabled();
    });
  });

  it("should convert currency correctly", async () => {
    mockAxios.onGet("http://localhost:8080/currencies").reply(200, currencies);

    mockAxios.onPost("http://localhost:8080/convert").reply(200, {
      conversionRate: 5.22,
    });

    const { getByText, getByPlaceholderText, getByTestId } = render(<App />);

    const valueInput = getByPlaceholderText("Valor a ser convertido");
    const convertButton = getByText("Converter");

    fireEvent.change(valueInput, { target: { value: "100" } });
    fireEvent.click(convertButton);

    expect(convertButton).toHaveTextContent("Convertendo...");

    const progressIndicator = getByTestId("progress-indicator");
    expect(progressIndicator).toBeInTheDocument();

    await waitFor(() => {
      expect(convertButton).toHaveTextContent("Converter");
      expect(convertButton).toBeDisabled();
      expect(getByTestId("result-message")).toBeInTheDocument();
      expect(getByTestId("result-message")).toHaveTextContent(
        "100 em Dólar Americano (USD) equivale a 522.00 em Real Brasileiro (BRL)"
      );
      expect(progressIndicator).not.toBeInTheDocument();
      expect(valueInput).toHaveFocus();
    });
  });
});
