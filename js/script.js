import Calculator from "./Calculator.js";

const clear = document.getElementById("clear");
const remove = document.getElementById("remove");
const negative = document.getElementById("negative");
const equal = document.getElementById("equal");
const history = document.getElementById("history").childNodes[1];
const display = document.getElementById("display").childNodes[1];
const numbers = document.querySelectorAll('[data-type="number"]');
const operators = document.querySelectorAll('[data-type="operator"]');

var calculator = new Calculator();
history.innerHTML = calculator.history;
display.innerHTML = calculator.input;
controlDisplayFontSize(calculator.input);

const controlDisplayFontSize = (input) => {
  let length = input.toString().length;

  if (length > 7) {
    display.closest("#display").classList.add("calculator__display--overflow");
  } else {
    display.closest("#display").classList.remove("calculator__display--overflow");
  }
};

const controlHistoryOverflow = () => {
  const parent = history.closest("#history");
  const historyContent = history.offsetWidth;
  const historyContainer = parent.offsetWidth;

  if (historyContent > historyContainer) {
    parent.classList.add("calculator__history--overflow");
  } else {
    parent.classList.remove("calculator__history--overflow");
  }
};

remove.addEventListener("click", () => {
  if (calculator.shouldCalculatorReset) return;

  display.innerHTML = calculator.remove();
  controlDisplayFontSize(calculator.input);
});

clear.addEventListener("click", () => {
  const [log, input] = calculator.clear();

  history.innerHTML = log;
  display.innerHTML = input;
  controlDisplayFontSize(calculator.input);
});

numbers.forEach(element => {
  element.addEventListener("click", e => {
    if (calculator.shouldCalculatorReset) return;
    if (!calculator.shouldInputModifyValue
      && calculator.input.length > 16
    ) return;

    display.innerHTML = calculator.setInput(e.target.dataset.value);
    controlDisplayFontSize(calculator.input);

  });
});

operators.forEach(element => {
  element.addEventListener("click", e => {
    if (calculator.shouldCalculatorReset) return;

    const [result, log] = calculator.evaluate(e.target.dataset.symbol);

    history.innerHTML = log;
    display.innerHTML = result;
    controlHistoryOverflow();
    controlDisplayFontSize(result);

  });
});

negative.addEventListener("click", () => {
  if (calculator.shouldCalculatorReset) return;

  display.innerHTML = calculator.setNegativeInput();
  controlDisplayFontSize(calculator.input);
});

equal.addEventListener("click", () => {
  if (calculator.shouldCalculatorReset
    || calculator.operator === ""
  ) return;

  const [result, log] = calculator.equal();

  display.innerHTML = result;
  history.innerHTML = log;
  controlHistoryOverflow();
  controlDisplayFontSize(result);
});

// console.log(calculator._format("0000043.00000"));
// console.log(calculator._add("-25", "-36"));

// history.childNodes[1].innerHTML = "100 + 200 + 300 / 500 * 1,000 - 200,000 - 700,000 + 12";
// history.innerHTML = "1002003005001,000 * 200,0001212121212";

// console.log(calculator._format("346,220,000,000"));
// console.log(calculator.calculate("1002003005001,000 * 200,0001212121212"));

// console.log(calculator._format("1,000,003,000,000,000"));
