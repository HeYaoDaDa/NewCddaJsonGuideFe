<template>
  <my-card label="melee">
    <my-field label="bash">
      <my-text :content="data.bash" />
    </my-field>

    <my-field :label="props.cddaData.isStab() ? 'stab' : 'cut'">
      <my-text :content="data.cut" />
    </my-field>

    <loader-view :cddaData="data.toHit" />

    <my-field label="baseMovesPerAttack">
      <my-text :content="data.baseMovesPerAttack" />
    </my-field>

    <my-field label="weaponCategory" v-if="arrayIsNotEmpty(data.weaponCategory)">
      <my-text-async-id :content="data.weaponCategory" separator=", " />
    </my-field>

    <my-field label="techniques" v-if="arrayIsNotEmpty(data.techniques)">
      <my-text-async-id :content="data.techniques" separator=", " />
    </my-field>
  </my-card>
</template>

<script lang="ts">
export default {
  name: 'ItemMeleeCard',
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
import { BaseItem } from 'src/type/loader/item/BaseItemLoader';
import { arrayIsNotEmpty } from 'src/util/commonUtil';
import { reactive } from 'vue';
const props = defineProps<{
  cddaData: BaseItem;
}>();
const data = reactive(props.cddaData.data);
</script>
