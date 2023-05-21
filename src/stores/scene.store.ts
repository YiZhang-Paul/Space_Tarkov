import { defineStore } from 'pinia';
import { Application } from 'pixijs';

import { useRendererStore } from './renderer.store';

const rendererStore = useRendererStore();

export const useSceneStore = defineStore('scene', {
    state: () => ({
        lastUpdate: 0,
        threshold: 1000 / 60
    }),
    actions: {
        run(): void {
            if (rendererStore.renderer) {
                return;
            }

            rendererStore.renderer = createRenderer();

            rendererStore.renderer.ticker.add(() => {
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
