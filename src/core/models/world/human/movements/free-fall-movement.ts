import type { SimpleCounter } from '../../../generic/simple-counter';
import type { MoveOption } from '../../move-option';
import type { HumanBodyParts } from '../human-body-parts';
import type { HumanState } from '../../../../enums/human-state.enum';

import { HumanMovement } from './human-movement';

export class FreeFallMovement extends HumanMovement<SimpleCounter<HumanState>> {

    public update(bodyParts: HumanBodyParts, counter: SimpleCounter<HumanState>, option: MoveOption): void {
        this.breath(bodyParts, bodyParts.trunk.height / 10 * counter.progress);
        this.fall(bodyParts, counter, option);
    }

    private fall(bodyParts: HumanBodyParts, counter: SimpleCounter<HumanState>, option: MoveOption): void {
        bodyParts.graphics.y -= option.boostHeight;
        bodyParts.graphics.y += option.boostHeight * counter.progress;
    }
}
