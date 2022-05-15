<template>
  <my-field label="type">
    <my-text :content="data.damageType.translate()" />
  </my-field>

  <my-field label="amount">
    <my-text :content="data.amount" />
  </my-field>

  <my-field label="armorPenetration" v-if="data.armorPenetration !== 0">
    <my-text :content="data.armorPenetration" />
  </my-field>

  <my-field label="armorPenetrationMultiplier" v-if="data.armorPenetrationMultiplier !== 1">
    <my-text :content="data.armorPenetrationMultiplier" />
  </my-field>

  <my-field label="damageMultiplier" v-if="data.damageMultiplier !== 1">
    <my-text :content="data.damageMultiplier" />
  </my-field>

  <my-field label="unconditionalArmorPenetrationMultiplier" v-if="data.unconditionalArmorPenetrationMultiplier !== 1">
    <my-text :content="data.unconditionalArmorPenetrationMultiplier" />
  </my-field>

  <my-field label="unconditionalDamageMultiplier" v-if="data.unconditionalDamageMultiplier !== 1">
    <my-text :content="data.unconditionalDamageMultiplier" />
  </my-field>
</template>

<script lang="ts">
export default {
  name: 'DamageFieldSet',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import MyField from 'src/components/cddaItemLoader/MyField.vue';
import MyText from 'src/components/cddaItemLoader/MyText/MyText.vue';
import { Damage } from 'src/type/loader/item/Damage';
import { reactive } from 'vue';
const props = defineProps<{
  loader: Damage;
}>();
const data = reactive(props.loader.data);
</script>
