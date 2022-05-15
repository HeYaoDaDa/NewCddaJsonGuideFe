<template>
  <my-card width="-webkit-fill-available">
    <template v-slot:befor>
      <symbol-name-bar
        :name="data.name"
        :description="data.description"
        :mod-id="props.loader.jsonItem?.mod ?? 'dda'"
      />
    </template>

    <my-field label="skill">
      <my-text-async-id :content="toArray(data.skill)" />
    </my-field>

    <my-field label="component" v-if="data.normalRequirement">
      <loader-view :cddaData="data.normalRequirement" />
    </my-field>

    <my-field label="type">
      <my-text :content="data.spellType.translate()" />
    </my-field>

    <my-field label="shape">
      <my-text :content="data.shape.translate()" />
    </my-field>

    <my-field label="extraEffects" v-if="arrayIsNotEmpty(data.extraEffects)" ul>
      <li v-for="item in data.extraEffects" :key="item.data.spell.value.id">
        <dl>
          <loader-view :cddaData="item" />
        </dl>
      </li>
    </my-field>

    <my-field label="flag" v-if="arrayIsNotEmpty(data.flags)">
      <my-text :content="data.flags.map((flag) => flag.translate())" validTargets />
    </my-field>

    <my-field label="difficulty">
      <my-text :content="data.difficulty" />
    </my-field>

    <my-field label="maxLevel">
      <my-text :content="data.maxLevel" />
    </my-field>

    <my-field label="energySource" v-if="data.energySource">
      <my-text :content="data.energySource.translate()" />
    </my-field>

    <my-field label="damageType" v-if="data.damageType">
      <my-text :content="data.damageType.translate()" />
    </my-field>

    <my-field label="learnSpell" v-if="arrayIsNotEmpty(data.learnSpells)" ul>
      <li v-for="item in data.learnSpells" :key="item[0].value.id">
        <my-text-async-id :content="toArray(item[0])" />
        <my-text :content="': ' + item[1].toString()" />
      </li>
    </my-field>

    <my-field label="spellClass" v-if="data.spellClass">
      <my-text-async-id :content="toArray(data.spellClass)" />
    </my-field>

    <my-field label="targetedMonster" v-if="arrayIsNotEmpty(data.targetedMonsterIds)">
      <my-text-async-id :content="data.targetedMonsterIds" />
    </my-field>

    <my-field label="validTargets" v-if="arrayIsNotEmpty(data.validTargets)">
      <my-text :content="data.validTargets.map((target) => target.translate())" separator=", " />
    </my-field>

    <my-field label="affectedBodyPart" v-if="arrayIsNotEmpty(data.affectedBodyParts)">
      <my-text-async-id :content="data.affectedBodyParts" />
    </my-field>

    <my-field label="accuracy">
      <my-text :content="showString(data.minAccuracy, data.maxAccuracy, data.accuracyIncrement)" />
    </my-field>

    <my-field label="energy" v-if="notZero(data.minEnergy, data.maxEnergy)">
      <my-text :content="showString(data.minEnergy, data.maxEnergy, data.energyIncrement)" />
    </my-field>

    <my-field label="damage" v-if="notZero(data.minDamage, data.maxDamage)">
      <my-text :content="showString(data.minDamage, data.maxDamage, data.damageIncrement)" />
    </my-field>

    <my-field label="range" v-if="notZero(data.minRange, data.maxRange)">
      <my-text :content="showString(data.minRange, data.maxRange, data.rangeIncrement)" />
    </my-field>

    <my-field label="aoe" v-if="notZero(data.minAoe, data.maxAoe)">
      <my-text :content="showString(data.minAoe, data.maxAoe, data.aoeIncrement)" />
    </my-field>

    <my-field label="dot" v-if="notZero(data.minDot, data.maxDot)">
      <my-text :content="showString(data.minDot, data.maxDot, data.dotIncrement)" />
    </my-field>

    <my-field label="duration" v-if="notZero(data.minDuration, data.maxDuration)">
      <my-text :content="showString(data.minDuration, data.maxDuration, data.durationIncrement)" />
    </my-field>

    <my-field label="pierce" v-if="notZero(data.minPierce, data.maxPierce)">
      <my-text :content="showString(data.minPierce, data.maxPierce, data.pierceIncrement)" />
    </my-field>

    <my-field label="field" v-if="data.field">
      <my-text-async-id :content="toArray(data.field)" />
      <my-text :content="` chance:${data.fieldChance * 100}% variance:${data.fieldVariance} `" />
      <my-text :content="showString(data.minFieldIntensity, data.maxFieldIntensity, data.fieldIntensityIncrement)" />
    </my-field>
  </my-card>
</template>

<script lang="ts">
export default {
  name: 'SpellCard',
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
import SymbolNameBar from 'src/components/loaderView/SymbolNameBar.vue';
import { Spell } from 'src/type/loader/magic/SpellLoader';
import { arrayIsNotEmpty, toArray } from 'src/util/commonUtil';
import { reactive } from 'vue';
const props = defineProps<{
  loader: Spell;
}>();
const data = reactive(props.loader.data);

function notZero(a: number, b: number) {
  return a !== 0 || b !== 0;
}

function showString(min: number, max: number, increment: number) {
  return `min:${min} max:${max} increment:${increment}`;
}
</script>
