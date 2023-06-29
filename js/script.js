const RANDOM_SENTENCE_URL_API = 'https://api.quotable.io/random';
const typeDisplay = document.getElementById('type-display');
const typeInput = document.getElementById('type-input');
const timer = document.getElementById('timer');

const typeSound = new Audio('./audio/typing-sound.mp3');
const wrongSound = new Audio('./audio/wrong.mp3');
const correctSound = new Audio('./audio/correct.mp3');

// 正誤判定処理
typeInput.addEventListener('input', () => {
    // タイプ音付与
    typeSound.volume = 0.5;
    typeSound.play();
    typeSound.currentTime = 0;

    const sentenceArray = document.querySelectorAll('span');
    const arrayValue = typeInput.value.split('');
    // console.log(arrayValue);

    let correct = true;

    sentenceArray.forEach((characterSpan, index) => {
        if (arrayValue[index] === undefined) {
            characterSpan.classList.remove('correct');
            characterSpan.classList.remove('incorrect');
            correct = false;
        } else if (characterSpan.innerText === arrayValue[index]) {
            characterSpan.classList.add('correct');
            characterSpan.classList.remove('incorrect');
        } else {
            characterSpan.classList.add('incorrect');

            wrongSound.volume = 0.3;
            wrongSound.play();
            wrongSound.currentTime = 0;

            correct = false;
        }
    });

    if (correct === true) {
        correctSound.play();
        correctSound.currentTime = 0;
        RenderNextSentence();
    }
});

// 偉人の言葉をAPIから持ってくる処理
const GetRandomSentence = () => {
    return fetch(RANDOM_SENTENCE_URL_API)
        .then((response) => response.json())
        .then((data) => data.content);
};

// 偉人の言葉を画面にセットする処理
const RenderNextSentence = async () => {
    const sentence = await GetRandomSentence();
    typeDisplay.innerText = '';
    // 文章を1文字ずつspanタグに入れる
    const oneLetter = sentence.split('');

    oneLetter.forEach((character) => {
        const characterSpan = document.createElement('span');
        characterSpan.innerText = character;
        typeDisplay.appendChild(characterSpan);
        // characterSpan.classList.add('correct');
    });

    // 次の問題に移ったときに入力欄を空にする処理
    typeInput.value = '';

    StartTimer();
};

// 制限時間の表示処理
let startTime;
let originTime = 30;
const StartTimer = () => {
    timer.innerText = originTime;
    startTime = new Date();
    setInterval(() => {
        timer.innerText = originTime - getTimerTime();
        if (timer.innerText <= 0) {
            TimeUp();
        }
    }, 1000);
};

// 制限時間から1秒ずつマイナスしていく処理
const getTimerTime = () => {
    return Math.floor((new Date() - startTime) / 1000);
};

// 制限時間が0以下になった時次の問題へ移る処理
const TimeUp = () => {
    RenderNextSentence();
};

// 最初の問題を画面に表示する処理
RenderNextSentence();
