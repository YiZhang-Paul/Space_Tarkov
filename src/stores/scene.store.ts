import { defineStore } from 'pinia';
import { Application, Graphics } from 'pixijs';

import { Coordinate } from '../core/models/generic/coordinate';
import { Camera } from '../core/models/scene/camera';
import { Human } from '../core/models/world/human/human';

export const useSceneStore = defineStore('scene', {
    state: () => ({
        renderer: null! as Application,
        camera: new Camera(),
        lastUpdate: 0,
        updateThreshold: 1000 / 60,
        player: null! as Human
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
        createGraphics(color = 0xe09215): Graphics {
            return new Graphics().beginFill(color);
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
            this.player = new Human().initialize();

            this.renderer.ticker.add(() => {
                const now = new Date().getTime();

                if (now - this.lastUpdate < this.updateThreshold) {
                    return;
                }

                this.lastUpdate = now;
                this.player.update();
                this.camera.update(this.player as Human, [this.player as Human]);
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
