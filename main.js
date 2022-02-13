import './style.css'

const grid = document.querySelector('.gameGrid');
const attempts = document.querySelector('.attempts');
const found = document.querySelector('.found');

var choosenCards = [];
var choosenCardsIds = [];
var foundCards = 0;
var attemptsDone = 0;
var foundCards = 0;
const cardsInGame = 10;

found.textContent = `${foundCards}/${cardsInGame}`;;
attempts.textContent = attemptsDone;


function addCards() {
  let length = 0;
  let cardList = [];
  while (length < cardsInGame) {
    cardList.push({
      img: `./img/${length + 1}.jpg`,
      // img: `https://source.unsplash.com/random/200x200?sig=${length}`,
      id: Math.random()
    })
    length++;
  }

  //shuffle cards
  const shuffledCards = [...cardList, ...cardList]
    .sort(() => Math.random() - 0.5)
    .map((card) => ({ ...card }))
  return shuffledCards;
}

function initiateBoard(cards) {
  for (let i = 0; i < cards.length; i++) {
    var card = document.createElement('img');
    card.setAttribute('src', './img/favicon.svg');
    card.setAttribute('data-id', i);
    card.addEventListener('click', flipCard);
    grid.appendChild(card);
  }
}

function checkForMatch() {
  attempts.textContent = ++attemptsDone;
  var cards = document.querySelectorAll('img');
  var firstCard = choosenCardsIds[0];
  var secondCard = choosenCardsIds[1];
  if (choosenCards[0] === choosenCards[1]) {
    found.textContent = `${++foundCards}/${cardsInGame}`;
    animateCard(cards[firstCard]);
    animateCard(cards[secondCard]);
    cards[firstCard].setAttribute('src', './img/blank.jpg')
    cards[secondCard].setAttribute('src', './img/blank.jpg')
  } else {
    animateCard(cards[firstCard]);
    animateCard(cards[secondCard]);
    cards[firstCard].setAttribute('src', './img/favicon.svg')
    cards[secondCard].setAttribute('src', './img/favicon.svg')
  }
  choosenCards = [];
  choosenCardsIds = [];
  if (foundCards === cardsInGame) {
    openModal();
    document.getElementById('celebrate').play();
  }
}

function animateCard(ele) {
  ele.animate([
    { transform: 'rotateY(180deg)' },
    { transform: 'rotateY(0deg)' }
  ], {
    duration: 400,
  });
}

function flipCard() {
  if (choosenCards.length != 2) {
    var imgs = document.querySelectorAll('img');
    var cardId = this.getAttribute('data-id');
    // if clicked on same card twice
    if (choosenCardsIds.length > 0 && choosenCardsIds[0] === cardId) {
      var firstCard = choosenCardsIds[0];
      animateCard(this);
      imgs[firstCard].setAttribute('src', './img/favicon.svg')
      choosenCards = [];
      choosenCardsIds = [];
    } else if (this.getAttribute('src') != './img/blank.jpg') {
      document.getElementById('card-flip').play();
      choosenCards.push(cards[cardId].id);
      choosenCardsIds.push(cardId);
      animateCard(this);
      this.setAttribute('src', cards[cardId].img);
      if (choosenCards.length === 2) {
        setTimeout(checkForMatch, 1000);
      }
    }
  }
}
const delay = ms => new Promise(res => setTimeout(res, ms));

const glanceBoard = async () => {
  const loading = document.querySelector('.loader');
  var imgs = document.querySelectorAll('img');
  for (let i = 0; i < cards.length; i++) {
    const image = imgs[i];
    animateCard(image);
    image.setAttribute('src', cards[i].img);
  }
  loading.classList.add('loading');
  await delay(3000);
  for (let i = 0; i < cards.length; i++) {
    const image = imgs[i];
    animateCard(image);
    image.setAttribute('src', './img/favicon.svg');
  }
  loading.classList.remove('loading');
}

const cards = addCards();
initiateBoard(cards);
glanceBoard();

// Modal
const closeModalButton = document.getElementById('close-button');
const overlay = document.getElementById('overlay');
const modal = document.getElementById('modal');

overlay.addEventListener('click', closeModal);

function openModal() {
  document.querySelector('.attempts-modal').textContent = attemptsDone;
  modal.classList.add('active');
  overlay.classList.add('active');
}

function closeModal() {
  console.log('close')
  modal.classList.remove('active');
  overlay.classList.remove('active');
}

closeModalButton.onclick = closeModal;
