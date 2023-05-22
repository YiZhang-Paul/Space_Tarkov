import type { ICounter } from '../../interfaces/counter.interface';

export class SimpleCounter<T> implements ICounter<T> {
    public type!: T;
    private _speed!: number;
    private _current = 0;

    constructor(type: T, speed = 0.01) {
        this.type = type;
        this._speed = speed;
    }

    get progress(): number {
        return this._current;
    }

    get isCompleted(): boolean {
        return this._current === 1;
    }

    public update(): void {
        this._current = Math.min(this._current + this._speed, 1);
    }
}
