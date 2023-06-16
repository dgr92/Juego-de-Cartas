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

//Capturamos el section que contiene el juego completo
const gameApp = document.querySelector(".gameApp");
let templateHTML = "";
let cont = 0;
let card1, card2;
let card1Value, card2Value;

listEmojis.forEach(emoji => {
  templateHTML += `
  <div class="card">
    <div class="content">
      <div class=" front">❔</div>
      <div class=" back">${emoji}</div>
    </div>
  </div>`;
});

gameApp.innerHTML = templateHTML;


const cards = document.querySelectorAll('.card');

const reveal = (e) => {
  if(cont === 0){
    const currentCard = e.currentTarget;
    currentCard.classList.add("flipped");
    card1 = currentCard;
    console.log(card1)
    card1Value = card1.querySelector('.back').innerHTML;
    cont++;

  } else if(cont !== 0 && cont < 2){
    const currentCard = e.currentTarget;
    currentCard.classList.add("flipped");
    card2 = currentCard;
    card2Value = card2.querySelector('.back').innerHTML;
    console.log(card2)
    cont++;
  }
  
if(cont >= 2 && card1Value !== card2Value) {
  console.log('son distintas')
  setTimeout(() => {
    card1.classList.remove("flipped");
    card2.classList.remove("flipped");
    cont = 0;
  }, 1000);

}//else if(cosnt > 1 && card1 === card2){

// }

};

for (const card of cards) {
  if(cont <= 2){
    card.addEventListener("click", reveal);

  }
}
