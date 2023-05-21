<script lang="ts">
import { defineComponent } from 'vue';

import { useSceneStore } from './stores/scene.store';

export const game = defineComponent({
    mounted(): void {
        useSceneStore().run();
    }
});
</script>
