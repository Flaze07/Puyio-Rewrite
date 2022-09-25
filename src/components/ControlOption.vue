<script>
export default {
	data() {
		return {
			changeKeybind: false,
			changeKeybindType: '',
			cancelKeybindMethod: undefined,
			modifyKeybind: undefined
		}
	},
	methods: {
		setKeybind(keybindType) {
			this.changeKeybindType = keybindType;
			this.changeKeybind = true;
		}
	},
	mounted() {
		if(this.cancelKeybindMethod === undefined) {
			this.cancelKeybindMethod = (e) => {
				if(e.code === "Escape") {
					this.changeKeybind = false;
				}
			}
		}
		if(this.modifyKeybind === undefined) {
			this.modifyKeybind = (e) => {
				const oldKey = this.$store.state.keybind[this.changeKeybindType];
				delete this.$store.state.control[oldKey];

				this.$store.state.keybind[this.changeKeybindType] = e.code;
				this.$store.state.control[e.code] = this.changeKeybindType;
				this.changeKeybind = false;
				e.preventDefault();
			}
		}
		window.addEventListener("keydown", this.cancelKeybindMethod);
	},
	unmounted() {
		window.removeEventListener("keydown", this.cancelKeybindMethod);
	},
	watch:{
		changeKeybind(newChangeKeybind) {
			if(newChangeKeybind) {
				window.addEventListener("keydown", this.modifyKeybind);
			} else {
				window.removeEventListener("keydown", this.modifyKeybind);
			}
		}
	}
}
</script>

<template>
<div v-if="changeKeybind" class="modal">
	<div class="modal-background">
		<p>
			Please press new input ( ESC to cancel )
		</p>
	</div>	
</div>
<div class="options">
	<div class="option-label">
		Move Left
	</div>
	<div class="option-setting">
		<button @click="setKeybind('move-left')">
			{{this.$store.state.keybind["move-left"]}}
		</button>
	</div>
</div>
<div class="options">
	<div class="option-label">
		Move Right
	</div>
	<div class="option-setting">
		<button @click="setKeybind('move-right')">
			{{this.$store.state.keybind["move-right"]}}
		</button>
	</div>
</div>
<div class="options">
	<div class="option-label">
		Rotate CCW
	</div>
	<div class="option-setting">
		<button @click="setKeybind('rotate-ccw')">
			{{this.$store.state.keybind["rotate-ccw"]}}
		</button>
	</div>
</div>
<div class="options">
	<div class="option-label">
		Rotate CW
	</div>
	<div class="option-setting">
		<button @click="setKeybind('rotate-cw')">
			{{this.$store.state.keybind["rotate-cw"]}}
		</button>
	</div>
</div>
<div class="options">
	<div class="option-label">
		Harddrop
	</div>
	<div class="option-setting">
		<button @click="setKeybind('harddrop')">
			{{this.$store.state.keybind["harddrop"]}}
		</button>
	</div>
</div>
<div class="options">
	<div class="option-label">
		Softdrop
	</div>
	<div class="option-setting">
		<button @click="setKeybind('softdrop')">
			{{this.$store.state.keybind["softdrop"]}}
		</button>
	</div>
</div>
</template>

<style scoped>
.options {
	width: 100%;
	background-color: #333;

	display: flex;
	flex-direction: row;
}

.option-label {
	width: 50%;

	padding: 5px 5px 5px 5px;
}

.option-setting {
	width: 50%;
	text-align: end;
	padding: 5px 5px 5px 5px;
}

.option-setting button {
	min-width: 100px;
}

.modal {
	position: absolute;
	top: 0;
	left: 0;
}

.modal-background {
	position: absolute;
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 0, 0, 0.6);

	display: flex;
	align-items: center;
	justify-content: center;
}
</style>