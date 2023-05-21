import type { MirroredCounter } from '../generic/mirrored-counter';

import type { BodyParts } from './human/body-parts';

export abstract class Movement<T> {
    public abstract update(bodyParts: BodyParts, counter: MirroredCounter<T>): void;
}
