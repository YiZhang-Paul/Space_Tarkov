import type { MirroredCounter } from '../../../generic/mirrored-counter';
import type { MoveOption } from '../../move-option';
import { Movement } from '../../movement';
import type { HumanBodyParts } from '../human-body-parts';
import type { HumanState } from '../../../../enums/human-state.enum';
import { Orientation } from '../../../../enums/orientation.enum';

export abstract class HumanMovement extends Movement<HumanBodyParts, HumanState> {

    protected breath(bodyParts: HumanBodyParts, bodyMovement: number): void {
        bodyParts.trunk.y = bodyParts.defaultTrunkY + bodyMovement;
        bodyParts.head.y = bodyParts.defaultHeadY + bodyMovement;
    }

    protected swingLegs(bodyParts: HumanBodyParts, counter: MirroredCounter<HumanState>, option: MoveOption): void {
        const isRight = option.facing === Orientation.Right;
        const [primary, secondary] = [isRight ? bodyParts.leftLeg : bodyParts.rightLeg, isRight ? bodyParts.rightLeg : bodyParts.leftLeg];

        if (counter.isForward && counter.progress <= 0.5) {
            secondary.angle = 90 * counter.progress;
            primary.angle = -90 * counter.progress;
        }
        else if (counter.isForward && counter.progress <= 1) {
            secondary.angle = 90 * (1 - counter.progress);
            primary.angle = -90 * (1 - counter.progress);
        }
        else if (!counter.isForward && counter.progress <= 0.5) {
            secondary.angle = -90 * counter.progress;
            primary.angle = 90 * counter.progress;
        }
        else {
            secondary.angle = -90 * (1 - counter.progress);
            primary.angle = 90 * (1 - counter.progress);
        }

        console.log(primary.angle, secondary.angle);
    }
}
