const secretValue = Math.floor(Math.random() * 20) + 1;
let chanceNumber = 5;
let lastGuess = [];
let gameOver = false;
let inputValue = 0;
let highestScore = 0;

const loadInitialState = () => {
  chanceNumber = 5;
  document.querySelector(".chances_number").textContent = chanceNumber;
  document.querySelector(".last-guess").style.display = "none";
  highestScore = localStorage.getItem("highestScore");
  if (!highestScore) {
    highestScore = 0;
  }
  document.querySelector(".high_score").textContent = highestScore;
};

const comparison = () => {
  inputValue = Number(document.querySelector(".number-input").value);
  if (inputValue < 1 || inputValue > 20) {
    document.querySelector(".text-result").textContent =
      "Number should be between  1-20";
  } else {
    chanceNumber = chanceNumber - 1;
    lastGuess.push(inputValue);
    if (lastGuess.length > 1) {
      showLastRecord();
    }
    measureCloseness(inputValue, secretValue, chanceNumber);
  }
};

const measureCloseness = (guessNumber, secretValue, chanceNumber) => {
  const result =
    guessNumber > secretValue ? 1 : guessNumber < secretValue ? -1 : 0;
  switch (result) {
    case 1:
      handleUIChanges(
        `You guessed ${guessNumber} that is too high`,
        guessNumber / secretValue,
        chanceNumber
      );
      break;
    case -1:
      handleUIChanges(
        `You guessed ${guessNumber} that is too low`,
        guessNumber / secretValue,
        chanceNumber
      );
      break;
    case 0:
      handleUIChanges(
        `You guessed ${guessNumber} that is right`,
        guessNumber / secretValue,
        chanceNumber
      );
      break;
  }
};

const handleUIChanges = (resultMessage, probability, chanceNumber) => {
  document.querySelector(".text-result").textContent = resultMessage;
  document.querySelector(".number-input").value = "";
  if (probability > 1) {
    probability = Math.abs(1 - probability);
    probability = 1 - probability;
  }
  document.querySelector(".prediction-bar").style.width =
    probability * 100 + "%";
  if (chanceNumber < 1 && probability !== 1) {
    chanceNumber = 0;
    gameOverState();
  }
  if (probability === 1) {
    loadWinScreen();
  }
  document.querySelector(".chances_number").textContent = chanceNumber;
};

const gameOverState = () => {
  document.querySelector(".text-result").textContent =
    "Your chances are finished :-(";
  const button = document.querySelector(".btn-guess");
  button.disabled = true;
  button.style.background = "#7b788e";
  button.style.cursor = "not-allowed";
  document.querySelector("body").style.backgroundColor = "#ffa8a8";
};

const loadWinScreen = () => {
  document.querySelector(".text-result").textContent = "Your Won 🎉";
  if (chanceNumber + 1 > highestScore) {
    localStorage.setItem("highestScore", chanceNumber + 1);
    document.querySelector(".high_score").textContent = chanceNumber + 1;
  }
  const button = document.querySelector(".btn-guess");
  button.disabled = true;
  button.style.background = "#7b788e";
  button.style.cursor = "not-allowed";
  const startGameButton = document.querySelector(".btn-newgame");
  document.querySelector("body").style.backgroundColor = "#96f2d7";
};

const showLastRecord = () => {
  const last_guess_element = document.querySelector(".last-guess");
  last_guess_element.style.display = "block";
  last_guess_element.textContent = `You guessed ${
    lastGuess[lastGuess.length - 2]
  }`;
};

loadInitialState();

document.querySelector(".btn-guess").addEventListener("click", comparison);
document
  .querySelector(".btn-newgame")
  .addEventListener("click", () => location.reload());
