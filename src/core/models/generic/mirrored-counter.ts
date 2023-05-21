export class MirroredCounter<T> {
    public type!: T;
    private readonly _min = -1;
    private readonly _max = 1;
    private _speed!: number;
    private _current = this._min;

    constructor(type: T, speed = 0.01) {
        this.type = type;
        this._speed = speed;
    }

    get isForward(): boolean {
        return this._current <= 0;
    }

    get progress(): number {
        return this.isForward ? this._current + 1 : 1 - this._current;
    }

    public update(): void {
        this._current += this._speed;

        if (this._current > this._max) {
            this._current = this._min;
        }
    }
}
