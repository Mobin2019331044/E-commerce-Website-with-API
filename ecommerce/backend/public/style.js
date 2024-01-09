// script.js

const counterElement = document.getElementById('counter');
const incrementButton = document.getElementById('increment');
const decrementButton = document.getElementById('decrement');

let counterValue = 0;

incrementButton.addEventListener('click', () => {
    counterValue++;
    counterElement.textContent = counterValue;
});

decrementButton.addEventListener('click', () => {
    if (counterValue > 0) {
        counterValue--;
        counterElement.textContent = counterValue;
    }
});
