
const gameTime = 30 * 1000;
window.timer = null;
window.gameStart = null;

function addClass(el, name){
    el.className += ' '+name;
}

function removeClass(el, name){
    el.className = el.className.replace(name, '');
}

function startCursor() {
    const cursor = document.getElementById('cursor');
    const game = document.getElementById('game');
    cursor.style.top = (game.getBoundingClientRect().top + 4) + 'px';
    cursor.style.left = (game.getBoundingClientRect().left + 4) + 'px';
}

function newGame() {
    window.timer = null;
    window.gameStart = null;
    removeClass(document.getElementById('game'), 'over'); 
    document.getElementById('words').style.marginTop = '0px';
    document.getElementById('info').innerHTML = (gameTime / 1000) + '';
    return fetch('./common.json')
    .then((res) => res.json())
    .then((json) => {
        const wordsCount = (json.commonWords).length;
        document.getElementById('words').innerHTML = '';
        for (let i = 0; i < 200; i++) {
            randomIndex = Math.ceil(Math.random() * wordsCount)
            document.getElementById('words').innerHTML += formatWord(json.commonWords[randomIndex -1]);
        }
        addClass(document.querySelector('.word'), 'current');
        addClass(document.querySelector('.letter'), 'current');
        startCursor();
    });
}

function gameOver() {
    clearInterval(window.timer);
    if (!document.getElementById('game').className.includes('over')){
        addClass(document.getElementById('game'), 'over');
    }
    const result = getWordsPerMinute();
    document.getElementById('info').innerHTML = `WPM: ${result}`;
  }

function getWordsPerMinute() {
    const words = [...document.querySelectorAll('.word')];
    const lastTypedWord = document.querySelector('.word.current');
    const lastTypedWordIndex = words.indexOf(lastTypedWord);
    const typedWords = words.slice(0, lastTypedWordIndex);
    const correctWords = typedWords.filter(word => {
        const letters = [...word.children];
        const incorrectLetters = letters.filter(letter => letter.className.includes('incorrect'));
        const correctLetters = letters.filter(letter => letter.className.includes('correct'));
        return incorrectLetters.length === 0 && correctLetters.length === letters.length;
    })

    return correctWords.length / gameTime * 60000;
}

function formatWord(word) {
    return `<div class="word">
                <span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}

document.getElementById('game').addEventListener('keyup', ev => {
    const key = ev.key;
    const currentWord = document.querySelector('.word.current')
    const currentLetter = document.querySelector('.letter.current');
    const expected = currentLetter?.innerHTML || ' ';
    const isLetter = key.length === 1 && key !== ' ';
    const isSpace = key === ' ';
    const isBackspace = key === 'Backspace';
    const isFirstLetter = currentLetter === currentWord.firstElementChild;

    if (document.querySelector('#game.over')){
        return;
    }

    console.log({key, expected});

    if (!window.timer && isLetter) {
        window.timer = setInterval(() => {
           if (!window.gameStart) {
            window.gameStart = (new Date()).getTime();
           } 
           const currentTime = (new Date()).getTime();
           const msPassed = currentTime - window.gameStart;
           const sPassed = Math.round(msPassed / 1000);
           const sLeft = (gameTime / 1000) - sPassed; 
           if (sLeft <= 0) {
            gameOver();
            return;
           }
           document.getElementById('info').innerHTML = sLeft + ''; 

        }, 1000);
        
    }

    if (isLetter) {
        if (currentLetter) {
            addClass(currentLetter, key === expected ? 'correct' : 'incorrect');
            removeClass(currentLetter, 'current');
            if (currentLetter.nextSibling) {
                addClass(currentLetter.nextSibling, 'current');
            }
            
        } else {
            const incorrectLetter = document.createElement('span');
            incorrectLetter.innerHTML = key;
            incorrectLetter.className = 'letter incorrect extra';
            currentWord.appendChild(incorrectLetter);
        }
    }

    if (isSpace){
        if (expected !== ' ') {
            /* use spread operator to make an array */
            const lettersToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
            lettersToInvalidate.forEach(letter => {
              addClass(letter, 'incorrect');
            });
        }
        removeClass(currentWord, 'current');
        addClass(currentWord.nextSibling, 'current');
        if (currentLetter) {
            removeClass(currentLetter, 'current');
        }
        addClass(currentWord.nextSibling.firstElementChild, 'current');
    }

    if (isBackspace) {

        if (currentLetter && isFirstLetter) {
            removeClass(currentWord, 'current');
            addClass(currentWord.previousSibling, 'current');
            removeClass(currentLetter, 'current');
            addClass(currentWord.previousSibling.lastChild, 'current');
            removeClass(currentWord.previousSibling.lastChild, 'incorrect');
            removeClass(currentWord.previousSibling.lastChild, 'correct');
        }
        if (currentLetter && !isFirstLetter) {
            removeClass(currentLetter, 'current');
            addClass(currentLetter.previousSibling, 'current');
            removeClass(currentLetter.previousSibling, 'incorrect');
            removeClass(currentLetter.previousSibling, 'correct');
        }
        if (!currentLetter) {
            addClass(currentWord.lastElementChild, 'current');
            removeClass(currentWord.lastElementChild, 'incorrect');
            removeClass(currentWord.lastElementChild, 'correct');
        }
    }

    /* move lines */
    if (currentWord.getBoundingClientRect().top > 250) {
        const words = document.getElementById('words');
        const margin = parseInt(words.style.marginTop || '0px');
        words.style.marginTop = (margin - 35) + 'px';
    } 

    /* move cursor */
    const nextLetter = document.querySelector('.letter.current');
    const nextWord = document.querySelector('.word.current');
    const cursor = document.getElementById('cursor');
    cursor.style.top = (nextLetter || nextWord).getBoundingClientRect().top + 'px';
    cursor.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';
    
})

document.getElementById('newGameButton').addEventListener('click', () => {
    gameOver();
    newGame();
  });

newGame();