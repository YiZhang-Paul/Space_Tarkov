import { SolidObject } from '../solid-object';
import type { Orientation } from '../../../enums/orientation.enum';

export class BodyParts extends SolidObject {
    private _head = this._sceneStore.createGraphics();
    private _trunk = this._sceneStore.createGraphics();
    private _leftHand = this._sceneStore.createGraphics();
    private _rightHand = this._sceneStore.createGraphics();
    private _leftLeg = this._sceneStore.createGraphics();
    private _rightLeg = this._sceneStore.createGraphics();

    public initialize(headRadius: number, orientation: Orientation): this {
        this.orientation = orientation;

        return this;
    }
}
