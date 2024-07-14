
function addClass(el, name){
    el.className += ' '+name;
}

function removeClass(el, name){
    el.className = el.className.replace(name, '');
}

function newGame() {
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
    });
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

    console.log({key, expected});

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

    /* move cursor */
    const nextLetter = document.querySelector('.letter.current');
    const nextWord = document.querySelector('.word.current');
    const cursor = document.getElementById('cursor');
    cursor.style.top = (nextLetter || nextWord).getBoundingClientRect().top + 'px'
    cursor.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px'
    
})



newGame();