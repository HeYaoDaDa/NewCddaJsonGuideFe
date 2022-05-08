<template>
  <my-card label="subBodyPart">
    <my-field label="name">
      <my-text :content="data.name" />
    </my-field>

    <my-field label="secondary">
      <my-text :content="data.secondary" />
    </my-field>

    <my-field label="maxCoverage">
      <my-text :content="data.maxCoverage" />
    </my-field>

    <my-field label="side">
      <my-text :content="data.side" />
    </my-field>

    <my-field label="nameMultiple" v-if="data.nameMultiple">
      <my-text :content="data.nameMultiple" />
    </my-field>

    <my-field label="opposite" v-if="data.opposite">
      <my-text-async-id :content="data.opposite" />
    </my-field>
  </my-card>
</template>
<script lang="ts">
import { SubBodyPart } from 'src/type/loader/baseLoader/bodyPart/SubBodyPartLoader';
export default {
  name: 'SubBodyPartCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>
<script setup lang="ts">
import MyCard from 'src/components/cddaItemLoader/MyCard.vue';
import MyField from 'src/components/cddaItemLoader/MyField.vue';
import MyText from 'src/components/cddaItemLoader/MyText/MyText.vue';
import MyTextAsyncId from 'src/components/cddaItemLoader/MyText/MyTextAsyncId.vue';
import { reactive } from 'vue';
const props = defineProps<{
  cddaData: SubBodyPart;
}>();
const data = reactive(props.cddaData.data);
</script>
