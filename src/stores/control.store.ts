import { defineStore } from 'pinia';

import { controlKeys } from '../core/constants/control-keys';
import { Coordinate } from '../core/models/generic/coordinate';
import type { KeyValuePair } from '../core/models/generic/key-value-pair';

export const useControlStore = defineStore('control', {
    state: () => ({
        isRegistered: false,
        pointer: null as Coordinate | null,
        keyPressed: new Map<string, number>(),
        controlKeys
    }),
    getters: {
        isSprintKeyPressed(): boolean {
            return this.keyPressed.has(this.controlKeys.sprint);
        },
        isBoostKeyPressed(): boolean {
            return this.keyPressed.has(this.controlKeys.boost);
        },
        lastKeyPressed(): <T>(pairs: KeyValuePair<string, T>[]) => KeyValuePair<string, T> | null {
            return <T>(pairs: KeyValuePair<string, T>[]): KeyValuePair<string, T> | null => {
                let last: KeyValuePair<string, T> | null = null;

                for (const pair of pairs.filter(_ => this.keyPressed.has(_.key))) {
                    if (!last) {
                        last = pair;
                    }
                    else {
                        last = getKeyPressedTime(last.key, this.keyPressed) < getKeyPressedTime(pair.key, this.keyPressed) ? last : pair;
                    }
                }

                return last;
            };
        }
    },
    actions: {
        registerEventListeners(): void {
            if (this.isRegistered) {
                return;
            }

            this.isRegistered = true;
            document.addEventListener('contextmenu', event => event.preventDefault());
            document.addEventListener('mousemove', event => this.pointer = new Coordinate(event.clientX, event.clientY));
            document.addEventListener('mousedown', _ => onKeyDown(getMouseKey(_.button, this.controlKeys), this.keyPressed));
            document.addEventListener('mouseup', _ => this.keyPressed.delete(getMouseKey(_.button, this.controlKeys)));
            document.addEventListener('keyup', _ => this.keyPressed.delete(_.code));
            document.addEventListener('keydown', _ => onKeyDown(_.code, this.keyPressed));
        }
    }
});

function getMouseKey(value: number, keys: typeof controlKeys): string {
    if (value === 0) {
        return keys.attack;
    }

    return value === 2 ? keys.aim : '';
}

function getKeyPressedTime(key: string, keyPressed: Map<string, number>): number {
    return keyPressed.has(key) ? Date.now() - keyPressed.get(key)! : 0;
}

function onKeyDown(key: string, keyPressed: Map<string, number>): void {
    keyPressed.set(key, Date.now());
}
