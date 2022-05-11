<template>
  <my-card label="armor">
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
import { arrayIsNotEmpty } from 'src/util/commonUtil';
import { reactive } from 'vue';
const props = defineProps<{
  cddaData: Armor;
}>();
const data = reactive(props.cddaData.data);
</script>
