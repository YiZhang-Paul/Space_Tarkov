import type { Orientation } from '../../enums/orientation.enum';

import { SolidObject } from './solid-object';

export abstract class BodyParts extends SolidObject {
    public abstract initialize(headRadius: number, orientation: Orientation): this;
}
