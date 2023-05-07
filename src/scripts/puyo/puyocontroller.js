"use strict";

import { getRowNum } from "@/helper.js";
import { PuyoBoard } from "@/scripts/puyo/puyoboard.js";

class PuyoController 
{
    /**
     * 
     * @param {boolean} isPlayer
     * @param {number} drawScale 
     * @param {number} startX 
     * @param {number} startY 
     * @param {ImageData} puyoTexture 
     * @param {number} gravity
     */
    constructor(isPlayer, drawScale, startX, startY, puyoTexture, gravity) {
        this.controllerType = "Puyo";
        this.isPlayer = isPlayer;
        this.drawScale  = drawScale;
        this.startX = startX;
        this.startY = startY;
        this.puyoTexture = puyoTexture;
        this.gravity = gravity;
        this.gravityCnt = 0;
        this.lockDelayCnt = 0;
        this.clearDelay = 500;
        this.clearDelayCnt = 0;
        this.nextPuyo1 = [0, 0];
        this.nextPuyo2 = [0, 0];
        this.fontSize = 11;
        this.chainCount = 0;
        this.markedPuyo = [];
        this.puyoChain = 0;
        /**
         * this function callback will be called when
         * there's a clear in puyo puyo happens
         * this function's parameter will consist of
         * number of puyo cleared and
         * the chain
         */
        this.clearEvent = undefined;

        this.puyoRadius = 16; //pixels

        this.puyoBoard = new PuyoBoard();

        this.drawnWidth = this.puyoBoard.width * this.puyoRadius * this.drawScale;
        this.drawnHeight = this.puyoBoard.height * this.puyoRadius * this.drawScale;

        this.nextCanvas = document.createElement("canvas");

        this.nextWidth = (this.puyoRadius + 10) * this.drawScale;
        this.nextHeight = (this.puyoRadius + 10) * 4 * this.drawScale;

        const next2D = this.nextCanvas.getContext("2d");
        next2D.fillStyle = "#FFF";
        next2D.fillRect(0, 0, this.nextWidth, this.nextHeight);

        this.puyo1 = {
            x: 0,
            y: 0,
            color: 0
        }
        
        this.puyo2 = {
            x: 0,
            y: 0,
            color: 0
        }

        this.getNextPuyo = this.generateNextPuyo();
    }

    setClearEvent(callback) {
        this.clearEvent = callback;
    }

    setBoardPosition(startX, startY) {
        this.startX = startX;
        this.startY = startY;

        this.grid = new Path2D();

        /**
         * set the vertical line for grid
         */
        for(let i = 0; i < this.puyoBoard.width; ++i) {
            this.grid.moveTo((i * this.drawScale * this.puyoRadius) + startX, startY);
            this.grid.lineTo((i * this.drawScale * this.puyoRadius) + startX, startY + this.drawnHeight);
        }

        /**
         * set the horizontal line for grid
         */

        for(let i = 0; i < this.puyoBoard.height; ++i) {
            this.grid.moveTo(startX, (i * this.drawScale * this.puyoRadius) + startY);
            this.grid.lineTo(startX + this.drawnWidth, (i * this.drawScale * this.puyoRadius) + startY);
        }
    }

    drawBoard(ctx, store) {
        if(ctx === undefined) {
            alert(`Error happened at ${getRowNum()}`);
        }

        //draw board
        ctx.fillStyle = "#fff";
        ctx.fillRect(this.startX, this.startY, this.drawnWidth, this.drawnHeight);

        //draw grid
        ctx.stroke(this.grid);

        for(let i = 0; i < this.puyoBoard.height; ++i) {
            for(let j = 0; j < this.puyoBoard.width; ++j) {
                if(this.puyoBoard.isEmpty(j, i)) {
                    continue;
                }
                ctx.drawImage(this.puyoTexture, store.state.puyoColor[this.puyoBoard.getValue(j, i)].x, 0,
                                this.puyoRadius, this.puyoRadius, (j * this.puyoRadius * this.drawScale) + this.startX,
                                (i * this.puyoRadius * this.drawScale) + this.startY, 
                                this.puyoRadius * this.drawScale, this.puyoRadius * this.drawScale);
            }
        }

        ctx.drawImage(this.puyoTexture, store.state.puyoColor[this.puyo1.color].x, 0,
                        this.puyoRadius, this.puyoRadius, (this.puyo1.x * this.puyoRadius * this.drawScale) + this.startX,
                        (this.puyo1.y * this.puyoRadius * this.drawScale) + this.startY, 
                        this.puyoRadius * this.drawScale, this.puyoRadius * this.drawScale);
        
        ctx.drawImage(this.puyoTexture, store.state.puyoColor[this.puyo2.color].x, 0,
                        this.puyoRadius, this.puyoRadius, (this.puyo2.x * this.puyoRadius * this.drawScale) + this.startX,
                        (this.puyo2.y * this.puyoRadius * this.drawScale) + this.startY, 
                        this.puyoRadius * this.drawScale, this.puyoRadius * this.drawScale);

        ctx.fillStyle = "#FFF";
        ctx.fillRect(this.startX + this.drawnWidth, this.startY, this.nextWidth, this.nextHeight);

        const fontStyle = `${this.fontSize * this.drawScale}px Arial`;
        ctx.font = fontStyle;

        ctx.fillStyle = "#F00";
        ctx.fillText("Next", this.startX + this.drawnWidth, this.startY + (this.fontSize * this.drawScale));

        const nextPuyoX = this.startX + 
                            this.drawnWidth + 
                            ((this.nextWidth - (this.puyoRadius * this.drawScale)) / 2);

        let nextPuyoY = this.startY + ((this.fontSize + 5)* this.drawScale);

        ctx.drawImage(this.puyoTexture, store.state.puyoColor[this.nextPuyo1[0]].x, 0, 
                        this.puyoRadius, this.puyoRadius, nextPuyoX, nextPuyoY,
                        this.puyoRadius * this.drawScale, this.puyoRadius * this.drawScale);

        nextPuyoY += this.puyoRadius * this.drawScale;

        ctx.drawImage(this.puyoTexture, store.state.puyoColor[this.nextPuyo1[1]].x, 0, 
                        this.puyoRadius, this.puyoRadius, nextPuyoX, nextPuyoY,
                        this.puyoRadius * this.drawScale, this.puyoRadius * this.drawScale);

        nextPuyoY += this.puyoRadius * this.drawScale;
        nextPuyoY += this.puyoRadius * this.drawScale;

        ctx.drawImage(this.puyoTexture, store.state.puyoColor[this.nextPuyo2[0]].x, 0, 
                        this.puyoRadius, this.puyoRadius, nextPuyoX, nextPuyoY,
                        this.puyoRadius * this.drawScale, this.puyoRadius * this.drawScale);

        nextPuyoY += this.puyoRadius * this.drawScale;

        ctx.drawImage(this.puyoTexture, store.state.puyoColor[this.nextPuyo2[1]].x, 0, 
                        this.puyoRadius, this.puyoRadius, nextPuyoX, nextPuyoY,
                        this.puyoRadius * this.drawScale, this.puyoRadius * this.drawScale);
    }

    /**
     * puyoPos is a json object with at least two fields:
     * x: number
     * y: number
     */
    getPuyoNeighbour(puyoPos) {
        let result = [];

        if(this.puyoBoard.isValid(puyoPos.x-1, puyoPos.y)) {
            result.push({
                x: puyoPos.x - 1,
                y: puyoPos.y
            });
        }

        if(this.puyoBoard.isValid(puyoPos.x+1, puyoPos.y)) {
            result.push({
                x: puyoPos.x + 1,
                y: puyoPos.y
            });
        }

        if(this.puyoBoard.isValid(puyoPos.x, puyoPos.y - 1) && ((puyoPos.y - 1) > 0)) {
            result.push({
                x: puyoPos.x,
                y: puyoPos.y - 1
            });
        }

        if(this.puyoBoard.isValid(puyoPos.x, puyoPos.y + 1)) {
            result.push({
                x: puyoPos.x,
                y: puyoPos.y + 1
            });
        }

        return result;
    }

    /**
     * puyo is a json object with three fields
     * x: number
     * y: number
     * color: number
     */
    bfsPuyo(puyo) {
        const puyoColor = puyo.color;
        let hasBfs = false;

        /**
         * if the color of puyo is blank ( which means there's no puyo )
         * immediately stops the execution
         */
        if(puyoColor === 0) {
            return hasBfs;
        }

        const queue = [];
        const sameColor = [];
        const visited = [];

        sameColor.push({x: puyo.x, y: puyo.y});
        queue.push({x: puyo.x, y: puyo.y});
        visited.push({x: puyo.x, y: puyo.y});

        /**
         * get all the neighbours that're all same color
         * as puyo
         */
        while(queue.length > 0) {
            const current = queue.shift();

            const neighbours = this.getPuyoNeighbour(current);

            for(const neighbour of neighbours) {
                /**
                 * this part of the code checks
                 * whether or not the neighbour has been
                 * visited prior
                 */
                let isInVisited = false;
                for(const visits of visited) {
                    if(neighbour.x === visits.x && neighbour.y === visits.y) {
                        isInVisited = true;
                        break;
                    }
                }

                if(isInVisited) {
                    continue;
                }

                /**
                 * checks whether or not the neighbour puyo has
                 * same color as what's needed
                 */

                if(this.puyoBoard.getValueVector(neighbour) === puyoColor) {
                    visited.push(neighbour);
                    sameColor.push(neighbour);
                    queue.push(neighbour);
                }
            }
        }

        if(sameColor.length >= 4) {
            hasBfs = true;
            for(const e of sameColor) {
                let contains = false;
                this.markedPuyo.every(elem => {
                    contains = (e.x === elem.x && e.y === elem.y);
                    return !contains;
                });
                if(!contains) {
                    this.markedPuyo.push(e);
                }
            }
        }
        return hasBfs;
    }

    bfsAllPuyo() {
        let hasBfs = false;
        for(let i = this.puyoBoard.height; i >= 0; --i) {
            let rowEmpty = true;
            for(let j = this.puyoBoard.width; j >= 0; --j) {
                const puyoColor = this.puyoBoard.getValue(j, i);
                /**
                 * if there's no puyo in that row, then we can guarantee that there's no
                 * more puyo above. If there's puyo above, that puyo hasn't been gravitied down
                 * after a bfs pass
                 */
                if(puyoColor !== 0) {
                    rowEmpty = false;
                }
                hasBfs = this.bfsPuyo({
                    x: j,
                    y: i,
                    color: puyoColor
                }) || hasBfs;
            }
            if(rowEmpty) {
                break;
            }
        }
        return hasBfs;
    }

    clearMarkedPuyo() {
        if(this.clearEvent !== undefined) {
            this.clearEvent(this.markedPuyo.length, this.puyoChain);
        }

        this.markedPuyo.forEach(elem => {
            this.puyoBoard.setValueVector(elem, 0);
        });

        this.markedPuyo = [];

        this.puyoChain++;
    }

    dropAllPuyo() {
        let puyoDropped = false;
        for(let i = this.puyoBoard.height - 1; i >= 0; --i) {
            for(let j = 0; j < this.puyoBoard.width; ++j) {
                const puyoColor = this.puyoBoard.getValue(j, i);
                const belowColor = this.puyoBoard.getValue(j, i+1);
                if(puyoColor !== undefined &&
                    puyoColor !== 0 &&
                    belowColor !== undefined && 
                    belowColor === 0) 
                {
                    puyoDropped = true;
                    this.puyoBoard.setValue(j, i, 0);
                    const newPos = this.harddropPuyo({
                        x: j,
                        y: i
                    });
                    this.puyoBoard.setValueVector(newPos, puyoColor);
                }
            }
        }
        return puyoDropped;
    }

    *generateNextPuyo() {
        yield 1;
        yield 2;

        yield 1;
        yield 2;

        yield 1;
        yield 2;

        yield 3;
        yield 4;

        yield 1;
        yield 2;
        
        while(true) {
            yield Math.floor(Math.random() * 4) + 1;
        }
    }

    spawnPuyo() {
        if(this.nextPuyo1[0] == 0) {
            this.puyo1.color = this.getNextPuyo.next().value;
            this.puyo2.color = this.getNextPuyo.next().value;

            this.nextPuyo1[0] = this.getNextPuyo.next().value;
            this.nextPuyo1[1] = this.getNextPuyo.next().value;

            this.nextPuyo2[0] = this.getNextPuyo.next().value;
            this.nextPuyo2[1] = this.getNextPuyo.next().value;
        } else {
            this.puyo1.color = this.nextPuyo1[0];
            this.puyo2.color = this.nextPuyo1[1];

            this.nextPuyo1[0] = this.nextPuyo2[0];
            this.nextPuyo1[1] = this.nextPuyo2[1];

            this.nextPuyo2[0] = this.getNextPuyo.next().value;
            this.nextPuyo2[1] = this.getNextPuyo.next().value;
        }

        this.puyo1.x = 2;
        this.puyo1.y = -1;

        this.puyo2.x = 2;
        this.puyo2.y = 0;
    }

    puyoCanMove() {
        const newPuyo1Pos = this.puyo1.y + 1;

        const newPuyo2Pos = this.puyo2.y + 1;

        if(this.puyoBoard.isEmptyAndValid(this.puyo1.x, newPuyo1Pos) &&
            this.puyoBoard.isEmptyAndValid(this.puyo2.x, newPuyo2Pos))
        {
            return true;
        }

        return false;
    }

    tryMoveDynamicPuyo() {
        const newPuyo1Pos = this.puyo1.y + 1;

        const newPuyo2Pos = this.puyo2.y + 1;

        if(this.puyoBoard.isEmptyAndValid(this.puyo1.x, newPuyo1Pos) &&
            this.puyoBoard.isEmptyAndValid(this.puyo2.x, newPuyo2Pos))
        {
            this.puyo1.y = newPuyo1Pos;
            this.puyo2.y = newPuyo2Pos;
        }
    }

    tryMoveLeft() {
        const newPuyo1Pos = this.puyo1.x - 1;
        const newPuyo2Pos = this.puyo2.x - 1;

        if(this.puyoBoard.isEmptyAndValid(newPuyo1Pos, this.puyo1.y) &&
            this.puyoBoard.isEmptyAndValid(newPuyo2Pos, this.puyo2.y))
        {
            this.puyo1.x = newPuyo1Pos;
            this.puyo2.x = newPuyo2Pos;
        }
    }

    tryMoveRight() {
        const newPuyo1Pos = this.puyo1.x + 1;
        const newPuyo2Pos = this.puyo2.x + 1;

        if(this.puyoBoard.isEmptyAndValid(newPuyo1Pos, this.puyo1.y) &&
            this.puyoBoard.isEmptyAndValid(newPuyo2Pos, this.puyo2.y))
        {
            this.puyo1.x = newPuyo1Pos;
            this.puyo2.x = newPuyo2Pos;
        }
    }

    rotatePuyo(rotateDirection, rotateCheck) {
        const newPos = {
            x: this.puyo2.x + rotateDirection.x,
            y: this.puyo2.y + rotateDirection.y
        };

        for(const elem of rotateCheck) {
            const newPos1 = {
                x: this.puyo1.x + elem.x,
                y: this.puyo1.y + elem.y
            };

            const newPos2 = {
                x: newPos.x + elem.x,
                y: newPos.y + elem.y
            }

            if(this.puyoBoard.isEmptyAndValidVector(newPos1) && this.puyoBoard.isEmptyAndValidVector(newPos2)) {
                this.puyo1.x= newPos1.x;
                this.puyo1.y = newPos1.y;

                this.puyo2.x = newPos2.x;
                this.puyo2.y = newPos2.y;
                break;
            }
        }
    }

    /**
     * pos is a JSON object with x and y as field
     */
    harddropPuyo(pos) {
        let newPos = pos;
        newPos.y += 1;
        while(this.puyoBoard.isEmptyAndValidVector(newPos)) {
            newPos.y += 1;
        }

        newPos.y -= 1;
        return newPos;
    }

    tryHarddropPuyo() {
        if(this.puyo1.x == this.puyo2.x) {
            if(this.puyo1.y > this.puyo2.y) {
                const newPuyoPos = this.harddropPuyo({x: this.puyo1.x, y: this.puyo1.y});
                this.puyo1.y = newPuyoPos.y;

                this.puyo2.y = this.puyo1.y - 1;
            } else {
                const newPuyoPos = this.harddropPuyo({x: this.puyo2.x, y: this.puyo2.y});
                this.puyo2.y = newPuyoPos.y;

                this.puyo1.y = this.puyo2.y - 1;
            }
        } else {
            const newPuyo1Pos = this.harddropPuyo({x: this.puyo1.x, y: this.puyo1.y});
            this.puyo1.y = newPuyo1Pos.y;

            const newPuyo2Pos = this.harddropPuyo({x: this.puyo2.x, y: this.puyo2.y});
            this.puyo2.y = newPuyo2Pos.y;
        }

        this.lockPuyo();
    }

    trySoftdropPuyo() {
        if(this.puyo1.x == this.puyo2.x) {
            let newPos;
            if(this.puyo1.y > this.puyo2.y) {
                newPos = {
                    x: this.puyo1.x,
                    y: this.puyo1.y + 1
                };
            } else {
                newPos = {
                    x: this.puyo2.x,
                    y: this.puyo2.y + 1
                }
            }

            if(this.puyoBoard.isEmptyAndValidVector(newPos)) {
                this.puyo1.y += 1;
                this.puyo2.y += 1;
            }
        } else {
            const newPos1 = {
                x: this.puyo1.x,
                y: this.puyo1.y + 1
            };

            const newPos2 = {
                x: this.puyo2.x,
                y: this.puyo2.y + 1
            };

            if(this.puyoBoard.isEmptyAndValidVector(newPos1) && this.puyoBoard.isEmptyAndValidVector(newPos2)) {
                this.puyo1.y += 1;
                this.puyo2.y += 1
            }
        }
    }

    /**
     * @param {string} rotateSystem
     */
    tryRotateCCW(rotateSystem) {
        //anchor and other puyo same x
        if(this.puyo1.x == this.puyo2.x) {
            //the anchor is below
            if(this.puyo1.y > this.puyo2.y) {
                this.rotatePuyo({x: -1, y: 1}, rotateSystem["below"]);
            } //the anchor is above
            else if(this.puyo1.y < this.puyo2.y) {
                this.rotatePuyo({x: 1, y: -1}, rotateSystem["above"]);
            }
        } //anchor and other puyo same line
        else {
            //anchor is to the left
            if(this.puyo1.x < this.puyo2.x) {
                this.rotatePuyo({x: -1, y: -1}, rotateSystem["left"]);
            } //anchor is to the right
            else if(this.puyo1.x > this.puyo2.x) {
                this.rotatePuyo({x: 1, y: 1}, rotateSystem["right"]);
            }
        }
    }

    tryRotateCW(rotateSystem) {
        //anchor and other puyo same x
        if(this.puyo1.x == this.puyo2.x) {
            //the anchor is below
            if(this.puyo1.y > this.puyo2.y) {
                this.rotatePuyo({x: 1, y: 1}, rotateSystem["below"]);
            } //the anchor is above
            else if(this.puyo1.y < this.puyo2.y) {
                this.rotatePuyo({x: -1, y: -1}, rotateSystem["above"]);
            }
        } //anchor and other puyo same line
        else {
            //anchor is to the left
            if(this.puyo1.x < this.puyo2.x) {
                this.rotatePuyo({x: -1, y: 1}, rotateSystem["left"]);
            } //anchor is to the right
            else if(this.puyo1.x > this.puyo2.x) {
                this.rotatePuyo({x: 1, y: -1}, rotateSystem["right"]);
            }
        }
    }

    lockPuyo() {
        this.puyoBoard.setValue(this.puyo1.x, this.puyo1.y, this.puyo1.color);
        this.puyoBoard.setValue(this.puyo2.x, this.puyo2.y, this.puyo2.color);

        this.puyo1.y = undefined;
        this.puyo2.y = undefined;
    }

    playerProcess(elapsed, store) {
        this.gravityCnt += elapsed;

        if(!this.puyoCanMove()) {
            if(this.lockDelayCnt > store.state.lockDelay) {
                this.tryHarddropPuyo();
                this.lockDelayCnt = 0;
                this.gravityCnt = 0;
                return;
            } else {
                this.lockDelayCnt += elapsed;
            }
        }

        if(this.gravityCnt > this.gravity) {
            this.tryMoveDynamicPuyo();
            this.gravityCnt -= this.gravity;
        }

        if(this.markedPuyo.length === 0) {
            this.bfsAllPuyo();

            if(this.markedPuyo.length > 0) {
                this.clearDelayCnt = this.clearDelay;
            } else {
                if(this.puyo1.y === undefined) {
                    this.puyoChain = 0;
                    this.spawnPuyo();
                }
            }
        } else {
            if(this.clearDelayCnt <= 0) {
                this.clearMarkedPuyo();
                this.dropAllPuyo();

                this.bfsAllPuyo();
                if(this.markedPuyo.length > 0) {
                    this.clearDelayCnt = this.clearDelay;
                }
            } else {
                this.clearDelayCnt -= elapsed;
            }
        }
    }

    process(elapsed, store) {
        if(this.isPlayer) {
            this.playerProcess(elapsed, store);
        }
    }
}

export {
    PuyoController
}