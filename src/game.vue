<template></template>

<script lang="ts">
import { defineComponent } from 'vue';

import { useSceneStore } from './stores/scene.store';

export default defineComponent({
    mounted(): void {
        useSceneStore().run();
    }
});
</script>
