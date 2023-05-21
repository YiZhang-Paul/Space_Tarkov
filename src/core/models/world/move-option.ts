import type { Orientation } from '../../enums/orientation.enum';

export class MoveOption {
    public facing: Orientation;
    public moving: Orientation | null;

    constructor(facing: Orientation, moving: Orientation | null) {
        this.facing = facing;
        this.moving = moving;
    }
}
