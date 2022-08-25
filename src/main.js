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
				//Auto repeat delay
				"ARR": 55,
				//Time before Auto repeat starts
				"DAS": 167,
				//Soft drop delay
				"SDD": 100
			},
			control: {
				"ArrowLeft": "move-left",
				"ArrowRight": "move-right",
				"KeyZ": "rotate-ccw",
				"ArrowUp": "rotate-cw",
				"Space": "harddrop",
				"ArrowDown": "softdrop"
			},
			controlState: {
				'move-left': false,
				'move-right': false,
				"rotate-ccw": false,
				"rotate-cw": false,
				"harddrop": false,
				"softdrop": false
			}
		}
	}
})


const app = createApp(App)

app.use(store)
app.use(router)

app.mount('#app')
