"use strict";

import { getRowNum } from '@/helper.js'

class PuyoBoard {
	constructor(width = 6, height = 12) {
		this.width = width;
		this.height = height;
		this.board = new Array(this.width * this.height).fill(0);
	}

	isValidVector(vec) {
		if(!vec.hasOwnProperty("x")) {
			alert(`${getRowNum()}: IsValidVector has received invalid vec, lacking x`)
			return;
		}
		if(!vec.hasOwnProperty("y")) {
			alert(`${getRowNum()}: IsValidVector has received invalid vec, lacking y`)
			return;
		}
		if(vec.x < 0 || vec.x >= this.width) {
			return false;
		} else if(vec.y < 0 || vec.y >= this.height) {
			return false;
		}

		return true;
	}

	isValid(x, y) {
		return this.isValidVector({x: x, y: y});
	}

	isEmptyVector(vec) {
		if(!this.isValidVector(vec)) {
			return undefined;
		}

		return this.board[vec.x + (vec.y * this.width)] === 0;
	}

	isEmpty(x, y) {
		return this.isEmptyVector({x: x, y: y});
	}

	isEmptyAndValidVector(vec) {
		return (this.isValidVector(vec) && this.isEmptyVector(vec));
	}

	isEmptyAndValid(x, y) {
		return this.isEmptyAndValidVector({x: x, y: y});
	}

	getValueVector(vec) {
		if(!this.isValidVector(vec)) {
			return undefined;
		}

		return this.board[vec.x + (vec.y * this.width)];
	}

	getValue(x, y) {
		return this.getValueVector({x: x, y: y});
	}


	setValueVector(vec, newVal) {
		if(newVal < 0 || newVal > 4) {
			return false;
		}

		if(!this.isValidVector(vec)) {
			return false;
		}

		this.board[vec.x + (vec.y * this.width)] = newVal;
	}

	setValue(x, y, newVal) {
		this.setValueVector({x: x, y: y}, newVal);
	}
}

export {
	PuyoBoard
}