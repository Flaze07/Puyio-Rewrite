<script>
export default {
    data() {
        return {
            /**
             * 0 signifies main menu
             * 1 signifies choose game menu
             * 2 signifies puyo puyo menu
             */
            menuPage: 0
        }
    },
    methods: {
        onPlayBtn() {
            this.menuPage = 1;
            // this.$router.push('/game-view')
        },
        onPuyoBtn() {
            this.$router.push('/game-view');
        }
    }
}

</script>

<template>
<div class="home-view">
    <span v-if="menuPage === 0">
        <button @click="onPlayBtn()" class="main-btn">
            Play
        </button>
    </span>
    <span v-else-if="menuPage === 1" class="choose-game">
        <button @click="onPuyoBtn()" class="choose-game-btn">
            Puyo puyo
        </button>
        <button @click="onTetrisBtn()" class="choose-game-btn">
            Tetris
        </button>
    </span>
</div>
</template>

<style scoped>
.home-view {
    display: flex;
    flex-direction: column;

    width: 100%;
    height: 100%;

    align-items: center;
    justify-content: center;
}

.main-btn {
    width: 100%;

    font-size: 4em;
}

.choose-game {
    margin-bottom: -20%;
}

.choose-game-btn {
    width: 100%;

    font-size: 2.5em;

    margin-bottom: 20px;
}
</style>
