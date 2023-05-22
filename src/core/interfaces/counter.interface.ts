export interface ICounter<T> {
    type: T;
    progress: number;
    isCompleted: boolean;
    update(): void;
}
