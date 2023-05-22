import type { Graphics } from 'pixijs';

import type { ICounter } from '../../../interfaces/counter.interface';
import { SimpleCounter } from '../../generic/simple-counter';
import { MirroredCounter } from '../../generic/mirrored-counter';
import type { MoveOption } from '../move-option';
import { HumanState } from '../../../enums/human-state.enum';
import { Orientation } from '../../../enums/orientation.enum';

import { HumanBodyParts } from './human-body-parts';
import type { HumanMovement } from './movements/human-movement';
import { IdleMovement } from './movements/idle-movement';
import { WalkMovement } from './movements/walk-movement';
import { SprintMovement } from './movements/sprint-movement';
import { BoostingMovement } from './movements/boosting-movement';
import { BoostedMovement } from './movements/boosted-movement';
import { FreeFallMovement } from './movements/free-fall-movement';

export class MotorSystem {
    public onBoostingCompleted?: () => void;
    public onFreeFallCompleted?: () => void;
    private readonly _orientationKeys = [Orientation.Left, Orientation.Right];
    private readonly _movements = new Map<HumanState, HumanMovement<ICounter<HumanState>>>();
    private readonly _bodyPartsSet = new Map<Orientation, HumanBodyParts>();
    private _bodyParts!: HumanBodyParts;
    private _counter!: ICounter<HumanState>;

    public initialize(humanGraphics: Graphics, headRadius: number): void {
        for (const key of this._orientationKeys) {
            const parts = new HumanBodyParts().initialize(headRadius, key);
            this._bodyPartsSet.set(key, parts);
            humanGraphics.addChild(parts.graphics);
        }

        this._movements.set(HumanState.Idle, new IdleMovement());
        this._movements.set(HumanState.Walk, new WalkMovement());
        this._movements.set(HumanState.Sprint, new SprintMovement());
        this._movements.set(HumanState.Boosting, new BoostingMovement());
        this._movements.set(HumanState.Boosted, new BoostedMovement());
        this._movements.set(HumanState.FreeFall, new FreeFallMovement());
    }

    public update(state: HumanState, option: MoveOption): void {
        this.updateOrientation(option.facing);
        this.updateCounter(state);
        this._movements.get(state)!.update(this._bodyParts, this._counter, option);
    }

    private updateOrientation(orientation: Orientation): void {
        for (const key of this._orientationKeys) {
            this._bodyPartsSet.get(key)!.visible = orientation === key;
        }

        this._bodyParts = this._bodyPartsSet.get(orientation)!;
    }

    private updateCounter(state: HumanState): void {
        const isInvalidCounter = state !== this._counter?.type;

        if (isInvalidCounter && state === HumanState.Idle) {
            this._counter = new MirroredCounter(state, 0.04);
        }
        else if (isInvalidCounter && state === HumanState.Walk) {
            this._counter = new MirroredCounter(state, 0.05);
        }
        else if (isInvalidCounter && state === HumanState.Sprint) {
            this._counter = new MirroredCounter(state, 0.08);
        }
        else if (isInvalidCounter && state === HumanState.Boosting) {
            this._counter = new SimpleCounter(state, 0.05);
        }
        else if (isInvalidCounter && state === HumanState.Boosted) {
            this._counter = new MirroredCounter(state, 0.05);
        }
        else if (isInvalidCounter && state === HumanState.FreeFall) {
            this._counter = new SimpleCounter(state, 0.05);
        }

        this._bodyParts.reset();
        this._counter.update();
        this.checkCounterEvents();
    }

    private checkCounterEvents(): void {
        if (this._counter.type === HumanState.Boosting && this._counter.isCompleted && this.onBoostingCompleted) {
            this.onBoostingCompleted();
        }
        else if (this._counter.type === HumanState.FreeFall && this._counter.isCompleted && this.onFreeFallCompleted) {
            this.onFreeFallCompleted();
        }
    }
}
