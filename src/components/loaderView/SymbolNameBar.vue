<template>
  <p :class="['text-weight-bold', 'text-h3']">
    <span v-if="props.symbol && props.color" :style="{ color: props.color }">{{ props.symbol + '  ' }}</span>

    <span>{{ props.name }}</span>

    <q-badge :class="['text-weight-bold', 'text-h6']">{{ mod.data.name }}</q-badge>
  </p>

  <my-text v-if="props.description" :content="props.description" />
</template>

<script lang="ts">
export default {
  name: 'SymbolNameBar',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import MyText from 'src/components/cddaItemLoader/MyText/MyText.vue';
import { getModById } from 'src/type/loader/baseLoader/ModLoader';
const props = defineProps<{
  name: string;
  description?: string;
  modId: string;
  symbol?: string;
  color?: string;
}>();
const mod = getModById(props.modId);
</script>
