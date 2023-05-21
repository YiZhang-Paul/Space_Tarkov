import type { Graphics } from 'pixijs';

import { useRendererStore } from '../../../stores/renderer.store';

export abstract class SolidObject {
    public x = 0;
    public y = 0;
    protected readonly _graphics = useRendererStore().createGraphics();

    constructor() {
        this._graphics.sortableChildren = true;
    }

    get graphics(): Graphics {
        return this._graphics;
    }

    protected drawDebugGrid(): void {
        this._graphics.clear();
        this._graphics.beginFill(0x464646);
        this._graphics.drawRect(0, 0, this._graphics.width, this._graphics.height);
    }
}
