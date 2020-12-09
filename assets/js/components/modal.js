export default {
    name: 'Modal',
    props: ["isgameover", "modes"],
    data() {
        return {
            gameScores: [],
            lastScore: {
                score: '',
                mode: '',
                time: ''
            },
            currentListMode: ''
        }
    },
    computed: {
        getLastScoreDesc() {
            if (this.gameScores.length > 0) {
                let desc = `You completed ${this.lastScore.score} words in ${this.lastScore.time} time in ${this.getGameMode(this.lastScore.mode)} mode.`
                return desc
            }
            return;
        },
        listGameScores() {
            if (typeof this.currentListMode == "number") {
                return this.gameScores.filter(gameScore => gameScore.mode == this.currentListMode)
            }
            return this.gameScores
        },
    },
    watch: {
        'isgameover': {
            handler: function(status) {
                if (status) {
                    this.getGameScores()
                    this.lastScore = this.gameScores[this.gameScores.length - 1]
                    this.sortGameScores()
                } else {
                    this.resetModalData()
                }
            },
        },
    },
    methods: {
        restartGame() {
            this.$emit('restart-game');
        },
        getGameScores() {
            this.gameScores = JSON.parse(localStorage.getItem('gameScores')) || this.gameScores;
        },
        sortGameScores() {
            this.gameScores.sort((a, b) => b.mode.toString().localeCompare(a.mode) || b.score - a.score)
        },
        resetGameScoreFromStorage() {
            localStorage.removeItem('gameScores');
        },
        getGameMode(index) {
            return this.modes[Number(index)]
        },
        resetModalData() {
            this.gameScores = []
            this.currentListMode = ''
            this.lastScore = {
                score: '',
                mode: '',
                time: ''
            }
        },
    },
    template: `
      <div class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title">Game Completed</h1>
            </div>
            <div class="modal-body">
                <p>{{getLastScoreDesc}}</p>
                    <div class="game-option">
                        <select v-model="currentListMode">
                            <option disabled value="">List By Game Mode</option>
                            <option value="">All</option>
                            <option v-for="(mode,index) in modes" :value="index">{{mode}}</option>
                        </select>
                    </div>
                <template v-if="listGameScores.length>0">
                    <h2>All Game Scores</h2>
                    <div class="game-scores-container">
                        <table class="game-scores">
                            <tr>
                                <th>No</th>
                                <th>Game Mode</th>
                                <th>Time</th>
                                <th>Score</th>
                            </tr>
                            <tr v-if="gameScores" v-for="(score,index) in listGameScores">
                                <td>{{ index+1 }}</td>
                                <td>{{ getGameMode(score.mode) }}</td>
                                <td>{{ score.time }}</td>
                                <td>{{ score.score }}</td>
                            </tr>
                        </table>
                </div>
                </template>
                <template v-else>
                        There is no score information.
                </template>
            </div>
            <div class="modal-footer">
                <button class="btn" @click="restartGame">Play again <span class="btn-arrow">➔</span></button>
                <button class="btn" @click="resetGameScoreFromStorage();resetModalData();">Reset Scores<span
                        class="btn-arrow">➔</span></button>
            </div>
        </div>
    </div>
    `,
};