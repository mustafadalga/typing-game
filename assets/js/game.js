import { words } from './words.js';
import Modal from './components/modal.js'

const App = {
    data() {
        return {
            words: words,
            currentWords: [],
            gameOver: false,
            isGameStarted: false,
            wordStyleWidth: 200,
            wordIndex: 0,
            wordInsertionSpeed: 2,
            wordAnimationSpeed: 40,
            inputWord: "",
            gameModes: ['Easy', 'Normal', 'Hard'],
            selectedGameMode: 0,
            score: 0,
            timer: {
                second: 0,
                minute: 0,
                hour: 0
            },
            wordInsertionInterval: null,
            wordAnimationInterval: null,
            timerInterval: null,
            modalDisplayStatus: false,
        }
    },
    components: {
        Modal
    },
    computed: {
        getTime() {
            let second = this.timer.second > 9 ? this.timer.second : `0${this.timer.second}`
            let minute = this.timer.minute > 9 ? this.timer.minute : `0${this.timer.minute}`
            let hour = this.timer.hour > 9 ? this.timer.hour : `0${this.timer.hour}`
            return `${hour}:${minute}:${second}`
        }
    },
    created() {
        this.selectedGameMode = Number(this.getLocalStorageData("gameMode")) || this.selectedGameMode
        this.getWordAnimationSpeed()
    },
    mounted() {
        this.shuffleWords()
    },
    methods: {
        play() {
            this.isGameStarted = true
            this.startTimer()
            this.addWord()
            this.wordInsertionInterval = setInterval(() => {
                this.addWord()
            }, this.wordInsertionSpeed * 1000);
            this.wordAnimationInterval = setInterval(() => {
                this.wordsTopToBottom()
                this.checkIsTopToBottom()
            }, this.wordAnimationSpeed);
        },
        restartGame() {
            this.resetGameData()
            this.shuffleWords()
            this.modalDisplayToggle()
        },
        resetGameData() {
            this.currentWords = []
            this.timer = {
                second: 0,
                minute: 0,
                hour: 0
            }
            this.score = 0
            this.gameOver = false
            this.isGameStarted = false
            this.wordIndex = 0
            this.inputValue = ""
        },
        getLocalStorageData(dataName) {
            return localStorage.getItem(dataName);
        },
        setLocalStorageData(dataName, data) {
            localStorage.setItem(dataName, data);
        },
        setclearStorageData() {
            localStorage.clear();
        },
        setGameMode() {
            this.setLocalStorageData("gameMode", this.selectedGameMode)
            this.getWordAnimationSpeed()
        },
        saveGameScores() {
            let gameScores = JSON.parse(this.getLocalStorageData('gameScores')) || []
            gameScores.push({
                time: this.getTime,
                score: this.score,
                mode: this.selectedGameMode
            });
            this.setLocalStorageData("gameScores", JSON.stringify(gameScores))
        },
        getWordAnimationSpeed() {
            switch (this.selectedGameMode) {
                case 0:
                    this.wordAnimationSpeed = 40
                    break;
                case 1:
                    this.wordAnimationSpeed = 20
                    break;
                case 2:
                    this.wordAnimationSpeed = 10
                    break;
            }
        },
        isAddedAllWords() {
            return this.words.length == this.wordIndex
        },
        checkWordEquality() {
            if (this.gameOver) return;
            var word = this.inputWord
            let wordIndex = this.currentWords.findIndex(item => item.characters.join('') == word);
            if (wordIndex != -1) {
                this.removeWord(wordIndex)
                this.inputWord = ""
                this.increaseScore()
                this.checkGameCompleted()
            }
        },
        getWordsLength() {
            this.words.length
        },
        checkCharacter() {
            if (this.gameOver) return;
            const inputValue = this.inputValue.split('')
            this.currentWords.forEach((word, wordIndex) => {
                word.characters.forEach((character, characherIndex) => {
                    if (inputValue[characherIndex] == null) {
                        this.currentWords[wordIndex].classList[characherIndex] = ""
                    } else if (character == inputValue[characherIndex]) {
                        this.currentWords[wordIndex].classList[characherIndex] = "correct"
                    } else {
                        this.currentWords[wordIndex].classList[characherIndex] = "incorrect"
                    }
                });
            })
        },
        addWord() {
            if (!this.isAddedAllWords()) {
                this.currentWords.push({
                    characters: this.words[this.wordIndex].split(''),
                    classList: [],
                    style: {
                        left: `${this.getRandomPosition()}px`,
                        top: "-30px"
                    }
                })
                this.wordIndex++;
            }
        },
        checkGameCompleted() {
            if (this.isAddedAllWords() && this.currentWords.length == 0) {
                this.gameFinish()
            }
        },
        gameFinish() {
            this.gameOver = true
            this.clearInterval()
            this.saveGameScores()
            setTimeout(() => {
                this.modalDisplayToggle()
            }, 500);
        },
        modalDisplayToggle() {
            this.modalDisplayStatus = !this.modalDisplayStatus
        },
        removeWord(wordIndex) {
            this.currentWords.splice(wordIndex, 1);
        },
        shuffleWords() {
            for (let i = this.words.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * i)
                const temp = this.words[i]
                this.words[i] = this.words[j]
                this.words[j] = temp
            }
        },
        getWordsBoardWidth() {
            return this.$refs.words_board.offsetWidth;
        },
        getRandomPosition() {
            return Math.floor(Math.random() * (this.getWordsBoardWidth() - this.wordStyleWidth))
        },
        getCurrentWordTop(wordIndex) {
            return Number(this.currentWords[wordIndex].style.top.slice(0, -2))
        },
        increasePositionTop(wordIndex) {
            this.currentWords[wordIndex].style.top = `${this.getCurrentWordTop(wordIndex) + 1}px`
        },
        increaseScore() {
            this.score++
        },
        wordsTopToBottom() {
            this.currentWords.forEach((_, index) => {
                this.increasePositionTop(index)
            });
        },
        checkIsTopToBottom() {
            let wordsBoardTop = this.$refs.words_board.offsetHeight;
            this.currentWords.forEach((_, index) => {
                let wordPositionTop = this.getCurrentWordTop(index)
                if (wordPositionTop > wordsBoardTop) {
                    this.gameFinish()
                }
            });
        },
        clearInterval() {
            clearInterval(this.wordAnimationInterval)
            clearInterval(this.wordInsertionInterval)
            clearInterval(this.timerInterval)
        },
        startTimer() {
            this.timerInterval = setInterval(() => {
                this.timer.second++
                    if (this.timer.second === 60) {
                        this.timer.second = 0
                        this.timer.minute++
                    }
                if (this.timer.minute === 60) {
                    this.timer.hour++;
                    this.timer.minute = 0
                    this.timer.second = 0
                }
                if (this.timer.hour === 24) {
                    this.timer.hour = 0;
                    this.timer.minute = 0
                    this.timer.second = 0
                }
            }, 1000)
        },
    }
}
Vue.createApp(App).mount('#app')