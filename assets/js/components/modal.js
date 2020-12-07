export default {
    name: 'Modal',
    props: ["isgameover", "modes"],
    emits: ["restart-game"],
    setup() {
        return {
            gameScores: [],
            lastScore: {}
        };
    },
    mounted() {},
    computed: {

    },
    watch: {
        'isgameover': {
            handler: function(status) {
                if (status) {
                    this.getGameScores()
                    this.lastScore = this.gameScores[this.gameScores.length - 1]
                    this.sortGameScores()
                } else {
                    this.removeGameScores()
                }
            },
        },
    },
    methods: {
        nextLevel() {
            this.$emit('increaseLevel');
        },
        restartGame() {
            this.$emit('restart-game');
        },
        getGameScores() {
            this.gameScores = JSON.parse(localStorage.getItem('gameScores')) || this.gameScores;
        },
        removeGameScores() {
            this.gameScores = []
        },
        sortGameScores() {
            this.gameScores.sort((a, b) => b.mode.toString().localeCompare(a.mode) || b.score - a.score)
        },
        resetGameScoreFromStorage() {
            localStorage.removeItem('gameScores');
            this.getGameScores()
            this.removeGameScores()
            console.log(this.$el, this, this.gameScores)
        },
        getGameMode(index) {
            return this.modes[Number(index)]
        }

    },
    template: `
       <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title">Game Completed</h1>
      </div>
      <div class="modal-body">
          <p>You completed {{lastScore.score}} words in {{lastScore.time}} time in {{getGameMode(lastScore.mode)}} mode.</p>
          <h2>All Game Scores</h2>
                    <div class="game-scores-container">
                       <table class="game-scores">
                    <tr>
                        <th>No</th>
                        <th>Game Mode</th>
                        <th>Time</th>
                        <th>Score</th>
                    </tr>
                    <tr v-if="gameScores"  v-for="(score,index) in gameScores">
                        <td>{{ index+1 }}</td>
                        <td>{{ getGameMode(score.mode) }}</td>
                        <td>{{ score.time }}</td>
                        <td>{{ score.score }}</td>
                    </tr>
                </table>
                    </div>
      </div>
      <div class="modal-footer">
        <button  class="btn" @click="restartGame">Play again <span class="btn-arrow">➔</span></button>
        <button  class="btn" @click="resetGameScoreFromStorage()">Reset Scores<span class="btn-arrow">➔</span></button>
      </div>
    </div>
  </div>
    `,
};