import * as Operators from "./constants.js";

class Calculator {
  constructor() {
    const localData = localStorage.getItem("calculator");
    const initialValues = localData
      ? JSON.parse(localData)
      : null;

    if (initialValues) {
      this.initialValue = initialValues.initialValue;
      this.input = initialValues.input;
      this.history = initialValues.history;
      this.shouldInputModifyValue = initialValues.shouldInputModifyValue;
      this.operator = initialValues.operator;
      this.shouldCalculatorReset = initialValues.shouldCalculatorReset;
    } else {
      this._reset();
    }
  }

  _reset() {
    this.initialValue = 0;
    this.input = "0"; // display in display field
    this.history = ""; // display in history field
    this.operator = "";
    this.shouldInputModifyValue = false;
    this.operator = "";
    this.shouldCalculatorReset = false;
  }

  _storeData = () => {
    localStorage.setItem("calculator", JSON.stringify({
      initialValue: this.initialValue,
      input: this.input,
      history: this.history,
      shouldInputModifyValue: this.shouldInputModifyValue,
      operator: this.operator,
      shouldCalculatorReset: this.shouldCalculatorReset
    }));
  };

  remove() {
    if (!this.shouldInputModifyValue) {
      this.input = (this.input.length === 1)
        ? "0"
        : this.input.slice(0, -1);
    }

    this._storeData();

    return this.input;
  }

  _trailingZeros(number) {
    return number.replace(/\.0*$/g, "");
  }

  _leadingZeros(number) {
    return number.replace(/^0+(?=\d)/, '');
  }

  _seperateThousandsWithComma(number) {
    return number.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }

  _removeComma(number) {
    return number.replace(/,/g, "");
  }

  _replaceSubtractSymbol(number) {
    let subtractRegex = new RegExp(Operators.SUBTRACT);

    return number.replace(subtractRegex, "-");
  }

  _trailingComma(number) {
    return number.replace(/,$/, "");
  }

  _preformat(number) {
    /**
     * 346436.547574 => 346,436.547574
     * 0000043.00000 => 43.00000
     * 10.234000 => 10.234
     */
    number = number.toString();
    number = this._removeComma(number);
    number = this._leadingZeros(number);
    number = this._seperateThousandsWithComma(number);

    return number;
  }

  setInput(value) {
    if (this.shouldInputModifyValue) {
      this.input = "0";
      this.shouldInputModifyValue = false;
    }

    if (value === "."
      && this.input.indexOf(".") !== -1
    ) {
      this.input = this._preformat(this.input);
    } else {
      this.input = this._preformat(this.input + value);
    }

    this._storeData();

    return this.input;
  }

  setNegativeInput() {
    this.input = this.input[0] !== Operators.SUBTRACT
      ? `${Operators.SUBTRACT}${this.input}`
      : this.input.slice(1);
    this._storeData();

    return this.input;
  }

  clear() {
    this._reset();
    this._storeData();

    return [this.history, this.input];
  }

  _parse(number) {
    /**
     * 346436.547574 => 346436.547574
     * 43.00000 => 43
     * −43 => -43
     */

    number = this._replaceSubtractSymbol(number);
    number = this._removeComma(number);

    return number;
  }

  _format(number) {
    number = this._trailingZeros(number);
    number = this._trailingComma(number);

    return number;
  }

  _calculate(initialValue, currentValue, operator) {
    let result;

    switch (operator) {
      case Operators.ADD:
        result = this._add(initialValue, currentValue);
        break;
      case Operators.SUBTRACT:
        result = this._subtract(initialValue, currentValue);
        break;
      case Operators.MULTIPLE:
        result = this._multiple(initialValue, currentValue);
        break;
      case Operators.DIVIDE:
        result = this._divide(initialValue, currentValue);
        break;
      case Operators.MODULO:
        result = this._modulo(initialValue, currentValue);
        break;
      default:
        result = "How about this?";
    }

    return isNaN(result)
      ? {status: "error", result}
      : {status: "success", result};
  }

  evaluate(symbol) {
    this.input = this._format(this.input);
    this.shouldInputModifyValue = true;

    if (this.operator === "") {
      this.history = `${this.input} ${symbol}`;
      this.operator = symbol;
      this.initialValue = Number(this._parse(this.input));

      return [this.input, this.history];
    }

    let calculatedValue = this._calculate(this.initialValue, this._parse(this.input), this.operator);
    this.operator = symbol;

    if (calculatedValue.status === "error") {
      this.initialValue = 0;
      this.history = `${this.history} ${this.input}`;
      this.shouldCalculatorReset = true;
    } else {
      this.initialValue = calculatedValue.result;
      this.history = `${this.history} ${this.input} ${symbol}`;
      calculatedValue.result = this._preformat(calculatedValue.result);
    }

    this.input = this._preformat(this.initialValue);
    this._storeData();

    return [calculatedValue.result, this.history];
  }

  equal() {
    this.input = this._format(this.input);
    this.shouldInputModifyValue = true;
    let calculatedValue = this._calculate(this.initialValue, this._parse(this.input), this.operator);
    this.history = `${this.history} ${this.input}`;
    this.operator = "";

    if (calculatedValue.status === "error") {
      this.initialValue = 0;
      this.input = "0";
      this.shouldCalculatorReset = true;
    } else {
      this.initialValue = calculatedValue.result;
      this.input = this._preformat(this.initialValue);
      calculatedValue.result = this._preformat(calculatedValue.result);
    }

    this._storeData();

    return [calculatedValue.result, this.history];
  }

  _add(param1, param2) {
    return (Number(param1) * 10 + Number(param2) * 10) / 10;
  }

  _subtract(param1, param2) {
    return (Number(param1) * 10 - Number(param2) * 10) / 10;
  }

  _multiple(param1, param2) {
    return (Number(param1) * 10 * Number(param2) * 10) / 100;
  }

  _divide(param1, param2) {
    return (param2 == 0) 
      ? "Cannot devide by zero" 
      : ((Number(param1) * 10 / Number(param2) * 10) / 100);
  }

  _modulo(param1, param2) {
    return (param2 == 0) 
      ? "Cannot devide by zero" 
      : (Number(param1) % Number(param2));
  }
}

export default Calculator;