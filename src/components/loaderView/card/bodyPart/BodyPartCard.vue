<template>
  <my-card label="subBodyPart">
    <my-field label="name">
      <my-text :content="data.name" />
    </my-field>

    <my-field label="subBodyPart">
      <my-text-async-id :content="data.subBodyParts" separator=", " />
    </my-field>
  </my-card>
</template>
<script lang="ts">
export default {
  name: 'BodyPartCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>
<script setup lang="ts">
import MyCard from 'src/components/cddaItemLoader/MyCard.vue';
import MyField from 'src/components/cddaItemLoader/MyField.vue';
import MyText from 'src/components/cddaItemLoader/MyText/MyText.vue';
import MyTextAsyncId from 'src/components/cddaItemLoader/MyText/MyTextAsyncId.vue';
import { BodyPart } from 'src/type/loader/baseLoader/bodyPart/BodyPartLoader';
import { reactive } from 'vue';
const props = defineProps<{
  cddaData: BodyPart;
}>();
const data = reactive(props.cddaData.data);
</script>
