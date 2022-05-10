<template>
  <my-card label="recipe">
    <my-field label="result" v-if="data.result">
      <my-text-async-id :content="toArray(data.result)" />
    </my-field>

    <my-field label="byproducts" v-if="arrayIsNotEmpty(data.byproducts)" ul>
      <li v-for="byproduct in data.byproducts" :key="byproduct[0].value.id">
        <my-text-async-id :content="toArray(byproduct[0])" />
        <my-text :content="`x ${byproduct[1]}`" />
      </li>
    </my-field>

    <my-field label="time">
      <my-text :content="timeToString(data.time)" />
    </my-field>

    <my-field label="skillUse">
      <my-text-async-id :content="toArray(data.skillUse)" />
      <my-text :content="`(${data.difficulty})`" />
    </my-field>

    <my-field label="skillRequire" v-if="arrayIsNotEmpty(data.skillRequire)" ul>
      <li v-for="skill in data.skillRequire" :key="skill[0].value.id">
        <my-text-async-id :content="toArray(skill[0])" />
        <my-text :content="`(${skill[1]})`" />
      </li>
    </my-field>

    <my-field label="neverLearn">
      <my-text :content="data.neverLearn" />
    </my-field>

    <my-field label="autoLearn" v-if="arrayIsNotEmpty(data.autolearnRequire)" ul>
      <li v-for="skill in data.autolearnRequire" :key="skill[0].value.id">
        <my-text-async-id :content="toArray(skill[0])" />
        <my-text :content="`(${skill[1]})`" />
      </li>
    </my-field>

    <my-field label="decompLearn" v-if="arrayIsNotEmpty(data.decompLearn)" ul>
      <li v-for="skill in data.decompLearn" :key="skill[0].value.id">
        <my-text-async-id :content="toArray(skill[0])" />
        <my-text :content="`(${skill[1]})`" />
      </li>
    </my-field>

    <my-field label="bookLearn" v-if="arrayIsNotEmpty(data.bookLearn)" ul>
      <li v-for="bookLearn in data.bookLearn" :key="bookLearn.book.value.id">
        <my-text-async-id :content="toArray(bookLearn.book)" />
        <my-text :content="`(${bookLearn.level})`" />
        <my-text v-if="bookLearn.hidden" :content="`(hidden)`" />
        <my-text v-if="bookLearn.name" :content="`(${bookLearn.name})`" />
      </li>
    </my-field>

    <my-field label="batchTime" v-if="data.batchScale < 100">
      <my-text :content="data.batchScale.toString() + '%'" />
    </my-field>

    <my-field label="size" v-if="data.batchScale < 100">
      <my-text :content="data.batchSize" />
    </my-field>

    <my-field label="proficiency">
      <li v-for="proficiency in data.proficiencies" :key="proficiency.data.name.value.id">
        <loader-view :cddaData="proficiency" />
      </li>
    </my-field>

    <loader-view :cddaData="data.normalRequirement" />
  </my-card>
</template>

<script lang="ts">
export default {
  name: 'RecipeCard',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import LoaderView from 'src/components/base/LoaderView.vue';
import MyCard from 'src/components/cddaItemLoader/MyCard.vue';
import MyField from 'src/components/cddaItemLoader/MyField.vue';
import MyText from 'src/components/cddaItemLoader/MyText/MyText.vue';
import MyTextAsyncId from 'src/components/cddaItemLoader/MyText/MyTextAsyncId.vue';
import { Recipe } from 'src/type/loader/recipe/RecipeLoader';
import { arrayIsNotEmpty, toArray } from 'src/util/commonUtil';
import { timeToString } from 'src/util/dataUtil';
import { reactive } from 'vue';
const props = defineProps<{
  cddaData: Recipe;
}>();
const data = reactive(props.cddaData.data);
</script>
