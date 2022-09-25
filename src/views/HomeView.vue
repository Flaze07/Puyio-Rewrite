<script>
import ControlOption from "@/components/ControlOption.vue";

export default {
    components: {
        ControlOption
    },
    data() {
        return {
            /**
             * 0 signifies main menu
             * 1 signifies choose game menu
             * 2 signifies option menu
             */
            menuPage: 0,
            optionPage: "Controls"
        }
    },
    methods: {
        onPlayBtn() {
            this.menuPage = 1;
            // this.$router.push('/game-view')
        },
        onOptionBtn() {
            this.menuPage = 2;
        },
        onPuyoBtn() {
            this.$router.push('/game-view');
        },
        onBackBtn() {
            this.menuPage = 0;
        }
    },
    mounted() {
        const control = this.$store.state.control;
        for(const key in control) {
            const temp = localStorage.getItem(control[key]);
            if(temp === null) {
                localStorage.setItem(control[key], key);
            } else {
                control[key] = temp;
            }
        }
    }
}

</script>

<template>
    <button v-if="menuPage !== 0" @click="onBackBtn()" class="back-btn">
        Back
    </button>
    <Transition mode="out-in">
        <div key=1 v-if="menuPage === 0" class="add-flex full-height">
            <div>
                <button @click="onPlayBtn()" class="main-btn">
                    Play
                </button>
                <button @click="onOptionBtn()" class="main-btn">
                    Options
                </button>
            </div>
        </div>
        <div key=2 v-else-if="menuPage === 1" class="add-flex full-height choose-game">
            <div>
                <button @click="onPuyoBtn()" class="choose-game-btn">
                    Puyo puyo
                </button>
                <button @click="onTetrisBtn()" class="choose-game-btn">
                    Tetris
                </button>
            </div>
        </div>
        <div key=3 v-else-if="menuPage === 2" class="option-menu">
            <div class="option-choices">
                <button>
                    Controls
                </button>
                <button>
                    Handling
                </button>
                <button>
                    TBA
                </button>
            </div>
            <div key=1 v-if="optionPage === 'Controls'" class="option-display">
                <ControlOption />
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.add-flex {
    display: flex;

    justify-content: center;
    align-items: center;
}

.main-btn {
    width: 100%;

    font-size: 4em;

    margin-top: 10px;
}

.choose-game-btn {
    width: 100%;

    font-size: 2.5em;

    margin-bottom: 20px;
}

.choose-game div {
    margin-top: 20%;
}

.option-menu {
    display: flex;
    
    flex-direction: column;

    align-items: center;

    width: 100%;
}

.option-choices {
    margin-top: 10%;
}

.option-display {
    margin-top: 15px;
    width: 60%;

    display: flex;
    flex-direction: column;
    align-items: center;
}

.v-enter-active, 
.v-leave-active {
    transition: 0.5s;
}

.v-enter-to {
    opacity: 1;
    transform: translate(0, 0px);
}

.v-enter-from {
    opacity: 0;
    transform: translate(0, 50px);
}

.v-leave-to {
    opacity: 0;
    transform: translate(0, 50px);
}

.back-btn {
    position: absolute;
    margin-left: 20px;
    margin-top: 20px;
}
</style>
