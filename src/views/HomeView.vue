<script>
export default {
    methods: {
        OnPlayBtn() {
            this.$router.push('/game-view')
        }
    }
}

</script>

<template>
<div class="home-view">
    <button @click="OnPlayBtn()">
        Play
    </button>
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

button {
    width: 40%;

    font-size: 5em;
}
</style>
