import type { MirroredCounter } from '../generic/mirrored-counter';

import type { MoveOption } from './move-option';

export abstract class Movement<TBodyParts, TState> {
    public abstract update(bodyParts: TBodyParts, counter: MirroredCounter<TState>, option: MoveOption): void;
}
