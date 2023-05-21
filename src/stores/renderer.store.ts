import { defineStore } from 'pinia';
import { Graphics, type Application } from 'pixijs';

import { Coordinate } from '../core/models/generic/coordinate';
import { Camera } from '../core/models/scene/camera';

export const useRendererStore = defineStore('renderer', {
    state: () => ({
        renderer: null! as Application,
        camera: new Camera()
    }),
    getters: {
        viewWidth(): number {
            return this.renderer.view.width;
        },
        viewHeight(): number {
            return this.renderer.view.height;
        }
    },
    actions: {
        getGlobalCoordinate(graphics: Graphics): Coordinate {
            const { x, y } = graphics.toGlobal({ x: 0, y: 0 });

            return new Coordinate(x + this.camera.x, y + this.camera.y);
        },
        createGraphics(): Graphics {
            return new Graphics().beginFill(0xe09215);
        },
        addToStage(graphics: Graphics): void {
            this.renderer.stage.addChild(graphics);
        }
    }
});
