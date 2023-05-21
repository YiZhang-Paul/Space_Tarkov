import type { Graphics } from 'pixijs';

import { BodyParts } from '../body-parts';
import { Orientation } from '../../../enums/orientation.enum';

export class HumanBodyParts extends BodyParts {
    private _head = this._sceneStore.createGraphics();
    private _trunk = this._sceneStore.createGraphics();
    private _leftHand = this._sceneStore.createGraphics(0xef74e2);
    private _rightHand = this._sceneStore.createGraphics(0xef74e2);
    private _leftLeg = this._sceneStore.createGraphics(0x2a31d7);
    private _rightLeg = this._sceneStore.createGraphics(0x2a31d7);

    get head(): Graphics {
        return this._head;
    }

    get trunk(): Graphics {
        return this._trunk;
    }

    get defaultHeadY(): number {
        return this._head.height / 2;
    }

    get defaultTrunkY(): number {
        return this._head.height + this._trunk.height / 2;
    }

    public initialize(headRadius: number, orientation: Orientation): this {
        this.orientation = orientation;
        this.initializeHead(headRadius);
        this.initializeTrunk();
        this.initializeHand(true);
        this.initializeHand(false);
        this.initializeLeg(true);
        this.initializeLeg(false);
        this.assemble();
        this.setLayerIndex();

        return this;
    }

    private initializeHead(headRadius: number): void {
        this._head.drawCircle(0, 0, headRadius);
        this._graphics.addChild(this._head);
    }

    private initializeTrunk(): void {
        this._trunk.drawRect(0, 0, this._head.height / 5 * 4, this._head.height / 5 * 3);
        this._trunk.pivot.set(this._trunk.width / 2, this._trunk.height / 2);
        this._graphics.addChild(this._trunk);
    }

    private initializeHand(isLeft: boolean): void {
        const hand = isLeft ? this._leftHand : this._rightHand;
        hand.drawCircle(0, 0, this._head.height / 5);
        this._graphics.addChild(hand);
    }

    private initializeLeg(isLeft: boolean): void {
        const leg = isLeft ? this._leftLeg : this._rightLeg;
        leg.drawRect(0, 0, this._trunk.width / 5 * 2, this._trunk.height / 5 * 4);
        leg.pivot.set(leg.width / 2);
        this._graphics.addChild(leg);
    }

    private assemble(): void {
        const isRight = this.orientation === Orientation.Right;
        const center = (this._trunk.width + this._leftHand.width / 2 + this._rightHand.width / 2) / 2;
        const trunkLeft = center - this._trunk.width / 2;
        const trunkRight = center + this._trunk.width / 2;
        const trunkBottom = this._head.height + this._trunk.height;
        this._head.position.set(center, this.defaultHeadY);
        this._trunk.position.set(this._head.x, this.defaultTrunkY);
        this._leftHand.position.set(trunkLeft, this._trunk.y + this._trunk.height / 15 * (isRight ? 1 : -1));
        this._rightHand.position.set(trunkRight, this._trunk.y + this._trunk.height / 15 * (isRight ? -1 : 1));
        this._leftLeg.position.set(trunkLeft + this._leftLeg.width / 2, trunkBottom - (isRight ? 0 : this._leftLeg.height / 10));
        this._rightLeg.position.set(trunkRight - this._rightLeg.width / 2, trunkBottom - (isRight ? this._rightLeg.height / 10 : 0));
    }

    private setLayerIndex(): void {
        const isRight = this.orientation === Orientation.Right;
        this._leftHand.zIndex = isRight ? 2 : -2;
        this._rightHand.zIndex = -this._leftHand.zIndex;
        this._leftLeg.zIndex = isRight ? 1 : -1;
        this._rightLeg.zIndex = -this._leftLeg.zIndex;
    }
}
