import * as Operators from "./constants.js";

class Calculator {
  constructor() {
    this.initialValue = 0;
    this.input = "0"; // display in display field
    this.history = ""; // display in history field
    this.operator = "";
    this.isReadyForNewInput = true;
    this.isReadyForCalculate = false;
  }

  _reset() {
    this.initialValue = 0;
    this.input = "0";
    this.history = "";
  }

  getInitialValue() {
    return this._format(this.initialValue);
  }

  remove() {
    this.input = (this.input.length === 1)
      ? "0"
      : this.input.slice(0, -1);
    
    return this.input;
  }

  _trailingZeros(number) {
    return number.replace(/\.0*$/g, "");
  }

  _format(number) {
    /**
     * 346436.547574 => 346,436.547574
     * 0000043.00000 => 43.00000
     * 10.234000 => 10.234
     */
    number = number.toString();
    number = number.replace(/,/g, "");
    number = number.replace(/^0+(?=\d)/, '');
    number = number.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

    return number;
  }

  setInput(value, negative = false) {
    if (this.isReadyForNewInput) {
      this.input = "";
      this.isReadyForNewInput = false;
    }

    if (negative) {
      this.input = this.input[0] !== Operators.SUBTRACT
        ? `${Operators.SUBTRACT}${this.input}`
        : this.input.slice(1);
    } else {
      this.input = this._format(this.input + value);
    }

    return this.input;
  }

  clear() {
    this._reset();

    return [this.history, this.input];
  }

  _parse(number) {
    /**
     * 346436.547574 => 346436.547574
     * 43.00000 => 43
     */

    return number.replace(/,/g, "");
  }

  calculate(operator) {
    let result = "";
    let input = this._trailingZeros(this.input);
    this.history = `${this.history} ${input} ${operator}`;
    this.isReadyForNewInput = true;
    
    if (!this.isReadyForCalculate) {
      this.operator = operator;
      this.initialValue = this.input;
      this.isReadyForCalculate = true;

      return [input, this.history];
    }

    // if (this.isReadyForNewInput)

    input = this._parse(this.input);

    switch (this.operator) {
      case Operators.ADD:
        result = this._add(this.initialValue, input);
        break;
      case Operators.SUBTRACT:
        result = this._subtract(this.initialValue, input);
        break;
      case Operators.MULTIPLE:
        result = this._multiple(this.initialValue, input);
        break;
      case Operators.DIVIDE:
        result = this._divide(this.initialValue, input);
        break;
      case Operators.MODULO:
        result = this._modulo(this.initialValue, input);
        break;
      default:
        result = "How about this?";
    }

    this.operator = operator;
    this.initialValue = isNaN(result) ? 0 : result;

    result = (typeof result === "string" || result instanceof String)
      ? result
      : this._format(result);

    return [result, this.history]; 
  }

  equal() {
    return [0, 1];
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