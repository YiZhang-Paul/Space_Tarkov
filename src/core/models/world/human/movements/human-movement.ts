import type { MirroredCounter } from '../../../generic/mirrored-counter';
import type { MoveOption } from '../../move-option';
import { Movement } from '../../movement';
import type { HumanBodyParts } from '../human-body-parts';
import type { HumanState } from '../../../../enums/human-state.enum';
import { Orientation } from '../../../../enums/orientation.enum';

export abstract class HumanMovement<T> extends Movement<HumanBodyParts, T> {

    protected lean(bodyParts: HumanBodyParts, option: MoveOption): void {
        const isRight = option.facing === Orientation.Right;
        const primary = isRight ? bodyParts.rightLeg : bodyParts.leftLeg;
        const secondary = isRight ? bodyParts.leftLeg : bodyParts.rightLeg;
        bodyParts.graphics.angle = 15 * (isRight ? 1 : -1);

        if (isRight) {
            primary.x = bodyParts.defaultCenterX + (bodyParts.defaultRightLegX - bodyParts.defaultCenterX) / 3;
            secondary.x = bodyParts.defaultCenterX - (bodyParts.defaultCenterX - bodyParts.defaultLeftLegX) / 3;
        }
        else {
            primary.x = bodyParts.defaultCenterX - (bodyParts.defaultCenterX - bodyParts.defaultLeftLegX) / 3;
            secondary.x = bodyParts.defaultCenterX + (bodyParts.defaultRightLegX - bodyParts.defaultCenterX) / 3;
        }
    }

    protected breath(bodyParts: HumanBodyParts, bodyMovement: number): void {
        bodyParts.trunk.y = bodyParts.defaultTrunkY + bodyMovement;
        bodyParts.head.y = bodyParts.defaultHeadY + bodyMovement;
    }

    protected swingHands(maxAngle: number, bodyParts: HumanBodyParts, counter: MirroredCounter<HumanState>, option: MoveOption): void {
        const isRight = option.facing === Orientation.Right;
        const primary = isRight ? bodyParts.rightHand : bodyParts.leftHand;
        const secondary = isRight ? bodyParts.leftHand : bodyParts.rightHand;

        if (counter.isForward && counter.progress <= 0.5) {
            secondary.angle = maxAngle * counter.progress;
            primary.angle = -maxAngle * counter.progress;
        }
        else if (counter.isForward && counter.progress <= 1) {
            secondary.angle = maxAngle * (1 - counter.progress);
            primary.angle = -maxAngle * (1 - counter.progress);
        }
        else if (!counter.isForward && counter.progress <= 0.5) {
            secondary.angle = -maxAngle * counter.progress;
            primary.angle = maxAngle * counter.progress;
        }
        else {
            secondary.angle = -maxAngle * (1 - counter.progress);
            primary.angle = maxAngle * (1 - counter.progress);
        }
    }

    protected swingLegs(maxAngle: number, maxJump: number, bodyParts: HumanBodyParts, counter: MirroredCounter<HumanState>, option: MoveOption): void {
        const isRight = option.facing === Orientation.Right;
        const primary = isRight ? bodyParts.rightLeg : bodyParts.leftLeg;
        const secondary = isRight ? bodyParts.leftLeg : bodyParts.rightLeg;

        if (counter.isForward && counter.progress <= 0.6) {
            bodyParts.graphics.y = maxJump;
            primary.angle = -maxAngle;
            primary.x = bodyParts.defaultRightLegX;
            secondary.angle = maxAngle;
            secondary.x = bodyParts.defaultLeftLegX;
        }
        else if (counter.isForward && counter.progress <= 1) {
            bodyParts.graphics.y = maxJump / 2;
            primary.angle = 0;
            primary.x = bodyParts.defaultCenterX + (bodyParts.defaultRightLegX - bodyParts.defaultCenterX) / 3;
            secondary.angle = 0;
            secondary.x = bodyParts.defaultCenterX - (bodyParts.defaultCenterX - bodyParts.defaultLeftLegX) / 3;
        }
        else if (!counter.isForward && counter.progress >= 0.4) {
            bodyParts.graphics.y = maxJump;
            primary.angle = maxAngle;
            primary.x = bodyParts.defaultLeftLegX;
            secondary.angle = -maxAngle;
            secondary.x = bodyParts.defaultRightLegX;
        }
        else {
            bodyParts.graphics.y = maxJump / 2;
            primary.angle = 0;
            primary.x = bodyParts.defaultCenterX - (bodyParts.defaultCenterX - bodyParts.defaultLeftLegX) / 3;
            secondary.angle = 0;
            secondary.x = bodyParts.defaultCenterX + (bodyParts.defaultRightLegX - bodyParts.defaultCenterX) / 3;
        }
    }
}
