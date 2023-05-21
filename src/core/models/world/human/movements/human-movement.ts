import { Movement } from '../../movement';
import type { HumanBodyParts } from '../human-body-parts';
import type { HumanState } from '../../../../enums/human-state.enum';

export abstract class HumanMovement extends Movement<HumanBodyParts, HumanState> {

    public breath(bodyParts: HumanBodyParts, bodyMovement: number): void {
        bodyParts.trunk.y = bodyParts.defaultTrunkY + bodyMovement;
        bodyParts.head.y = bodyParts.defaultHeadY + bodyMovement;
    }
}
