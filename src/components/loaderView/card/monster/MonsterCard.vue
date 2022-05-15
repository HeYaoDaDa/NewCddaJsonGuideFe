<template>
  <my-card width="-webkit-fill-available">
    <template v-slot:befor>
      <symbol-name-bar
        :name="data.name"
        :description="data.description"
        :symbol="data.symbol"
        :color="data.color"
        :modId="props.loader.jsonItem?.mod ?? 'dda'"
      />
    </template>
  </my-card>
</template>

<script lang="ts">
export default {
  name: 'MonsterCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import MyCard from 'src/components/cddaItemLoader/MyCard.vue';
import SymbolNameBar from 'src/components/loaderView/SymbolNameBar.vue';
import { Monster } from 'src/type/loader/monster/MonsterLoader';
import { reactive } from 'vue';
const props = defineProps<{
  loader: Monster;
}>();
const data = reactive(props.loader.data);
</script>
