<template>
  <my-card width="-webkit-fill-available">
    <template v-slot:befor>
      <p :class="['text-weight-bold text-h4']">
        <span :style="{ color: data.color }">{{ data.symbol }}</span>

        <span>{{ data.name }}</span>

        <q-badge>{{ props.cddaData.jsonItem?.mod }}</q-badge>
      </p>

      <my-text :content="data.description" />
    </template>

    <my-field label="material" v-if="arrayIsNotEmpty(data.materials)" ul>
      <li v-for="material in data.materials" :key="material[0].value.id">
        <my-text-async-id :content="toArray(material[0])" />
        <my-text :content="`(${material[1]})`" />
      </li>
    </my-field>

    <my-field label="weight">
      <my-text :content="weightToString(data.weight)" />
    </my-field>

    <my-field label="volume">
      <my-text :content="volumeToString(data.volume)" />
    </my-field>

    <my-field label="length">
      <my-text :content="lengthToString(data.longestSide)" />
    </my-field>

    <my-field label="category">
      <my-text-async-id :content="toArray(data.category)" />
    </my-field>

    <my-field label="flag" ul>
      <my-text-async-id :content="data.flags" li />
    </my-field>
  </my-card>
</template>

<script lang="ts">
export default {
  name: 'BaseItemCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import MyCard from 'src/components/cddaItemLoader/MyCard.vue';
import MyField from 'src/components/cddaItemLoader/MyField.vue';
import MyText from 'src/components/cddaItemLoader/MyText/MyText.vue';
import MyTextAsyncId from 'src/components/cddaItemLoader/MyText/MyTextAsyncId.vue';
import { BaseItem } from 'src/type/loader/item/BaseItemLoader';
import { arrayIsNotEmpty, toArray } from 'src/util/commonUtil';
import { lengthToString, volumeToString, weightToString } from 'src/util/dataUtil';
import { reactive } from 'vue';
const props = defineProps<{
  cddaData: BaseItem;
}>();
const data = reactive(props.cddaData.data);
</script>
