import { useControlStore } from '../../../../stores/control.store';
import { Stack } from '../../generic/stack';
import { KeyValuePair } from '../../generic/key-value-pair';
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

        this._motorSystem.onBoostingCompleted = () => {
            if (this._controlStore.isBoostKeyPressed) {
                this._states.swap(HumanState.Boosted);
            }
            else {
                this._states.pop();
            }
        };

        this._motorSystem.onFreeFallCompleted = () => this._states.pop();
        this._graphics.pivot.set(this._graphics.width / 2, this._graphics.height / 2);
        this._sceneStore.addToStage(this._graphics);

        return this;
    }

    public update(): void {
        this.updateOrientation();
        this.updateState();
        this.updateMovement();
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

    private updateState(): void {
        const state = this._states.peek();

        if (state === HumanState.Boosting || state === HumanState.FreeFall) {
            return;
        }

        if (this._controlStore.isBoostKeyPressed) {

            if (state === HumanState.Boosted) {
                return;
            }

            this._states.push(HumanState.FreeFall);
            this._states.push(HumanState.Boosting);

            return;
        }

        if (state === HumanState.Boosted) {
            this._states.pop();

            return;
        }

        const direction = this.getMovingDirection();

        if (!direction) {

            if (state === HumanState.Idle) {
                return;
            }

            this._states.pop();

            return;
        }

        if (this._controlStore.isSprintKeyPressed) {

            if (state === HumanState.Sprint) {
                return;
            }

            if (state === HumanState.Idle) {
                this._states.push(HumanState.Sprint);
            }
            else {
                this._states.swap(HumanState.Sprint);
            }

            return;
        }

        if (state === HumanState.Idle) {
            this._states.push(HumanState.Walk);
        }
    }

    private updateMovement(): void {
        const boostHeight = this._sceneStore.cameraHeight / 30;
        const option = new MoveOption(this.orientation, this.getMovingDirection(), boostHeight);
        this._motorSystem.update(this._states.peek(), option);
    }

    private getMovingDirection(): Orientation | null {
        const { moveUp, moveDown, moveLeft, moveRight } = this._controlStore.controlKeys;
        const verticalKeys = [new KeyValuePair(moveUp, Orientation.Up), new KeyValuePair(moveDown, Orientation.Down)];
        const horizontalKeys = [new KeyValuePair(moveLeft, Orientation.Left), new KeyValuePair(moveRight, Orientation.Right)];
        const vertical = this._controlStore.lastKeyPressed(verticalKeys)?.value ?? null;
        const horizontal = this._controlStore.lastKeyPressed(horizontalKeys)?.value ?? null;

        if (vertical === Orientation.Up && horizontal === Orientation.Left) {
            return Orientation.UpLeft;
        }

        if (vertical === Orientation.Up && horizontal === Orientation.Right) {
            return Orientation.UpRight;
        }

        if (vertical === Orientation.Down && horizontal === Orientation.Left) {
            return Orientation.DownLeft;
        }

        if (vertical === Orientation.Down && horizontal === Orientation.Right) {
            return Orientation.DownRight;
        }

        return vertical ? vertical : horizontal;
    }
}
