import SpellCard from 'src/components/loaderView/card/magic/SpellCard.vue';
import { CddaType } from 'src/constant/cddaType';
import { JsonItem } from 'src/type/common/baseType';
import { CddaItemRef } from 'src/type/common/CddaItemRef';
import { Translation } from 'src/type/common/Translation';
import { getArray, getNumber, getOptionalObject, getOptionalUnknown, getString } from 'src/util/baseJsonUtil';
import {
  getCddaItemRef,
  getCddaItemRefs,
  getOptionalCddaItemRef,
  getOptionalTranslation,
  getTranslation,
  getTranslations,
  getTranslationString,
} from 'src/util/jsonUtil';
import { commonUpdateName, updateNameInField } from 'src/util/updateNameUtil';
import { h, VNode } from 'vue';
import { SuperLoader } from '../baseLoader/SuperLoader';
import { normalizeRequirmentInterface, Requirement } from '../recipe/requirement/RequirementLoader';
import { FakeSpell } from './FakeSpellLoader';

export class Spell extends SuperLoader<SpellInterface> {
  doLoad(data: SpellInterface, jsonItem: JsonItem): void {
    this.parseJson(data, jsonItem.content as Record<string, unknown>, jsonItem);
  }

  doToView(result: VNode[]): void {
    result.push(h(SpellCard, { loader: this }));
  }

  validateValue(jsonItem: JsonItem): boolean {
    return jsonItem.type === CddaType.spell;
  }

  private parseJson(data: SpellInterface, jsonObject: Record<string, unknown>, jsonItem: JsonItem) {
    data.name = getTranslationString(jsonObject, 'name');
    data.description = getTranslationString(jsonObject, 'description');
    data.skill = getCddaItemRef(
      jsonObject,
      'skill',
      CddaType.skill,
      commonUpdateName,
      CddaItemRef.new('spellcraft', CddaType.skill, commonUpdateName)
    );

    const requirementObject = getOptionalObject(jsonObject, 'components');
    if (requirementObject) {
      data.requirement = new Requirement();
      data.requirement.load(jsonItem, requirementObject);
      data.normalRequirement = normalizeRequirmentInterface(data.requirement);
    }

    data.spellType = getTranslation(jsonObject, 'effect', 'spellType');
    data.shape = getTranslation(jsonObject, 'shape', 'spellShape');

    data.extraEffects = getArray(jsonObject, 'extra_effects').map((fakeSpellObj) => {
      const fakeSpell = new FakeSpell();
      fakeSpell.load(jsonItem, fakeSpellObj as object);
      return fakeSpell;
    });

    data.flags = getTranslations(jsonObject, 'flags', 'spellFlag');
    data.difficulty = getNumber(jsonObject, 'difficulty');
    data.maxLevel = getNumber(jsonObject, 'max_level');
    data.energySource = getOptionalTranslation(jsonObject, 'energy_source', 'spellEnergySource');
    data.damageType = getOptionalTranslation(jsonObject, 'damage_type', 'damageType');

    const learnSpellObj = getOptionalUnknown(jsonObject, 'learn_spells') as undefined | Record<string, number>;
    data.learnSpells = [];
    if (learnSpellObj) {
      for (const key in learnSpellObj) {
        data.learnSpells.push([CddaItemRef.new(key, CddaType.spell, commonUpdateName), learnSpellObj[key]]);
      }
    }

    const spellClassStr = getString(jsonObject, 'spell_class', 'none');
    if (spellClassStr.toLowerCase() !== 'none') {
      data.spellClass = CddaItemRef.new(spellClassStr, CddaType.mutation, commonUpdateName);
    }

    data.targetedMonsterIds = getCddaItemRefs(jsonObject, 'targeted_monster_ids', CddaType.monster, commonUpdateName);
    data.validTargets = getTranslations(jsonObject, 'valid_targets', 'spellTarget');
    data.affectedBodyParts = getCddaItemRefs(jsonObject, 'affected_body_parts', CddaType.bodyPart, commonUpdateName);

    data.minAccuracy = getNumber(jsonObject, 'min_accuracy', 20);
    data.maxAccuracy = getNumber(jsonObject, 'max_accuracy', 20);
    data.accuracyIncrement = getNumber(jsonObject, 'accuracy_increment');
    data.accuracyIncrement = getIncrement(data.minAccuracy, data.maxAccuracy, data.accuracyIncrement, data.maxLevel);

    data.minEnergy = getNumber(jsonObject, 'base_energy_cost');
    data.maxEnergy = getNumber(jsonObject, 'final_energy_cost');
    data.energyIncrement = getNumber(jsonObject, 'energy_increment');
    data.energyIncrement = getIncrement(data.minEnergy, data.maxEnergy, data.energyIncrement, data.maxLevel);

    data.minCastTime = getNumber(jsonObject, 'base_casting_time');
    data.maxCastTime = getNumber(jsonObject, 'final_casting_time');
    data.castTimeIncrement = getNumber(jsonObject, 'casting_time_increment');
    data.castTimeIncrement = getIncrement(data.minCastTime, data.maxCastTime, data.castTimeIncrement, data.maxLevel);

    data.minDamage = getNumber(jsonObject, 'min_damage');
    data.maxDamage = getNumber(jsonObject, 'max_damage');
    data.damageIncrement = getNumber(jsonObject, 'damage_increment');
    data.damageIncrement = getIncrement(data.minDamage, data.maxDamage, data.damageIncrement, data.maxLevel);

    data.minRange = getNumber(jsonObject, 'min_range');
    data.maxRange = getNumber(jsonObject, 'max_range');
    data.rangeIncrement = getNumber(jsonObject, 'range_increment');
    data.rangeIncrement = getIncrement(data.minRange, data.maxRange, data.rangeIncrement, data.maxLevel);

    data.minAoe = getNumber(jsonObject, 'min_aoe');
    data.maxAoe = getNumber(jsonObject, 'max_aoe');
    data.aoeIncrement = getNumber(jsonObject, 'aoe_increment');
    data.aoeIncrement = getIncrement(data.minAoe, data.maxAoe, data.aoeIncrement, data.maxLevel);

    data.minDot = getNumber(jsonObject, 'min_dot');
    data.maxDot = getNumber(jsonObject, 'max_dot');
    data.dotIncrement = getNumber(jsonObject, 'dot_increment');
    data.dotIncrement = getIncrement(data.minDot, data.maxDot, data.dotIncrement, data.maxLevel);

    data.minDuration = getNumber(jsonObject, 'min_duration');
    data.maxDuration = getNumber(jsonObject, 'max_duration');
    data.durationIncrement = getNumber(jsonObject, 'duration_increment');
    data.durationIncrement = getIncrement(data.minDuration, data.maxDuration, data.durationIncrement, data.maxLevel);

    data.minPierce = getNumber(jsonObject, 'min_pierce');
    data.maxPierce = getNumber(jsonObject, 'max_pierce');
    data.pierceIncrement = getNumber(jsonObject, 'pierce_increment');
    data.pierceIncrement = getIncrement(data.minPierce, data.maxPierce, data.pierceIncrement, data.maxLevel);

    data.field = getOptionalCddaItemRef(jsonObject, 'field_id', CddaType.field, updateNameInField);
    data.fieldChance = getNumber(jsonObject, 'field_chance', 1);
    data.fieldVariance = getNumber(jsonObject, 'field_intensity_variance');
    data.minFieldIntensity = getNumber(jsonObject, 'min_field_intensity');
    data.maxFieldIntensity = getNumber(jsonObject, 'max_field_intensity');
    data.fieldIntensityIncrement = getNumber(jsonObject, 'field_intensity_increment');
    data.fieldIntensityIncrement = getIncrement(
      data.minFieldIntensity,
      data.maxFieldIntensity,
      data.fieldIntensityIncrement,
      data.maxLevel
    );

    function getIncrement(min: number, max: number, increment: number, maxLevel: number) {
      if (increment !== 0) {
        return increment;
      }
      if (min === max || maxLevel === 0) {
        return 0;
      }
      return Math.round(((max - min) / maxLevel) * 100) / 100;
    }
  }
}

interface SpellInterface {
  name: string;
  description: string;

  skill: CddaItemRef;
  requirement?: Requirement;
  normalRequirement?: Requirement;
  spellType: Translation;
  shape: Translation;
  extraEffects: FakeSpell[];
  flags: Translation[];
  difficulty: number;
  maxLevel: number;
  energySource?: Translation;
  damageType?: Translation;
  learnSpells: [CddaItemRef, number][];
  //mutation
  spellClass?: CddaItemRef;

  targetedMonsterIds: CddaItemRef[];
  validTargets: Translation[];
  affectedBodyParts: CddaItemRef[];

  minAccuracy: number;
  maxAccuracy: number;
  accuracyIncrement: number;

  minEnergy: number;
  maxEnergy: number;
  energyIncrement: number;

  minCastTime: number;
  maxCastTime: number;
  castTimeIncrement: number;

  minDamage: number;
  maxDamage: number;
  damageIncrement: number;

  minRange: number;
  maxRange: number;
  rangeIncrement: number;

  minAoe: number;
  maxAoe: number;
  aoeIncrement: number;

  minDot: number;
  maxDot: number;
  dotIncrement: number;

  minDuration: number;
  maxDuration: number;
  durationIncrement: number;

  minPierce: number;
  maxPierce: number;
  pierceIncrement: number;

  field?: CddaItemRef;
  fieldChance: number;
  fieldVariance: number;
  minFieldIntensity: number;
  maxFieldIntensity: number;
  fieldIntensityIncrement: number;
}
