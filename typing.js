
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
                <span class="letter">${word.split('').join('</span><span class="letter">')}</span>
             </div>`;
}

document.getElementById('game').addEventListener('keyup', ev => {
    const key = ev.key;
    const currentLetter = document.querySelector('.letter.current');
    const expected = currentLetter.innerHTML;
    const isLetter = key.length === 1 && key !== ' ';

    console.log({key, expected});

    if (isLetter) {
        if (currentLetter) {
            addClass(currentLetter, key === expected ? 'correct' : 'incorrect');
            removeClass(currentLetter, 'current');
            addClass(currentLetter.nextSibling, 'current');
        }
    }
})

newGame();