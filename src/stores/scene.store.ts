import { defineStore } from 'pinia';
import { Application, Graphics } from 'pixijs';

import { Coordinate } from '../core/models/generic/coordinate';
import { Camera } from '../core/models/scene/camera';

export const useSceneStore = defineStore('scene', {
    state: () => ({
        renderer: null! as Application,
        camera: new Camera(),
        lastUpdate: 0,
        threshold: 1000 / 60
    }),
    getters: {
        cameraWidth(): number {
            return this.renderer.view.width;
        },
        cameraHeight(): number {
            return this.renderer.view.height;
        }
    },
    actions: {
        createGraphics(): Graphics {
            return new Graphics().beginFill(0xe09215);
        },
        addToStage(graphics: Graphics): void {
            this.renderer.stage.addChild(graphics);
        },
        getGlobalCoordinate(graphics: Graphics): Coordinate {
            const { x, y } = graphics.toGlobal({ x: 0, y: 0 });

            return new Coordinate(x + this.camera.x, y + this.camera.y);
        },
        run(): void {
            if (this.renderer) {
                return;
            }

            this.renderer = createRenderer();

            this.renderer.ticker.add(() => {
                const now = new Date().getTime();

                if (now - this.lastUpdate < this.threshold) {
                    return;
                }

                this.lastUpdate = now;
            });
        }
    }
});

function createRenderer(): Application {
    const renderer = new Application({
        width: document.body.clientWidth,
        height: document.body.clientHeight,
        backgroundColor: 0x000000,
        antialias: true
    });

    renderer.stage.sortableChildren = true;
    document.body.appendChild(renderer.view as unknown as HTMLElement);

    return renderer;
}
