import { SolidObject } from '../solid-object';

import { MotorSystem } from './motor-system';

export class Human extends SolidObject {
    private readonly _motorSystem = new MotorSystem();

    public initialize(): this {
        this._motorSystem.initialize(this._graphics, this._rendererStore.viewHeight * 0.02, this.orientation);
        this._graphics.pivot.set(this._graphics.width / 2, this._graphics.height / 2);
        this._rendererStore.addToStage(this._graphics);

        return this;
    }

    public update(): void {
        this._motorSystem.update(this.orientation);
    }
}
