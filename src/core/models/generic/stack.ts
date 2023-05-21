export class Stack<T> {
    private readonly _items: T[] = [];

    constructor(items: T[]) {
        this._items.push(...items);
    }

    get isEmpty(): boolean {
        return !this._items.length;
    }

    public peek(): T {
        if (this.isEmpty) {
            throw new Error('Stack is empty.');
        }

        return this._items[this._items.length - 1];
    }

    public swap(item: T): void {
        if (this.isEmpty) {
            throw new Error('Stack is empty.');
        }

        this._items[this._items.length - 1] = item;
    }

    public push(item: T): void {
        this._items.push(item);
    }

    public pop(): T {
        if (this.isEmpty) {
            throw new Error('Stack is empty.');
        }

        return this._items.pop()!;
    }
}
