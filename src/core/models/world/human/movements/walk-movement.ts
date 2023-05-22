import type { MirroredCounter } from '../../../generic/mirrored-counter';
import type { MoveOption } from '../../move-option';
import type { HumanBodyParts } from '../human-body-parts';
import type { HumanState } from '../../../../enums/human-state.enum';

import { HumanMovement } from './human-movement';

export class WalkMovement extends HumanMovement<MirroredCounter<HumanState>> {

    public update(bodyParts: HumanBodyParts, counter: MirroredCounter<HumanState>, option: MoveOption): void {
        this.breath(bodyParts, bodyParts.trunk.height / 20 * counter.progress);
        this.swingLegs(15, bodyParts.trunk.height / 50, bodyParts, counter, option);
    }
}
