import { useSceneStore } from '../../../stores/scene.store';
import type { SolidObject } from '../world/solid-object';

export class Camera {
    private readonly _sceneStore = useSceneStore();
    private _x = 0;
    private _y = 0;

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    public focus(x: number, y: number): void {
        const { cameraWidth, cameraHeight } = this._sceneStore;
        this._x = x - cameraWidth / 2;
        this._y = y - cameraHeight / 2;
    }

    public update(focus: SolidObject, objects: SolidObject[]): void {
        this.focus(focus.x, focus.y);

        for (const object of objects) {
            object.graphics.x = object.x - this.x;
            object.graphics.y = object.y - this.y;
        }
    }
}
