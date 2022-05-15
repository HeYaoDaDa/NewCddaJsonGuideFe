<template>
  <my-field label="spell">
    <my-text-async-id :content="toArray(data.spell)" />
  </my-field>

  <my-field label="minLevel" v-if="data.minLevel > 0">
    <my-text :content="data.minLevel" />
  </my-field>

  <my-field label="maxLevel" v-if="data.maxLevel">
    <my-text :content="data.maxLevel" />
  </my-field>

  <my-field label="hitSelf">
    <my-text :content="data.hitSelf" />
  </my-field>

  <my-field label="chance" v-if="data.onceInChance !== 1">
    <my-text :content="data.onceInChance" />
  </my-field>

  <my-field label="message" v-if="data.message">
    <my-text :content="data.message" />
  </my-field>

  <my-field label="npcMessage" v-if="data.npcMessage">
    <my-text :content="data.npcMessage" />
  </my-field>
</template>

<script lang="ts">
export default {
  name: 'FakeSpellFieldSet',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import MyField from 'src/components/cddaItemLoader/MyField.vue';
import MyText from 'src/components/cddaItemLoader/MyText/MyText.vue';
import MyTextAsyncId from 'src/components/cddaItemLoader/MyText/MyTextAsyncId.vue';
import { FakeSpell } from 'src/type/loader/magic/FakeSpellLoader';
import { toArray } from 'src/util/commonUtil';
import { reactive } from 'vue';

const props = defineProps<{
  loader: FakeSpell;
}>();

const data = reactive(props.loader.data);
</script>
