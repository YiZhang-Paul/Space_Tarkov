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
        if (this.checkLockedStates()) {
            return;
        }

        if (this.checkBoosterStates()) {
            return;
        }

        if (this.checkIdleState(direction)) {
            return;
        }

        if (this.checkSprintState()) {
            return;
        }

        this.checkWalkState();
    }

    private checkLockedStates(): boolean {
        return [HumanState.Boosting, HumanState.FreeFall].includes(this._states.peek());
    }

    private checkBoosterStates(): boolean {
        if (this._states.peek() === HumanState.Boosted && !this._controlStore.isBoostKeyPressed) {
            this._states.pop();

            return true;
        }

        if (!this._controlStore.isBoostKeyPressed) {
            return false;
        }

        if (this._states.peek() === HumanState.Boosted) {
            return true;
        }

        if (this._states.peek() === HumanState.Idle) {
            this._states.push(HumanState.FreeFall);
        }
        else {
            this._states.swap(HumanState.FreeFall);
        }

        this._states.push(HumanState.Boosting);

        return true;
    }

    private checkIdleState(direction: Orientation | null): boolean {
        if (direction) {
            return false;
        }

        if (this._states.peek() !== HumanState.Idle) {
            this._states.pop();
        }

        return true;
    }

    private checkSprintState(): boolean {
        if (!this._controlStore.isSprintKeyPressed) {
            return false;
        }

        if (this._states.peek() === HumanState.Sprint) {
            return true;
        }

        if (this._states.peek() === HumanState.Idle) {
            this._states.push(HumanState.Sprint);
        }
        else {
            this._states.swap(HumanState.Sprint);
        }

        return true;
    }

    private checkWalkState(): void {
        if (this._states.peek() === HumanState.Idle) {
            this._states.push(HumanState.Walk);
        }
        else {
            this._states.swap(HumanState.Walk);
        }
    }
}
