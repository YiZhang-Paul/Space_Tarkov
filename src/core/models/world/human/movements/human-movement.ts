import { Movement } from '../../movement';
import type { BodyParts } from '../body-parts';
import type { HumanState } from '../../../../enums/human-state.enum';

export abstract class HumanMovement extends Movement<HumanState> {

    public breath(bodyParts: BodyParts, bodyMovement: number): void {
        bodyParts.trunk.y = bodyParts.defaultTrunkY + bodyMovement;
        bodyParts.head.y = bodyParts.defaultHeadY + bodyMovement;
    }
}
