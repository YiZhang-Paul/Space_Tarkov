import { createApp } from 'vue';
import { createPinia } from 'pinia';

import { game } from './game.vue';
import './assets/main.scss';

createApp(game).use(createPinia()).mount('#game');
