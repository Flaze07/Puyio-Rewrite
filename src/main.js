import { createApp } from 'vue'
import { createStore } from 'vuex'

import App from './App.vue'
import router from './router'

const store = createStore({
	state() {
		return {
			boardScale: 3,
			puyoColor: {
				1: {
					color: "red",
					x: 0
				},
				2: {
					color: "blue",
					x: 16
				},
				3: {
					color: "green",
					x: 32
				},
				4: {
					color: "yellow",
					x: 48
				}
			},
			//Puyo Rotation System
			PRS: {
				"ccw": {
					//anchor is above
					"below": [
						{
							x: 0,
							y: 0
						},
						{
							x: 1,
							y: 0
						},
						{
							x: 0,
							y: -1
						},
						{
							x: 1,
							y: -1
						}
					],
					//anchor is above
					"above": [
						{
							x: 0,
							y: 0
						},
						{
							x: -1,
							y: 0
						}
					],
					//anchor is to the left
					"left": [
						{
							x: 0,
							y: 0
						}
					],
					"right": [
						{
							x: 0,
							y: 0
						},
						{
							x: 0,
							y: -1
						}
					]
				},
				"cw": {
					//the anchor is below
					"below": [
						{
							x: 0,
							y: 0
						},
						{
							x: -1,
							y: 0
						},
						{
							x: 0,
							y: -1
						},
						{
							x: -1,
							y: -1
						}
					],
					//the anchor is above
					"above": [
						{
							x: 0,
							y: 0
						},
						{
							x: 1,
							y: 0
						}
					],
					//the anchor is leftside
					"left": [
						{
							x: 0,
							y: 0
						},
						{
							x: 0,
							y: -1
						}
					],
					//the anchor is rightside
					"right": [
						{
							x: 0,
							y: 0
						}
					]
				}
			},
			//these handling values are in ms
			handling: {
				"ARR": 33,
				"DAS": 167
			},
			control: {
				"ArrowLeft": "move-left",
				"ArrowRight": "move-right",
				"z": "rotate-ccw",
				"ArrowUp": "rotate-cw"
			},
			controlState: {
				'move-left': false,
				'move-right': false,
				"rotate-ccw": false,
				"rotate-cw": false
			}
		}
	}
})


const app = createApp(App)

app.use(store)
app.use(router)

app.mount('#app')
