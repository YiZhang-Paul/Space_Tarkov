import type { MirroredCounter } from '../../../generic/mirrored-counter';
import type { HumanBodyParts } from '../human-body-parts';
import type { HumanState } from '../../../../enums/human-state.enum';

import { HumanMovement } from './human-movement';

export class IdleMovement extends HumanMovement {

    public update(bodyParts: HumanBodyParts, counter: MirroredCounter<HumanState>): void {
        this.breath(bodyParts, bodyParts.trunk.height / 25 * counter.progress);
    }
}
