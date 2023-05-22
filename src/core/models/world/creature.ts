import { SolidObject } from './solid-object';

export abstract class Creature extends SolidObject {
    protected _baseWalkSpeed!: number;
    protected _baseSprintSpeed!: number;
}
