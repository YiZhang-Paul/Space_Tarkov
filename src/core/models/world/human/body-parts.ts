import { SolidObject } from '../solid-object';
import type { Orientation } from '../../../enums/orientation.enum';

export class BodyParts extends SolidObject {
    private _head = this._rendererStore.createGraphics();
    private _trunk = this._rendererStore.createGraphics();
    private _leftHand = this._rendererStore.createGraphics();
    private _rightHand = this._rendererStore.createGraphics();
    private _leftLeg = this._rendererStore.createGraphics();
    private _rightLeg = this._rendererStore.createGraphics();

    public initialize(headRadius: number, orientation: Orientation): this {
        this.orientation = orientation;

        return this;
    }
}
