import type { MirroredCounter } from '../../../generic/mirrored-counter';
import type { MoveOption } from '../../move-option';
import type { HumanBodyParts } from '../human-body-parts';
import type { HumanState } from '../../../../enums/human-state.enum';

import { HumanMovement } from './human-movement';

export class SprintMovement extends HumanMovement<MirroredCounter<HumanState>> {

    public update(bodyParts: HumanBodyParts, counter: MirroredCounter<HumanState>, option: MoveOption): void {
        this.breath(bodyParts, bodyParts.trunk.height / 10 * counter.progress);
        this.swingLegs(45, bodyParts.trunk.height / 10, bodyParts, counter, option);
    }
}
