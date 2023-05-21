import type { MirroredCounter } from '../generic/mirrored-counter';

export abstract class Movement<TBodyParts, TState> {
    public abstract update(bodyParts: TBodyParts, counter: MirroredCounter<TState>): void;
}
