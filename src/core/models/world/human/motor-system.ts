import type { Graphics } from 'pixijs';

import { MirroredCounter } from '../../generic/mirrored-counter';
import type { MoveOption } from '../move-option';
import { HumanState } from '../../../enums/human-state.enum';
import { Orientation } from '../../../enums/orientation.enum';

import { HumanBodyParts } from './human-body-parts';
import type { HumanMovement } from './movements/human-movement';
import { IdleMovement } from './movements/idle-movement';
import { WalkMovement } from './movements/walk-movement';
import { SprintMovement } from './movements/sprint-movement';

export class MotorSystem {
    private readonly _orientationKeys = [Orientation.Left, Orientation.Right];
    private readonly _movements = new Map<HumanState, HumanMovement>();
    private readonly _bodyPartsSet = new Map<Orientation, HumanBodyParts>();
    private _bodyParts!: HumanBodyParts;
    private _counter!: MirroredCounter<HumanState>;

    public initialize(humanGraphics: Graphics, headRadius: number): void {
        for (const key of this._orientationKeys) {
            const parts = new HumanBodyParts().initialize(headRadius, key);
            this._bodyPartsSet.set(key, parts);
            humanGraphics.addChild(parts.graphics);
        }

        this._movements.set(HumanState.Idle, new IdleMovement());
        this._movements.set(HumanState.Walk, new WalkMovement());
        this._movements.set(HumanState.Sprint, new SprintMovement());
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
        const isInvalidCounter = !this._counter || state !== this._counter.type;

        if (isInvalidCounter && state === HumanState.Idle) {
            this._counter = new MirroredCounter(state, 0.04);
        }
        else if (isInvalidCounter && state === HumanState.Walk) {
            this._counter = new MirroredCounter(state, 0.05);
        }
        else if (isInvalidCounter && state === HumanState.Sprint) {
            this._counter = new MirroredCounter(state, 0.08);
        }

        this._bodyParts.reset();
        this._counter.update();
    }
}
