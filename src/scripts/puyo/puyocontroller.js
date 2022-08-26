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

        this.puyoRadius = 16; //pixels

        this.puyoBoard = new PuyoBoard();

        this.drawnWidth = this.puyoBoard.width * this.puyoRadius * this.drawScale;
        this.drawnHeight = this.puyoBoard.height * this.puyoRadius * this.drawScale;

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
    }

    spawnPuyo() {
        this.puyo1.x = 2;
        this.puyo1.y = -1;
        this.puyo1.color = Math.floor(Math.random() * 4) + 1;

        this.puyo2.x = 2;
        this.puyo2.y = 0;
        this.puyo2.color = Math.floor(Math.random() * 4) + 1;
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

    tryMoveLeft() 
    {
        const newPuyo1Pos = this.puyo1.x - 1;
        const newPuyo2Pos = this.puyo2.x - 1;

        if(this.puyoBoard.isEmptyAndValid(newPuyo1Pos, this.puyo1.y) &&
            this.puyoBoard.isEmptyAndValid(newPuyo2Pos, this.puyo2.y))
        {
            this.puyo1.x = newPuyo1Pos;
            this.puyo2.x = newPuyo2Pos;
        }
    }

    tryMoveRight() 
    {
        const newPuyo1Pos = this.puyo1.x + 1;
        const newPuyo2Pos = this.puyo2.x + 1;

        if(this.puyoBoard.isEmptyAndValid(newPuyo1Pos, this.puyo1.y) &&
            this.puyoBoard.isEmptyAndValid(newPuyo2Pos, this.puyo2.y))
        {
            this.puyo1.x = newPuyo1Pos;
            this.puyo2.x = newPuyo2Pos;
        }
    }

    rotatePuyo(rotateDirection, rotateCheck) 
    {
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
        this.spawnPuyo();
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
    }

    process(elapsed, store) {
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
    }
}

export {
    PuyoController
}