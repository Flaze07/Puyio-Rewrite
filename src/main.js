import { createApp } from 'vue'
import { createStore } from 'vuex'

import App from './App.vue'
import router from './router'

const store = createStore({
	state() {
		return {
			boardScale: 2.5,
			lockDelay: 1000,
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
			puyo: {
				groupPower(groupCount) {
					switch(groupCount) {
						case 4:
							return 0
						case 5:
							return 2
						case 6:
							return 3
						case 7:
							return 4
						case 8:
							return 5
						case 9:
							return 6
						case 10:
							return 7
						default:
							return 10
					}
				},
				chainPower(chainCount) {
					switch(chainCount) {
						case 1:
							return 0;
						case 2:
							return 8;
						case 3:
							return 16;
						case 4:
							return 32;
						case 5:
							return 64;
						case 6:
							return 96;
						case 7:
							return 128;
						case 8:
							return 160;
						case 9:
							return 192;
						case 10:
							return 224;
						case 11:
							return 256;
						case 12:
							return 288;
						case 13:
							return 320;
						case 14:
							return 354;
						case 15:
							return 384;
						case 16:
							return 416;
						case 17:
							return 448;
						case 18:
							return 480;
						case 19:
							return 512;
						case 20:
							return 544;
						case 21:
							return 576;
						case 22:
							return 608;
						case 23:
							return 640;
						default:
							return 672;
					}
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
