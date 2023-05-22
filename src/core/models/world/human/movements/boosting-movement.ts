import type { SimpleCounter } from '../../../generic/simple-counter';
import type { MoveOption } from '../../move-option';
import type { HumanBodyParts } from '../human-body-parts';
import type { HumanState } from '../../../../enums/human-state.enum';

import { HumanMovement } from './human-movement';

export class BoostingMovement extends HumanMovement<SimpleCounter<HumanState>> {

    public update(bodyParts: HumanBodyParts, counter: SimpleCounter<HumanState>, option: MoveOption): void {
        this.lean(bodyParts, option);
        this.breath(bodyParts, bodyParts.trunk.height / 20 * counter.progress);
        this.flyUp(bodyParts, counter, option);
    }

    private flyUp(bodyParts: HumanBodyParts, counter: SimpleCounter<HumanState>, option: MoveOption): void {
        bodyParts.graphics.y -= option.boostHeight * counter.progress;
    }
}
