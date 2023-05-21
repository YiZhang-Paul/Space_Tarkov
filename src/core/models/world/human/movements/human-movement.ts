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
        const primary = isRight ? bodyParts.rightLeg : bodyParts.leftLeg;
        const secondary = isRight ? bodyParts.leftLeg : bodyParts.rightLeg;

        if (counter.isForward && counter.progress <= 0.7) {
            primary.angle = -25;
            primary.x = bodyParts.defaultRightLegX;
            secondary.angle = 25;
            secondary.x = bodyParts.defaultLeftLegX;
        }
        else if (counter.isForward && counter.progress <= 1) {
            primary.angle = 0;
            primary.x = bodyParts.defaultCenterX + (bodyParts.defaultRightLegX - bodyParts.defaultCenterX) / 3;
            secondary.angle = 0;
            secondary.x = bodyParts.defaultCenterX - (bodyParts.defaultCenterX - bodyParts.defaultLeftLegX) / 3;
        }
        else if (!counter.isForward && counter.progress >= 0.3) {
            primary.angle = 25;
            primary.x = bodyParts.defaultLeftLegX;
            secondary.angle = -25;
            secondary.x = bodyParts.defaultRightLegX;
        }
        else {
            primary.angle = 0;
            primary.x = bodyParts.defaultCenterX - (bodyParts.defaultCenterX - bodyParts.defaultLeftLegX) / 3;
            secondary.angle = 0;
            secondary.x = bodyParts.defaultCenterX + (bodyParts.defaultRightLegX - bodyParts.defaultCenterX) / 3;
        }
    }
}
