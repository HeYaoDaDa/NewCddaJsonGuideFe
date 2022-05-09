<template>
  <my-card label="proficiency">
    <my-field label="name">
      <my-text :content="data.name" />
    </my-field>

    <my-field label="description">
      <my-text :content="data.description" />
    </my-field>

    <my-field label="canLearn">
      <my-text :content="data.canLearn" />
    </my-field>

    <my-field label="ignoreFocus">
      <my-text :content="data.ignoreFocus" />
    </my-field>

    <my-field label="defaultTimeMultiplier">
      <my-text :content="data.defaultTimeMultiplier" />
    </my-field>

    <my-field label="defaultFailMultiplier">
      <my-text :content="data.defaultFailMultiplier" />
    </my-field>

    <my-field label="defaultWeakpointBonus">
      <my-text :content="data.defaultWeakpointBonus" />
    </my-field>

    <my-field label="defaultWeakpointPenalty">
      <my-text :content="data.defaultWeakpointPenalty" />
    </my-field>

    <my-field label="learnTime">
      <my-text :content="data.learnTime" />
    </my-field>

    <my-field label="required" v-if="arrayIsNotEmpty(data.required)">
      <my-text-async-id :content="data.required" />
    </my-field>

    <my-field label="bonuses" v-if="arrayIsNotEmpty(data.bonuses)" ul>
      <li v-for="bonuse in data.bonuses" :key="bonuse.key">
        <dl>
          <my-field label="key"><my-text :content="bonuse.key" /></my-field>
          <my-field label="bonuses" ul
            ><my-text
              :content="
                bonuse.bonuses.map((bonuse) =>
                  bonuse.type.translate().concat(bonuse.value > 0 ? ' +' : ' ', bonuse.value.toString())
                )
              "
              li
          /></my-field>
        </dl>
      </li>
    </my-field>
  </my-card>
</template>

<script lang="ts">
export default {
  name: 'ProficiencyFieldSet',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import MyCard from 'src/components/cddaItemLoader/MyCard.vue';
import MyField from 'src/components/cddaItemLoader/MyField.vue';
import MyText from 'src/components/cddaItemLoader/MyText/MyText.vue';
import MyTextAsyncId from 'src/components/cddaItemLoader/MyText/MyTextAsyncId.vue';
import { Proficiency } from 'src/type/loader/recipe/ProficiencyLoader';
import { arrayIsNotEmpty } from 'src/util/commonUtil';
import { reactive } from 'vue';
const props = defineProps<{
  cddaData: Proficiency;
}>();
const data = reactive(props.cddaData.data);
</script>
