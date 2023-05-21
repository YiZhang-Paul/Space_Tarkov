import type { Graphics } from 'pixijs';
import { Orientation } from '../../../enums/orientation.enum';

import { BodyParts } from './body-parts';

export class MotorSystem {
    private readonly _orientationKeys = [Orientation.Left, Orientation.Right];
    private readonly _bodyPartsSet = new Map<Orientation, BodyParts>();
    private _bodyParts!: BodyParts;

    public initialize(humanGraphics: Graphics, headRadius: number, orientation: Orientation): void {
        for (const key of this._orientationKeys) {
            const parts = new BodyParts().initialize(headRadius, key);
            this._bodyPartsSet.set(key, parts);
            humanGraphics.addChild(parts.graphics);
        }
    }

    public update(orientation: Orientation): void {
        this.updateOrientation(orientation);
    }

    private updateOrientation(orientation: Orientation): void {
        for (const key of this._orientationKeys) {
            this._bodyPartsSet.get(key)!.visible = orientation === key;
        }

        this._bodyParts = this._bodyPartsSet.get(orientation)!;
    }
}
