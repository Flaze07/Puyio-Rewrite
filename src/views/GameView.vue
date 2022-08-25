<script>
import { PuyoController } from "@/scripts/puyo/puyocontroller.js";

export default {
	data() 
	{
		return {
			controllers: [
			],
			processKeydown: undefined,
			processKeyup: undefined,
			DASCnt: 0,
			ARRCnt: 0,
			clicked: false,
			rotationClicked: false,
			lastClicked: undefined
		}
	},
	mounted() 
	{
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

		this.controllers[0].spawnPuyo();

		this.controllers[0].drawBoard(ctx, store);

		let start;

		const playerController = this.controllers.filter(elem => elem.isPlayer)[0];

		this.handleKeydown = (e) => {
			console.log(e);
			if(store.state.control[e.key] === "move-left") 
			{
				store.state.controlState["move-left"] = true;
			} 
			else if(store.state.control[e.key] === "move-right") 
			{
				store.state.controlState["move-right"] = true;
			} 
			else if(store.state.control[e.key] === "rotate-ccw") 
			{
				store.state.controlState["rotate-ccw"] = true;
			}
			else if(store.state.control[e.key] === "rotate-cw") 
			{
				store.state.controlState["rotate-cw"] = true;
			}
		}
		window.addEventListener("keydown", this.handleKeydown);

		this.handleKeyup = (e) => {
			if(store.state.control[e.key] === "move-left") 
			{
				store.state.controlState["move-left"] = false;
			} 
			else if(store.state.control[e.key] === "move-right") 
			{
				store.state.controlState["move-right"] = false;
			} 
			else if(store.state.control[e.key] === "rotate-ccw") 
			{
				store.state.controlState["rotate-ccw"] = false;
			}
			else if(store.state.control[e.key] === "rotate-cw") 
			{
				store.state.controlState["rotate-cw"] = false;
			}
		}

		window.addEventListener("keyup", this.handleKeyup);

		const step = (timestamp) => 
		{
			if(start === undefined) 
			{
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

			if(store.state.controlState['move-left']) 
			{
				clickedKey = "move-left";
				hasInput = true;
				if(!this.clicked) 
				{
					playerController.tryMoveLeft();
				} 
				else 
				{
					if(this.DASCnt > store.state.handling.DAS) 
					{
						if(this.ARRCnt > store.state.handling.ARR) 
						{
							playerController.tryMoveLeft();
							this.ARRCnt = 0;
						} 
						else 
						{
							this.ARRCnt += elapsed;
						}
					} 
					else 
					{
						this.DASCnt += elapsed;
					}
				}
			}
			else if(store.state.controlState["move-right"]) 
			{
				clickedKey = "move-right";
				hasInput = true;
				if(!this.clicked) 
				{
					playerController.tryMoveRight();
				} 
				else 
				{
					if(this.DASCnt > store.state.handling.DAS) 
					{
						if(this.ARRCnt > store.state.handling.ARR) 
						{
							playerController.tryMoveRight();
							this.ARRCnt = 0;
						} 
						else 
						{
							this.ARRCnt += elapsed;
						}
					} 
					else 
					{
						this.DASCnt += elapsed;
					}
				}
			}

			this.clicked = hasInput;

			if(!this.clicked) 
			{
				this.DASCnt = 0;
				this.ARRCnt = 0;
			}

			if(this.lastClicked !== undefined && clickedKey !== this.lastClicked) 
			{
				this.DASCnt = 0;
				this.ARRCnt = 0;
			}

			this.lastClicked = clickedKey;

			/**
			 * handle rotation input
			 */
			let rotClicked = false;
			if(store.state.controlState["rotate-ccw"]) 
			{
				if(!this.rotationClicked) 
				{
					if(playerController.controllerType === "Puyo") 
					{
						playerController.tryRotateCCW(store.state.PRS["ccw"]);
					}
				}
				rotClicked = true;
			}
			else if(store.state.controlState["rotate-cw"]) 
			{
				console.log("test");
				if(!this.rotationClicked) 
				{
					if(playerController.controllerType === "Puyo")
					{
						playerController.tryRotateCW(store.state.PRS["cw"]);
					}
				}
				rotClicked = true;
			}

			this.rotationClicked = rotClicked;

			/**
			 * each controller logic process
			 */
			this.controllers.forEach(elem => {
				elem.process(elapsed);
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
	unmounted() 
	{
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