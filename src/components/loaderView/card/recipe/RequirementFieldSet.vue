<template>
  <my-field label="tool" ul>
    <li v-for="(qualities, index) in props.cddaData.data.qualities" :key="index">
      <template v-for="(qualitie, i) in qualities" :key="qualitie.data.name.value.id">
        <loader-view :cddaData="qualitie" />
        <my-text v-if="i < qualities.length - 1" :content="` ${$t('or')} `" />
      </template>
    </li>
    <li v-for="(tools, index) in props.cddaData.data.tools" :key="index">
      <template v-for="(tool, i) in tools" :key="tool.data.name.value.id">
        <loader-view :cddaData="tool" />
        <my-text v-if="i < tools.length - 1" :content="` ${$t('or')} `" />
      </template>
    </li>
  </my-field>
  <my-field label="component" ul>
    <li v-for="(components, index) in props.cddaData.data.components" :key="index">
      <template v-for="(component, i) in components" :key="component.data.name.value.id">
        <loader-view :cddaData="component" />
        <my-text v-if="i < components.length - 1" :content="` ${$t('or')} `" />
      </template>
    </li>
  </my-field>
</template>

<script lang="ts">
export default {
  name: 'RequirementFieldSet',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import LoaderView from 'src/components/base/LoaderView.vue';
import MyField from 'src/components/cddaItemLoader/MyField.vue';
import MyText from 'src/components/cddaItemLoader/MyText/MyText.vue';
import { Requirement } from 'src/type/loader/recipe/requirement/RequirementLoader';
const props = defineProps<{
  cddaData: Requirement;
}>();
</script>
