import Calculator from "./Calculator.js";

const buttons = document.querySelectorAll(".btn");
const clear = document.getElementById("clear");
const remove = document.getElementById("remove");
const dot = document.getElementById("dot");
const negative = document.getElementById("negative");
const equal = document.getElementById("equal");
const history = document.getElementById("history").childNodes[1];
const display = document.getElementById("display").childNodes[1];
const numbers = document.querySelectorAll('[data-type="number"]');
const operators = document.querySelectorAll('[data-type="operator"]');

var calculator = new Calculator();
calculator._reset();
display.innerHTML = calculator.input;

const controlHistoryFontSize = () => {
  let length = calculator.input.length;

  if (length > 7) {
    display.closest("#display").classList.add("calculator__display--overflow");
  } else {
    display.closest("#display").classList.remove("calculator__display--overflow");
  }
};

const controlHistoryOverflow = () => {
  const parent = history.closest("#history");

  if (history.offsetWidth > parent.offsetWidth) {
    parent.classList.add("calculator__history--overflow");
  } else {
    parent.classList.remove("calculator__history--overflow");
  }
};

remove.addEventListener("click", (e) => {
  display.innerHTML = calculator.remove();
  controlHistoryFontSize();
});

clear.addEventListener("click", (e) => {
  const [initialHistory, initialInput] = calculator.clear();

  history.innerHTML = initialHistory;
  display.innerHTML = initialInput;
  controlHistoryFontSize();
});

numbers.forEach(element => {
  element.addEventListener("click", e => {
    if (calculator.input.length > 16) return;

    display.innerHTML = calculator.setInput(e.target.dataset.value, false);
    controlHistoryFontSize();
  });
});

operators.forEach(element => {
  element.addEventListener("click", e => {
    const [result, log] = calculator.calculate(e.target.dataset.symbol);
    console.log(result);
    console.log(log);

    history.innerHTML = log;
    display.innerHTML = result;
    controlHistoryOverflow();
    controlHistoryFontSize();
  });
});

negative.addEventListener("click", e => {
  display.innerHTML = calculator.setInput(null, true);
  controlHistoryFontSize();
});

equal.addEventListener("click", e => {
  const [a, b] = calculator.equal();

  history.innerHTML = a;
  display.innerHTML = b;
});

console.log(calculator._format("0000043.00000"));

// history.childNodes[1].innerHTML = "100 + 200 + 300 / 500 * 1,000 - 200,000 - 700,000 + 12";
// history.innerHTML = "1002003005001,000 * 200,0001212121212";

// console.log(calculator._format("346,220,000,000"));
// console.log(calculator.calculate("1002003005001,000 * 200,0001212121212"));

// console.log(calculator._format("1,000,003,000,000,000"));