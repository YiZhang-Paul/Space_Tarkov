import { useControlStore } from '../../../../stores/control.store';
import { HumanMotorSystem } from '../../../services/human-motor-system';
import { HumanStateMachine } from '../../../services/human-state-machine';
import { KeyValuePair } from '../../generic/key-value-pair';
import { Creature } from '../creature';
import { MoveOption } from '../move-option';
import { Orientation } from '../../../enums/orientation.enum';
import { HumanState } from '../../../enums/human-state.enum';

export class Human extends Creature {
    private readonly _controlStore = useControlStore();
    private readonly _motorSystem = new HumanMotorSystem();
    private readonly _stateMachine = new HumanStateMachine();

    get speed(): number {
        const { state } = this._stateMachine;

        if (state === HumanState.Boosted) {
            return this._baseSprintSpeed * 2;
        }

        if (state === HumanState.Sprint) {
            return this._baseSprintSpeed;
        }

        if (state === HumanState.Walk) {
            return this._baseWalkSpeed;
        }

        return 0;
    }

    public initialize(): this {
        this._baseWalkSpeed = this._sceneStore.cameraHeight * 0.002;
        this._baseSprintSpeed = this._sceneStore.cameraHeight * 0.005;
        this._motorSystem.initialize(this._graphics, this._sceneStore.cameraHeight * 0.02);
        this._motorSystem.onBoostingCompleted = this._stateMachine.onBoostingCompleted.bind(this._stateMachine);
        this._motorSystem.onFreeFallCompleted = this._stateMachine.onFreeFallCompleted.bind(this._stateMachine);
        this._graphics.pivot.set(this._graphics.width / 2, this._graphics.height / 2);
        this._sceneStore.addToStage(this._graphics);

        return this;
    }

    public update(): void {
        this.updateOrientation();
        this.updateState();
        this.updatePosition();
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
        const direction = this.getMovingDirection();
        this._stateMachine.update(direction);
    }

    private updatePosition(): void {
        const direction = this.getMovingDirection();

        if (!direction) {
            return;
        }

        if ([Orientation.Up, Orientation.UpLeft, Orientation.UpRight].includes(direction)) {
            this.y -= this.speed;
        }
        else if ([Orientation.Down, Orientation.DownLeft, Orientation.DownRight].includes(direction)) {
            this.y += this.speed;
        }

        if ([Orientation.Left, Orientation.UpLeft, Orientation.DownLeft].includes(direction)) {
            this.x -= this.speed;
        }
        else if ([Orientation.Right, Orientation.UpRight, Orientation.DownRight].includes(direction)) {
            this.x += this.speed;
        }
    }

    private updateMovement(): void {
        const boostHeight = this._sceneStore.cameraHeight / 30;
        const option = new MoveOption(this.orientation, this.getMovingDirection(), boostHeight);
        this._motorSystem.update(this._stateMachine.state, option);
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
