// Lista de emojis ya barajada
const listEmojis = [
  "🤣",
  "🤣",
  "😡",
  "😡",
  "🤢",
  "🤢",
  "💩",
  "💩",
  "🤪",
  "🤪",
  "😍",
  "😍",
  "😱",
  "😱",
  "🤩",
  "🤩",
];

const startButton = document.querySelector(".start-button");
const startScreen = document.querySelector(".start-screen");
const newGameButton = document.querySelector(".end-button");
const finalScreen = document.querySelector(".final-screen");
const gameScreen = document.querySelector(".game-screen");
const tries = document.querySelector(".final-screen :nth-child(2)");
const time = document.querySelector(".final-screen :nth-child(3)");
const best = document.querySelector(".best-game :last-child");
const marker = document.querySelector(".score-marker :nth-child(2)");

startButton.addEventListener("click", function () {
  startTime = parseInt(new Date().getTime() / 1000);
  startScreen.classList.add("blur-out-contract");
  setTimeout(() => {
    startScreen.style.display = "none";
    gameScreen.style.display = "block";
    gameScreen.classList.add("blur-in-expand");
  }, 800);
});

listEmojis.sort(() => (Math.random() > 0.5 ? 1 : -1));
console.log(listEmojis);
//Capturamos el section que contiene el juego completo
let gameApp = document.querySelector(".gameApp");
let templateHTML = "";
let cont = 0;
let card1back;
let card2back;
let card1, card2;
let card1Value, card2Value;
let emojisValue = []; //Acá meteremos con push los valores de los emojis iguales
let flipAnimation;
let resetButton = document.querySelector(".resetBtn");
let score = 0;
let triesMsg;
let timeMsg;
let bestGameMsg;
// Contador tiempo de partida (momento en el que empieza en UNIX Time)
let startTime;

listEmojis.forEach((emoji) => {
  templateHTML += `
  <div class="card">
    <div class="content">
      <div class=" front">❔</div>
      <div class=" back">${emoji}</div>
    </div>
  </div>`;
});
gameApp.innerHTML = templateHTML;

let cardAll = document.querySelectorAll(".card");

let cards = [...cardAll]; //Hacemos una copia porque nos da un nodeList con todos los div y Js no permite trabajar con eso
//los cards. Serán necesario para conocer la posicion y asi no clickar 2 veces en ellos

function reveal(e) {
  if (cont === 0) {
    //carta 1
    const currentCard = e.currentTarget;
    currentCard.classList.add("flipped");
    card1 = currentCard;

    card1Value = card1.querySelector(".back").innerHTML;

    cont++;
  } else if (cont > 0 && cont < 2) {
    //carta 2
    const currentCard = e.currentTarget;

    // e.target.parentElement.parentElement;
    currentCard.classList.add("flipped");
    card2 = currentCard;
    card2Value = card2.querySelector(".back").innerHTML;

    cont++;
    score += 1;
    // Contador de turnos de la partida
    scoreMarker(score);

    // console.log("Movimientos", score);
  }
  if (cont === 2 && card1Value === card2Value) {
    //me deja seguir jugando y me mete en el array los valores
    const index1 = cards.indexOf(card1); //Obtenemos el indice del elemento que clicamos para poder limpiar el evento y que no nos permita clickar 2 veces el mismo.
    const index2 = cards.indexOf(card2);
    // console.log(index1, index2);
    removeClick(index1, index2); //callback a la funcion que nos quita la posibilidad de hacer 2 clicks

    index1 !== index2 ? emojisValue.push(card1Value, card2Value) : undefined;
    cont = 0;
    if (emojisValue.length === listEmojis.length) {
      //cuando el array esté completo queremos que salga de la funcion.
      //Cuando estas longitudes son las mismas el juego se acaba, Por lo que debemos llamar otra función que nos mande los movimientos realizados y la nos mande la victoria o derrota
      //Cuando estas longitudes son las mismas el juego se acaba, Por lo que debemos llamar otra función que nos mande los movimientos realizados y la nos mande la victoria o derrota. Al div final

      const totalTime = () => {
        const endTime = parseInt(new Date().getTime() / 1000);
        return endTime - startTime;
      };

      bestGame(totalTime(), score);

      console.log(
        `El juego está completo!!. Has necesitado ${score} intentos y has tardado ${totalTime()} segundos!.`
      );

      finalScore(score, totalTime());

      newGameButton.addEventListener("click", function () {
        startScreen.style.display = "none";
        finalScreen.style.display = "none";
        gameScreen.style.display = "block";
        resetGame();
      });
    } else if (emojisValue.length < listEmojis.length) {
      // console.log(" El juego no está completo", emojisValue);
    }
  } else if (cont >= 2 && card1Value !== card2Value) {
    // console.log("son distintas");
    card1back = card1.querySelector(".back");
    card2back = card2.querySelector(".back");
    // console.log(card1back);
    setTimeout(() => {
      card1.classList.add("shake-left-right"); //Animación
      card2.classList.add("shake-left-right");
      card1back.style.background = "linear-gradient(red, #deb0b0)";
      card2back.style.background = "linear-gradient(red, #deb0b0)";
    }, 300);
    flipAnimation = setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      cont = 0;
      card1.classList.remove("shake-left-right"); //Animación
      card2.classList.remove("shake-left-right");
      card1back.style.background = "linear-gradient(steelblue, lightsteelblue)";
      card2back.style.background = "linear-gradient(steelblue, lightsteelblue)";
    }, 1000);
  }
  // return emojisValue;
}

//Funcion que hace que no puedas clicar de nuevo cuando son iguales los valores. Se le hace un callback que recibe la posicion de los div iguales
function removeClick(index1, index2) {
  if (index1 === index2) {
    //Necesitamos que los indices sea diferentes siempre, si no podremos elegir el mismo y hackeariamos el juego
    cards[index1].classList.remove("flipped");
  } else {
    cards[index1].removeEventListener("click", reveal);
    cards[index2].removeEventListener("click", reveal);
  }
}

for (const card of cards) {
  //el cont de acá no funciona, ya que con este bucle te lo hace las 16 veces. No admite if antes de llamar la funcion porque esta no es una funcion global y no revuelve nada.
  card.addEventListener("click", reveal);
}

function resetGame() {
  listEmojis.sort(() => (Math.random() > 0.5 ? 1 : -1));
  // console.log(listEmojis);
  startTime = parseInt(new Date().getTime() / 1000);
  gameApp = document.querySelector(".gameApp");
  templateHTML = "";
  score = 0;
  cont = 0;
  card1 = 0;
  card2 = 0;
  card1Value = 0;
  card2Value = 0;
  emojisValue = [];
  marker.innerHTML = score;
  listEmojis.forEach((emoji) => {
    templateHTML += `
    <div class="card">
      <div class="content">
        <div class=" front">❔</div>
        <div class=" back">${emoji}</div>
      </div>
    </div>`;
  });
  gameApp.innerHTML = templateHTML;

  cardAll = document.querySelectorAll(".card");
  cards = [...cardAll];

  clearTimeout(flipAnimation);

  for (const card of cards) {
    card.classList.remove("flipped");
    card.addEventListener("click", reveal);
  }

  barajar();
}

function barajar() {
  gameApp.classList.add("tracking-out-expand-forward-bottom");
  setTimeout(() => {
    gameApp.classList.add("tracking-in-expand-forward-bottom");
    for (const card of cards) {
      card.classList.add("rotate-scale-down");
    }
  }, 1600);
  setTimeout(() => {
    gameApp.classList.remove("tracking-out-expand-forward-bottom");
    gameApp.classList.remove("tracking-in-expand-forward-bottom");
    for (const card of cards) {
      card.classList.remove("rotate-scale-down");
    }
  }, 3200);
}

resetButton.addEventListener("click", resetGame);

function finalScore(score, totalTime) {
  gameScreen.classList.add("blur-out-contract");
  setTimeout(() => {
    gameScreen.style.display = "none";
    finalScreen.style.display = "block";
    finalScreen.classList.add("blur-in-expand");
  }, 800);

  triesMsg = `Intentos necesarios ${score}`;
  tries.innerHTML = triesMsg;
  timeMsg = `Tiempo total: ${totalTime}s`;
  time.innerHTML = timeMsg;
  bestGameMsg = `${localStorage.getItem(
    "movements"
  )} movimientos en ${localStorage.getItem("fastest")}s`;
  best.innerHTML = bestGameMsg;
}

function bestGame(totalTime, score) {
  if (localStorage.getItem("movements")) {
    if (score < localStorage.getItem("movements")) {
      localStorage.setItem("movements", score);
      localStorage.setItem("fastest", totalTime);
    }
    if (
      score == localStorage.getItem("movements") &&
      totalTime < localStorage.getItem("fastest")
    ) {
      localStorage.setItem("fastest", totalTime);
    }
  } else {
    localStorage.setItem("movements", score);
    localStorage.setItem("fastest", totalTime);
  }
}

function scoreMarker(score) {
  marker.innerHTML = score;
}

//Para cambiar modo
let dark_mode = document.getElementById("dark-mode");
let label_change_mode = document.querySelector(".change-mode");
dark_mode.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});

// hola