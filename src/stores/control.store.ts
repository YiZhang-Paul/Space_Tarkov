import { defineStore } from 'pinia';

import { Coordinate } from '../core/models/generic/coordinate';

export const useControlStore = defineStore('control', {
    state: () => ({
        isRegistered: false,
        pointer: null as Coordinate | null
    }),
    actions: {
        registerEventListeners(): void {
            if (this.isRegistered) {
                return;
            }

            this.isRegistered = true;
            document.addEventListener('contextmenu', event => event.preventDefault());
            document.addEventListener('mousemove', event => this.pointer = new Coordinate(event.clientX, event.clientY));
        }
    }
});
