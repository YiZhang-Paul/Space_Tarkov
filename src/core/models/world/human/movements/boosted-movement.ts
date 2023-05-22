import type { MirroredCounter } from '../../../generic/mirrored-counter';
import type { MoveOption } from '../../move-option';
import type { HumanBodyParts } from '../human-body-parts';
import type { HumanState } from '../../../../enums/human-state.enum';

import { HumanMovement } from './human-movement';

export class BoostedMovement extends HumanMovement<MirroredCounter<HumanState>> {

    public update(bodyParts: HumanBodyParts, counter: MirroredCounter<HumanState>, option: MoveOption): void {
        this.lean(bodyParts, option);
        this.breath(bodyParts, bodyParts.trunk.height / 20 * counter.progress);
        this.fly(bodyParts, counter, option);
    }

    private fly(bodyParts: HumanBodyParts, counter: MirroredCounter<HumanState>, option: MoveOption): void {
        bodyParts.graphics.y -= option.boostHeight;
        bodyParts.graphics.y += 15 * counter.progress;
    }
}
