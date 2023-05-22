import type { Orientation } from '../../enums/orientation.enum';

export class MoveOption {
    public facing: Orientation;
    public moving: Orientation | null;
    public boostHeight: number;

    constructor(facing: Orientation, moving: Orientation | null, boostHeight: number) {
        this.facing = facing;
        this.moving = moving;
        this.boostHeight = boostHeight;
    }
}
