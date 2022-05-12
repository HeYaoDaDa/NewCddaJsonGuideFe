import { CddaType } from 'src/constant/cddaType';
import { AsyncId, generateAsyncIds } from 'src/type/common/AsyncId';
import { JsonItem } from 'src/type/common/baseType';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { commonUpdateName } from 'src/util/asyncUpdateName';
import { getArray, getBoolean, getNumber, getOptionalNumber } from 'src/util/baseJsonUtil';
import { arrayIsEmpty, arrayIsNotEmpty } from 'src/util/commonUtil';
import { getAsyncIds, getOptionalAsyncId } from 'src/util/jsonUtil';
import { VNode, h } from 'vue';
import { ArmorPortion } from './ArmorPortionLoader';
import ArmorCard from 'src/components/loaderView/card/item/ArmorCard.vue';
import { ArmorResistInterface, computeArmorResists } from './ArmorResistService';
import {
  consolidateSubArmorPotions,
  inferSubArmorPortionsArmorMaterial,
  scaleAmalgamizedPortion,
  setAllLayer,
  setArmorRigidAndComfortable,
  setBreathability,
  setFeetRigid,
  setNonTraditionalNoRigid,
  setSubArmorPotionsField,
  setSubArmorPotionsrRigidComfortable,
} from './ArmorService';
import { BaseItem } from '../BaseItemLoader';

export class Armor extends SuperLoader<ArmorInterface> {
  async doLoad(data: ArmorInterface, jsonItem: JsonItem, jsonObject: object): Promise<void> {
    await this.parseJson(data, jsonObject as Record<string, unknown>, jsonItem);
  }

  toView(): VNode[] {
    const result = new Array<VNode>();

    result.push(h(ArmorCard, { cddaData: this }));

    return result;
  }

  validateValue(jsonItem: JsonItem, jsonObject?: object): boolean {
    return jsonItem.type === CddaType.armor || jsonItem.type === CddaType.toolArmor || jsonObject !== undefined;
  }

  public async backLoad(jsonItem: JsonItem, item: BaseItem) {
    const data: ArmorInterface = this.data;
    await inferSubArmorPortionsArmorMaterial(jsonItem, data.subArmorPortions, item);
    setSubArmorPotionsField(data.subArmorPortions, item);
    await setSubArmorPotionsrRigidComfortable(data.subArmorPortions);
    data.armorPortions = [];
    await consolidateSubArmorPotions(data.armorPortions, data.subArmorPortions);
    scaleAmalgamizedPortion(data.armorPortions);
    data.allLayers = [];
    await setAllLayer(data.allLayers, data.armorPortions, data.subArmorPortions, item);
    await setFeetRigid(data.subArmorPortions);
    setNonTraditionalNoRigid(data.subArmorPortions);
    setArmorRigidAndComfortable(data);
    await setBreathability(data.armorPortions);
    data.armorResists = await computeArmorResists(data.subArmorPortions, this.getAvgEnvironmentalProtection());
  }

  public getAvgEnvironmentalProtection() {
    let result = 0;
    if (arrayIsEmpty(this.data.armorPortions)) {
      return 0;
    }
    this.data.armorPortions.forEach(({ data: armorPortion }) => {
      result += armorPortion.environmentalProtection;
    });
    return Math.round(result / this.data.armorPortions.length);
  }

  private async parseJson(data: ArmorInterface, jsonObject: Record<string, unknown>, jsonItem: JsonItem) {
    data.materialThickness = getOptionalNumber(jsonObject, 'material_thickness');

    data.environmentalProtection = getOptionalNumber(jsonObject, 'environmental_protection');
    data.environmentalProtectionFilter = getOptionalNumber(jsonObject, 'environmental_protection_with_filter');

    data.sided = getBoolean(jsonObject, 'sided', false);
    data.warmth = getNumber(jsonObject, 'warmth', 0);
    data.weightCapacityModifier = getNumber(jsonObject, 'weight_capacity_modifier', 1);
    data.weightCapacityBonus = getNumber(jsonObject, 'weight_capacity_bonus', 0);
    data.powerArmor = getBoolean(jsonObject, 'power_armor', false);

    const asyncPromises = new Array<Promise<unknown>>();
    asyncPromises.push(
      assginArmorPortions(),
      (async () => (data.nonFunctional = await getOptionalAsyncId(jsonObject, 'non_functional', CddaType.item)))(),
      (async () =>
        (data.validMods = await generateAsyncIds(getArray(jsonObject, 'valid_mods', []) as string[], CddaType.item)))()
    );
    await Promise.allSettled(asyncPromises);

    async function assginArmorPortions() {
      let covers: AsyncId[];
      await Promise.all([
        (async () =>
          (data.subArmorPortions = await Promise.all(
            getArray(jsonObject, 'armor', []).map((armorObject) => {
              const armorPortion = new ArmorPortion();
              armorPortion.load(jsonItem, armorObject as object);
              return armorPortion;
            })
          )))(),
        (async () => (covers = await getAsyncIds(jsonObject, 'covers', CddaType.bodyPart, commonUpdateName)))(),
      ]);
      data.subArmorPortions.forEach((subArmorPortion) => {
        if (data.materialThickness) subArmorPortion.data.avgThickness = data.materialThickness;
        if (data.environmentalProtection) subArmorPortion.data.environmentalProtection = data.environmentalProtection;
        if (data.environmentalProtectionFilter)
          subArmorPortion.data.environmentalProtectionWithFilter = data.environmentalProtectionFilter;
        if (arrayIsNotEmpty(covers)) {
          subArmorPortion.data.coversBodyPart = covers;
        }
      });
    }
  }
}

export interface ArmorInterface {
  sided: boolean;
  nonFunctional?: AsyncId;
  warmth: number;
  weightCapacityModifier: number;
  weightCapacityBonus: number;
  powerArmor: boolean;
  armorPortions: ArmorPortion[];
  subArmorPortions: ArmorPortion[];
  rigid: boolean;
  comfortable: boolean;
  validMods: AsyncId[];
  materialThickness?: number;
  environmentalProtection?: number;
  environmentalProtectionFilter?: number;
  allLayers: AsyncId[];

  armorResists: ArmorResistInterface[][];
}
