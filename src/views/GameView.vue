<script>
import { PuyoController } from "@/scripts/puyo/puyocontroller.js";

export default {
	data() {
		return {
			controllers: [
			],
			processKeydown: undefined,
			processKeyup: undefined,
			DASCnt: 0,
			ARRCnt: 0,
			SDDCnt: 0,
			clicked: false,
			rotationClicked: false,
			lastClicked: undefined,
			hdClicked: false,
			sdClicked: false
		}
	},
	mounted() {
		const store = this.$store;
		const boardScale = store.state.boardScale;
		const puyoTexture = this.$refs["puyotexture"];

		this.controllers.push(new PuyoController(true, boardScale, 0, 0, puyoTexture, 1000));
		const startX = (window.innerWidth - this.controllers[0].drawnWidth) / 2;
		const startY = (window.innerHeight - this.controllers[0].drawnHeight) / 2;
		this.controllers[0].setBoardPosition(startX, startY);

		const canvas = this.$refs["canvas"];
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		const ctx = canvas.getContext("2d");
		ctx.imageSmoothingEnabled = false;

		let start;

		const playerController = this.controllers.filter(elem => elem.isPlayer)[0];
		playerController.spawnPuyo();
		playerController.drawBoard(ctx, store);

		this.handleKeydown = (e) => {
			if(store.state.control[e.code] !== undefined) {
				store.state.controlState[store.state.control[e.code]] = true;
			}
			console.log(e);
		}
		window.addEventListener("keydown", this.handleKeydown);

		this.handleKeyup = (e) => {
			if(store.state.control[e.code] !== undefined) {
				store.state.controlState[store.state.control[e.code]] = false;
			}
		}

		window.addEventListener("keyup", this.handleKeyup);

		const step = (timestamp) => {
			if(start === undefined) {
				start = timestamp;
			}

			const elapsed = timestamp - start;

			/**
			 * handle input
			 */

			 /**
			  * handle left and right input
			  */
			let hasInput = false;
			let clickedKey = undefined;

			if(store.state.controlState['move-left']) {
				clickedKey = "move-left";
				hasInput = true;
				if(!this.clicked) {
					playerController.tryMoveLeft();
				} 
				else {
					if(this.DASCnt > store.state.handling.DAS) {
						if(this.ARRCnt > store.state.handling.ARR) {
							playerController.tryMoveLeft();
							this.ARRCnt = 0;
						} else {
							this.ARRCnt += elapsed;
						}
					} else {
						this.DASCnt += elapsed;
					}
				}
			} else if(store.state.controlState["move-right"]) {
				clickedKey = "move-right";
				hasInput = true;
				if(!this.clicked) {
					playerController.tryMoveRight();
				} else {
					if(this.DASCnt > store.state.handling.DAS) {
						if(this.ARRCnt > store.state.handling.ARR) {
							playerController.tryMoveRight();
							this.ARRCnt = 0;
						} else {
							this.ARRCnt += elapsed;
						}
					} else {
						this.DASCnt += elapsed;
					}
				}
			}

			this.clicked = hasInput;

			if(!this.clicked) {
				this.DASCnt = 0;
				this.ARRCnt = 0;
			}

			if(this.lastClicked !== undefined && clickedKey !== this.lastClicked) {
				this.DASCnt = 0;
				this.ARRCnt = 0;
			}

			this.lastClicked = clickedKey;

			/**
			 * handle rotation input
			 */
			let rotClicked = false;
			if(store.state.controlState["rotate-ccw"]) {
				if(!this.rotationClicked) {
					if(playerController.controllerType === "Puyo") {
						playerController.tryRotateCCW(store.state.PRS["ccw"]);
					}
				}
				rotClicked = true;
			}
			else if(store.state.controlState["rotate-cw"]) {
				if(!this.rotationClicked) {
					if(playerController.controllerType === "Puyo") {
						playerController.tryRotateCW(store.state.PRS["cw"]);
					}
				}
				rotClicked = true;
			}

			this.rotationClicked = rotClicked;

			/**
			 * handle harddrop key input
			 */
			if(store.state.controlState["harddrop"]) {
				if(!this.hdClicked) {
					playerController.tryHarddropPuyo();
					this.hdClicked = true;
				}
			} else {
				this.hdClicked = false;
			}

			/**
			 * handle softdrop key input
			 */

			if(store.state.controlState["softdrop"]) {
				if(!this.sdClicked) {
					playerController.trySoftdropPuyo();
					this.sdClicked = true;
				} else {
					if(this.SDDCnt >= store.state.handling.SDD) {
						playerController.trySoftdropPuyo();
						this.SDDCnt -= store.state.handling.SDD;
					} else {
						this.SDDCnt += elapsed;
					}
				}
			} else {
				this.sdClicked = false;
			}

			/**
			 * each controller logic process
			 */
			this.controllers.forEach(elem => {
				elem.process(elapsed, store);
			})

			//clear board
			ctx.fillStyle = "#000";
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			this.controllers.forEach(elem => {
				elem.drawBoard(ctx, store);
			});

			start = timestamp;

			this.rafID = requestAnimationFrame(step);
		}

		this.rafID = requestAnimationFrame(step);
	},
	unmounted() {
		cancelAnimationFrame(this.rafID);
		window.removeEventListener("keydown", this.handleKeydown);
		window.removeEventListener("keyup", this.handleKeyup);

	}
}
</script>

<template>
<div>
	<router-link to="/">home</router-link>
	<img ref="puyotexture" src="@/assets/puyo.png">
	<canvas ref="canvas" width="200" height="100">
	</canvas>
</div>
</template>

<style scoped>
img {
	display: none;
}

canvas {
	position: absolute;
	top: 0;
	left: 0;

	pointer-events: none;
}
</style>