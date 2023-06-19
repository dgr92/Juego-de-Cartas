"use-strict";

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

listEmojis.sort(() => (Math.random() > 0.5 ? 1 : -1));
console.log(listEmojis);

let startButton = document.querySelector(".start-button");
let startScreen = document.querySelector(".start-screen");
let gameScreen = document.querySelector(".game-screen");

startButton.addEventListener("click", function () {
  startScreen.style.display = "none";
  gameScreen.style.display = "block";
});

//Capturamos el section que contiene el juego completo
let gameApp = document.querySelector(".gameApp");
// console.log(gameApp)
let templateHTML = "";
let cont = 0;
let card1, card2;
let card1Value, card2Value;
let emojisValue = []; //Acá meteremos con push los valores de los emojis iguales
let flipAnimation;
let resetButton = document.querySelector(".resetBtn");
let score = 0;

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
// console.log(gameApp)
// console.log(card1)
let cardAll = document.querySelectorAll(".card");
// console.log(cardAll);
let cards = [...cardAll]; //Hacemos una copia porque nos da un nodeList con todos los div y Js no permite trabajar con eso
//los cards. Serán necesario para conocer la posicion y asi no clickar 2 veces en ellos

function reveal(e) {
  console.log("Esto", cards);
  if (cont === 0) {
    //carta 1
    const currentCard = e.currentTarget;
    // console.log(e.currentTarget)
    currentCard.classList.add("flipped");
    card1 = currentCard;
    // console.log(cards)

    // console.log(currentCard)
    // console.log(card1);

    card1Value = card1.querySelector(".back").innerHTML;
    // console.log(card1Value);
    //console.log(card1Value);
    cont++;
  } else if (cont > 0 && cont < 2) {
    //carta 2
    const currentCard = e.currentTarget;
    // console.log(currentCard)

    // e.target.parentElement.parentElement;
    currentCard.classList.add("flipped");
    card2 = currentCard;
    // console.log(cards)
    card2Value = card2.querySelector(".back").innerHTML;
    // console.log(card2);
    // console.log(card2Value);
    //console.log(card2);
    console.log(card2Value);
    cont++;
    score += 1;
    console.log("Movimientos", score);
  }
  if (cont === 2 && card1Value === card2Value) {
    // console.log(card1)
    // console.log(card2)
    //me deja seguir jugando y me mete en el array los valores
    const index1 = cards.indexOf(card1); //Obtenemos el indice del elemento que clicamos para poder limpiar el evento y que no nos permita clickar 2 veces el mismo.
    const index2 = cards.indexOf(card2);
    console.log(index1, index2);
    removeClick(index1, index2); //callback a la funcion que nos quita la posibilidad de hacer 2 clicks

    index1 !== index2 ? emojisValue.push(card1Value, card2Value) : undefined;
    console.log(emojisValue);
    cont = 0;
    if (emojisValue.length === listEmojis.length) {
      //cuando el array esté completo queremos que salga de la funcion.
      //Cuando estas longitudes son las mismas el juego se acaba, Por lo que debemos llamar otra función que nos mande los movimientos realizados y la nos mande la victoria o derrota
      // console.log(emojisValue);
      //Cuando estas longitudes son las mismas el juego se acaba, Por lo que debemos llamar otra función que nos mande los movimientos realizados y la nos mande la victoria o derrota. Al div final
      console.log(
        " El juego está completo",
        emojisValue,
        "Tus intentos han sido " + score
      );
    } else if (emojisValue.length < listEmojis.length) {
      console.log(" El juego no está completo", emojisValue);
    }
  } else if (cont >= 2 && card1Value !== card2Value) {
    console.log("son distintas");
    setTimeout(() => {
      card1.classList.add("shake-left-right"); //Animación
      card2.classList.add("shake-left-right");
    }, 300);
    flipAnimation = setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      cont = 0;
      card1.classList.remove("shake-left-right"); //Animación
      card2.classList.remove("shake-left-right");
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
    // console.log("Indice 1", cards[index1]);
    cards[index1].removeEventListener("click", reveal);
    // console.log("Indice 2", cards[index2]);
    cards[index2].removeEventListener("click", reveal);
  }
}

for (const card of cards) {
  //el cont de acá no funciona, ya que con este bucle te lo hace las 16 veces. No admite if antes de llamar la funcion porque esta no es una funcion global y no revuelve nada.
  card.addEventListener("click", reveal);
}

function resetGame() {
  listEmojis.sort(() => (Math.random() > 0.5 ? 1 : -1));
  console.log(listEmojis);
  gameApp = document.querySelector(".gameApp");
  // console.log(gameApp)
  templateHTML = "";
  score = 0;
  cont = 0;
  card1 = 0;
  card2 = 0;
  card1Value = 0;
  card2Value = 0;
  emojisValue = [];

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
  // console.log(gameApp)

  cardAll = document.querySelectorAll(".card");
  cards = [...cardAll];

  clearTimeout(flipAnimation);

  for (const card of cards) {
    card.classList.remove("flipped");
    card.addEventListener("click", reveal);
  }
}

resetButton.addEventListener("click", resetGame);
