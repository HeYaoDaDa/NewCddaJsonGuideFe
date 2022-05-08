<template>
  <my-card label="material">
    <my-field label="name">
      <my-text :content="data.name" />
    </my-field>

    <my-field label="salvagedInto" v-if="data.salvagedInto">
      <my-text-async-id :content="toArray(data.salvagedInto)" />
    </my-field>

    <my-field label="repairedWith" v-if="data.repairedWith">
      <my-text-async-id :content="toArray(data.repairedWith)" />
    </my-field>

    <my-field label="bash">
      <my-text :content="data.bashResist" />
    </my-field>

    <my-field label="cut">
      <my-text :content="data.cutResist" />
    </my-field>

    <my-field label="bullet">
      <my-text :content="data.bulletResist" />
    </my-field>

    <my-field label="acid">
      <my-text :content="data.acidResist" />
    </my-field>

    <my-field label="electricity">
      <my-text :content="data.elecResist" />
    </my-field>

    <my-field label="fire">
      <my-text :content="data.fireResist" />
    </my-field>

    <my-field label="chip">
      <my-text :content="data.chipResist" />
    </my-field>

    <my-field label="density">
      <my-text :content="data.density" />
    </my-field>

    <my-field label="breathability">
      <my-text :content="data.breathability.translate()" />
    </my-field>

    <my-field label="windResist" v-if="data.windResist">
      <my-text :content="data.windResist" />
    </my-field>

    <my-field label="specificTeatLiquid">
      <my-text :content="data.specificTeatLiquid" />
    </my-field>

    <my-field label="specificHeatSolid">
      <my-text :content="data.specificHeatSolid" />
    </my-field>

    <my-field label="latentHeat">
      <my-text :content="data.latentHeat" />
    </my-field>

    <my-field label="freezePoint">
      <my-text :content="data.freezePoint" />
    </my-field>

    <my-field label="edible">
      <my-text :content="data.edible" />
    </my-field>

    <my-field label="rotting">
      <my-text :content="data.rotting" />
    </my-field>

    <my-field label="soft">
      <my-text :content="data.soft" />
    </my-field>

    <my-field label="reinforces">
      <my-text :content="data.reinforces" />
    </my-field>

    <my-field label="sheetThickness">
      <my-text :content="data.sheetThickness" />
    </my-field>

    <my-field label="vitamin" v-if="arrayIsNotEmpty(data.vitamins)" ul>
      <li v-for="vitamin in data.vitamins" :key="vitamin[0].value.id">
        <my-text-async-id :content="toArray(vitamin[0])" />
        <my-text :content="`(${vitamin[1]})`" />
      </li>
    </my-field>

    <my-field label="fuel" v-if="props.cddaData.data.fuelData" dl>
      <fuel-field-set :cddaData="props.cddaData.data.fuelData" />
    </my-field>

    <my-field label="burn" v-if="arrayIsNotEmpty(props.cddaData.data.burnData)" ul>
      <li v-for="(burn, index) in props.cddaData.data.burnData" :key="index">
        <dl>
          <material-burn-field-set :cddaData="burn" />
        </dl>
      </li>
    </my-field>
  </my-card>
</template>

<script lang="ts">
export default {
  name: 'FuelFieldSet',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import MyCard from 'src/components/cddaItemLoader/MyCard.vue';
import MyField from 'src/components/cddaItemLoader/MyField.vue';
import MyText from 'src/components/cddaItemLoader/MyText/MyText.vue';
import MyTextAsyncId from 'src/components/cddaItemLoader/MyText/MyTextAsyncId.vue';
import FuelFieldSet from 'src/components/loaderView/card/material/FuelFieldSet.vue';
import MaterialBurnFieldSet from 'src/components/loaderView/card/material/MaterialBurnFieldSet.vue';
import { Material } from 'src/type/loader/baseLoader/material/Material';
import { arrayIsNotEmpty, toArray } from 'src/util/commonUtil';
import { reactive } from 'vue';
const props = defineProps<{
  cddaData: Material;
}>();
const data = reactive(props.cddaData.data);
</script>
