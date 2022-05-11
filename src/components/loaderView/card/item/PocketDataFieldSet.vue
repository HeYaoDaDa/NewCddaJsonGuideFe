<template>
  <my-field label="name" v-if="stringIsNotEmpty(data.name)">
    <my-text :content="data.name" />
  </my-field>

  <my-field label="description" v-if="stringIsNotEmpty(data.description)">
    <my-text :content="data.description" />
  </my-field>

  <my-field label="type">
    <my-text :content="data.pocketType" />
  </my-field>

  <template v-if="arrayIsEmpty(data.ammoRestriction)">
    <my-field label="weight">
      <my-text :content="weightToString(data.weightCapacity)" />
    </my-field>

    <my-field label="volume">
      <my-text :content="volumeToString(data.volumeCapacity)" />
    </my-field>

    <my-field label="maxItemVolume" v-if="data.maxItemVolume">
      <my-text :content="volumeToString(data.maxItemVolume)" />
    </my-field>

    <my-field label="minItemVolume">
      <my-text :content="volumeToString(data.minItemVolume)" />
    </my-field>

    <my-field label="maxItemLength">
      <my-text :content="lengthToString(data.maxItemLength)" />
    </my-field>

    <my-field label="minItemLength">
      <my-text :content="lengthToString(data.minItemLength)" />
    </my-field>

    <my-field label="extraEncumbrance">
      <my-text :content="data.extraEncumbrance" />
    </my-field>

    <my-field label="volumeEncumberModifier">
      <my-text :content="data.volumeEncumberModifier" />
    </my-field>

    <my-field label="ripoff">
      <my-text :content="data.ripoff" />
    </my-field>

    <my-field label="activityNoise" v-if="data.activityNoise">
      <my-text :content="`${data.activityNoise.volume}: ${data.activityNoise.chance}%`" />
    </my-field>

    <my-field label="spoilMultiplier">
      <my-text :content="data.spoilMultiplier" />
    </my-field>

    <my-field label="weightMultiplier">
      <my-text :content="data.weightMultiplier" />
    </my-field>

    <my-field label="volumeMultiplier">
      <my-text :content="data.volumeMultiplier" />
    </my-field>

    <my-field label="magazineWell">
      <my-text :content="volumeToString(data.magazineWell)" />
    </my-field>

    <my-field label="moves">
      <my-text :content="data.moves" />
    </my-field>

    <my-field label="sealedData" v-if="data.sealedData">
      <my-text :content="data.sealedData.spoilMultiplier" />
    </my-field>
  </template>

  <my-field label="ammoRestriction" ul v-if="arrayIsNotEmpty(data.ammoRestriction)">
    <li v-for="ammoRestriction in data.ammoRestriction" :key="ammoRestriction[0].value.id">
      <my-text-async-id :content="toArray(ammoRestriction[0])" />
      <my-text :content="`(${ammoRestriction[1]})`" />
    </li>
  </my-field>

  <template v-if="arrayIsEmpty(data.ammoRestriction)">
    <my-field label="allowedSpeedloaders" v-if="arrayIsNotEmpty(data.allowedSpeedloaders)">
      <my-text-async-id :content="data.allowedSpeedloaders" />
    </my-field>

    <my-field label="flagRestrictions" v-if="arrayIsNotEmpty(data.flagRestrictions)">
      <my-text-async-id :content="data.flagRestrictions" />
    </my-field>

    <my-field label="itemIdRestriction" v-if="arrayIsNotEmpty(data.itemIdRestriction)">
      <my-text-async-id :content="data.itemIdRestriction" />
    </my-field>

    <my-field label="defaultMagazine" v-if="data.defaultMagazine">
      <my-text-async-id :content="toArray(data.defaultMagazine)" />
    </my-field>

    <my-field label="openContainer" v-if="data.openContainer">
      <my-text :content="data.openContainer" />
    </my-field>

    <my-field label="holster" v-if="data.holster">
      <my-text :content="data.holster" />
    </my-field>

    <my-field label="ablative" v-if="data.ablative">
      <my-text :content="data.ablative" />
    </my-field>

    <my-field label="fireProtection" v-if="data.fireProtection">
      <my-text :content="data.fireProtection" />
    </my-field>

    <my-field label="watertight" v-if="data.watertight">
      <my-text :content="data.watertight" />
    </my-field>

    <my-field label="airtight" v-if="data.airtight">
      <my-text :content="data.airtight" />
    </my-field>

    <my-field label="rigid" v-if="data.rigid">
      <my-text :content="data.rigid" />
    </my-field>
  </template>
</template>

<script lang="ts">
export default {
  name: 'PocketDataFieldSet',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import MyField from 'src/components/cddaItemLoader/MyField.vue';
import MyText from 'src/components/cddaItemLoader/MyText/MyText.vue';
import MyTextAsyncId from 'src/components/cddaItemLoader/MyText/MyTextAsyncId.vue';
import { PocketData } from 'src/type/loader/item/PocketDataLoader';
import { arrayIsNotEmpty, toArray, arrayIsEmpty, stringIsNotEmpty } from 'src/util/commonUtil';
import { lengthToString, volumeToString, weightToString } from 'src/util/dataUtil';
import { reactive } from 'vue';
const props = defineProps<{
  cddaData: PocketData;
}>();
const data = reactive(props.cddaData.data);
</script>
