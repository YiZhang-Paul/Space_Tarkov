import { createApp } from 'vue';
import { createPinia } from 'pinia';

import Game from './game.vue';
import './assets/main.scss';

createApp(Game).use(createPinia()).mount('#game');
