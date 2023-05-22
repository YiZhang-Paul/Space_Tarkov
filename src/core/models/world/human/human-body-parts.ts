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

    get leftHand(): Graphics {
        return this._leftHand;
    }

    get rightHand(): Graphics {
        return this._rightHand;
    }

    get leftLeg(): Graphics {
        return this._leftLeg;
    }

    get rightLeg(): Graphics {
        return this._rightLeg;
    }

    get defaultCenterX(): number {
        return (this._trunk.width + this._leftHand.width / 2 + this._rightHand.width / 2) / 2;
    }

    get defaultHeadY(): number {
        return this._head.height / 2;
    }

    get defaultTrunkLeftX(): number {
        return this.defaultCenterX - this._trunk.width / 2;
    }

    get defaultTrunkRightX(): number {
        return this.defaultCenterX + this._trunk.width / 2
    }

    get defaultTrunkY(): number {
        return this._head.height + this._trunk.height / 2;
    }

    get defaultLeftLegX(): number {
        return this.defaultTrunkLeftX + this._leftLeg.width / 2;
    }

    get defaultRightLegX(): number {
        return this.defaultTrunkRightX - this._rightLeg.width / 2;
    }

    public initialize(headRadius: number, orientation: Orientation): this {
        this.orientation = orientation;
        this.initializeHead(headRadius);
        this.initializeTrunk();
        this.initializeHand(true);
        this.initializeHand(false);
        this.initializeLeg(true);
        this.initializeLeg(false);
        this.reset();

        return this;
    }

    public reset(): void {
        for (const child of this._graphics.children) {
            child.angle = 0;
            child.scale.y = 1;
        }

        this.assemble();
        this.setLayerIndex();
        this.initializeParentContainer();
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
        hand.pivot.y = -hand.height;
        this._graphics.addChild(hand);
    }

    private initializeLeg(isLeft: boolean): void {
        const leg = isLeft ? this._leftLeg : this._rightLeg;
        leg.drawRect(0, 0, this._trunk.width / 5 * 2, this._trunk.height / 5 * 4);
        leg.pivot.set(leg.width / 2);
        this._graphics.addChild(leg);
    }

    private initializeParentContainer(): void {
        this.graphics.angle = 0;
        this.graphics.y = 0;
        this.graphics.pivot.set(this.graphics.width / 2, this.graphics.height / 2);
    }

    private assemble(): void {
        const isRight = this.orientation === Orientation.Right;
        const trunkBottom = this._head.height + this._trunk.height;
        this._head.position.set(this.defaultCenterX, this.defaultHeadY);
        this._trunk.position.set(this._head.x, this.defaultTrunkY);
        this._leftHand.position.set(this.defaultTrunkLeftX, this._head.height - this._trunk.height / 15 * (isRight ? -1 : 1));
        this._rightHand.position.set(this.defaultTrunkRightX, this._head.height - this._trunk.height / 15 * (isRight ? 1 : -1));
        this._leftLeg.position.set(this.defaultLeftLegX, trunkBottom - (isRight ? 0 : this._leftLeg.height / 10));
        this._rightLeg.position.set(this.defaultRightLegX, trunkBottom - (isRight ? this._rightLeg.height / 10 : 0));
    }

    private setLayerIndex(): void {
        const isRight = this.orientation === Orientation.Right;
        this._leftHand.zIndex = isRight ? 2 : -2;
        this._rightHand.zIndex = -this._leftHand.zIndex;
        this._leftLeg.zIndex = isRight ? 1 : -1;
        this._rightLeg.zIndex = -this._leftLeg.zIndex;
    }
}
