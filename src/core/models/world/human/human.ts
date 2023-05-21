import { useControlStore } from '../../../../stores/control.store';
import { Stack } from '../../generic/stack';
import { MoveOption } from '../move-option';
import { SolidObject } from '../solid-object';
import { HumanState } from '../../../enums/human-state.enum';
import { Orientation } from '../../../enums/orientation.enum';

import { MotorSystem } from './motor-system';

export class Human extends SolidObject {
    private readonly _controlStore = useControlStore();
    private readonly _motorSystem = new MotorSystem();
    private _states = new Stack([HumanState.Idle]);

    public initialize(): this {
        this._motorSystem.initialize(this._graphics, this._sceneStore.cameraHeight * 0.02);
        this._graphics.pivot.set(this._graphics.width / 2, this._graphics.height / 2);
        this._sceneStore.addToStage(this._graphics);

        return this;
    }

    public update(): void {
        this.updateOrientation();
        this._motorSystem.update(this._states.peek(), new MoveOption(this.orientation, this.orientation));
    }

    private updateOrientation(): void {
        if (!this._controlStore.pointer) {
            return;
        }

        const { x: targetX, y: targetY } = this._controlStore.pointer;
        const sourceX = this._sceneStore.cameraWidth / 2;
        const sourceY = this._sceneStore.cameraHeight / 2;
        const angle = Math.atan2(targetY - sourceY, targetX - sourceX) * 180 / Math.PI;
        const isRight = (angle > 0 && angle <= 90) || (angle > -90 && angle <= 0);
        this.orientation = isRight ? Orientation.Right : Orientation.Left;
    }
}
