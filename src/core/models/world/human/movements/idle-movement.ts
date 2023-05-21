import type { MirroredCounter } from '../../../generic/mirrored-counter';
import type { BodyParts } from '../body-parts';
import type { HumanState } from '../../../../enums/human-state.enum';

import { HumanMovement } from './human-movement';

export class IdleMovement extends HumanMovement {

    public update(bodyParts: BodyParts, counter: MirroredCounter<HumanState>): void {
        this.breath(bodyParts, bodyParts.trunk.height / 25 * counter.progress);
    }
}
