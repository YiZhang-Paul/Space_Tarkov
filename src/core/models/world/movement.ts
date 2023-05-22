import type { MoveOption } from './move-option';

export abstract class Movement<TBodyParts, TCounter> {
    public abstract update(bodyParts: TBodyParts, counter: TCounter | null, option: MoveOption): void;
}
