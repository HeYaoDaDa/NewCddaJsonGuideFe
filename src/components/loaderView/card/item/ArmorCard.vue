<template>
  <my-card label="armor" width="50%">
    <my-field label="layer" v-if="arrayIsNotEmpty(data.allLayers)">
      <my-text-async-id :content="data.allLayers" separator=", " />
    </my-field>

    <my-field label="warmth">
      <my-text :content="data.warmth" />
    </my-field>

    <my-field label="rigid">
      <my-text :content="data.rigid" />
    </my-field>

    <my-field label="comfortable">
      <my-text :content="data.comfortable" />
    </my-field>

    <my-field label="resist">
      <template v-for="(resists, i) in data.armorResists" :key="i">
        <span v-for="(formatCover, j) in resists[0].formatCovers" :key="formatCover[0].value.id">
          <my-text-async-id :content="toArray(formatCover[0])" />
          <template v-if="arrayIsNotEmpty(formatCover[1])">
            <my-text content="(" />
            <my-text-async-id :content="formatCover[1]" separator=", " />
            <my-text content=")" />
          </template>
          <my-text v-if="j < resists[0].formatCovers.length - 1" content=", " />
        </span>
        <div :style="{ display: 'flex' }">
          <dl v-for="(resist, j) in resists" :key="j">
            <armor-resist-field-set :data="resist" />
          </dl>
        </div>
      </template>
    </my-field>
  </my-card>
</template>

<script lang="ts">
export default {
  name: 'ArmorCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import MyCard from 'src/components/cddaItemLoader/MyCard.vue';
import MyField from 'src/components/cddaItemLoader/MyField.vue';
import MyText from 'src/components/cddaItemLoader/MyText/MyText.vue';
import MyTextAsyncId from 'src/components/cddaItemLoader/MyText/MyTextAsyncId.vue';
import { Armor } from 'src/type/loader/item/armor/ArmorLoader';
import { arrayIsNotEmpty, toArray } from 'src/util/commonUtil';
import { reactive } from 'vue';
import ArmorResistFieldSet from './ArmorResistFieldSet.vue';
const props = defineProps<{
  cddaData: Armor;
}>();
const data = reactive(props.cddaData.data);
console.log(data);
</script>
