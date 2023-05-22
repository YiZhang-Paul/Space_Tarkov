import { useControlStore } from '../../stores/control.store';
import { Stack } from '../models/generic/stack';
import { HumanState } from '../enums/human-state.enum';
import type { Orientation } from '../enums/orientation.enum';

export class HumanStateMachine {
    private readonly _controlStore = useControlStore();
    private _states = new Stack([HumanState.Idle]);

    get state(): HumanState {
        return this._states.peek();
    }

    public onBoostingCompleted(): void {
        if (this._controlStore.isBoostKeyPressed) {
            this._states.swap(HumanState.Boosted);
        }
        else {
            this._states.pop();
        }
    }

    public onFreeFallCompleted(): void {
        this._states.pop();
    }

    public update(direction: Orientation | null): void {
        const state = this._states.peek();

        if (state === HumanState.Boosting || state === HumanState.FreeFall) {
            return;
        }

        if (this._controlStore.isBoostKeyPressed) {

            if (state === HumanState.Boosted) {
                return;
            }

            if (state === HumanState.Idle) {
                this._states.push(HumanState.FreeFall);
            }
            else {
                this._states.swap(HumanState.FreeFall);
            }

            this._states.push(HumanState.Boosting);

            return;
        }

        if (state === HumanState.Boosted) {
            this._states.pop();

            return;
        }

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
        else {
            this._states.swap(HumanState.Walk);
        }
    }
}
