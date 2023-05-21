import type { Graphics } from 'pixijs';

import { useRendererStore } from '../../../stores/renderer.store';
import { Orientation } from '../../enums/orientation.enum';

export abstract class SolidObject {
    public x = 0;
    public y = 0;
    public orientation = Orientation.Right;
    protected readonly _rendererStore = useRendererStore();
    protected readonly _graphics = this._rendererStore.createGraphics();

    constructor() {
        this._graphics.sortableChildren = true;
    }

    get graphics(): Graphics {
        return this._graphics;
    }

    get visible(): boolean {
        return this._graphics.visible;
    }

    set visible(value: boolean) {
        this._graphics.visible = value;
    }

    protected drawDebugGrid(): void {
        this._graphics.clear();
        this._graphics.beginFill(0x464646);
        this._graphics.drawRect(0, 0, this._graphics.width, this._graphics.height);
    }
}
