import ArmorCard from 'src/components/loaderView/card/item/ArmorCard.vue';
import { CddaType } from 'src/constant/cddaType';
import { JsonItem } from 'src/type/common/baseType';
import { CddaItemRef, generateCddaItemRefs } from 'src/type/common/CddaItemRef';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { getArray, getBoolean, getNumber, getOptionalNumber } from 'src/util/baseJsonUtil';
import { arrayIsEmpty, arrayIsNotEmpty } from 'src/util/commonUtil';
import { getCddaItemRefs, getOptionalCddaItemRef } from 'src/util/jsonUtil';
import { commonUpdateName } from 'src/util/updateNameUtil';
import { h, VNode } from 'vue';
import { BaseItem } from '../BaseItemLoader';
import { ArmorPortion } from './ArmorPortionLoader';
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

export class Armor extends SuperLoader<ArmorInterface> {
  doLoad(data: ArmorInterface, jsonItem: JsonItem, jsonObject: object): void {
    this.parseJson(data, jsonObject as Record<string, unknown>, jsonItem);
  }

  doToView(result: VNode[]): void {
    result.push(h(ArmorCard, { cddaData: this }));
  }

  validateValue(jsonItem: JsonItem, jsonObject?: object): boolean {
    return jsonItem.type === CddaType.armor || jsonItem.type === CddaType.toolArmor || jsonObject !== undefined;
  }

  public backLoad(jsonItem: JsonItem, item: BaseItem) {
    const data: ArmorInterface = this.data;
    inferSubArmorPortionsArmorMaterial(jsonItem, data.subArmorPortions, item);
    setSubArmorPotionsField(data.subArmorPortions, item);
    setSubArmorPotionsrRigidComfortable(data.subArmorPortions);
    data.armorPortions = [];
    consolidateSubArmorPotions(data.armorPortions, data.subArmorPortions);
    scaleAmalgamizedPortion(data.armorPortions);
    data.allLayers = [];
    setAllLayer(data.allLayers, data.armorPortions, data.subArmorPortions, item);
    setFeetRigid(data.subArmorPortions);
    setNonTraditionalNoRigid(data.subArmorPortions);
    setArmorRigidAndComfortable(data);
    setBreathability(data.armorPortions);
    data.armorResists = computeArmorResists(data.subArmorPortions, this.getAvgEnvironmentalProtection());
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

  private parseJson(data: ArmorInterface, jsonObject: Record<string, unknown>, jsonItem: JsonItem) {
    data.materialThickness = getOptionalNumber(jsonObject, 'material_thickness');

    data.environmentalProtection = getOptionalNumber(jsonObject, 'environmental_protection');
    data.environmentalProtectionFilter = getOptionalNumber(jsonObject, 'environmental_protection_with_filter');

    data.sided = getBoolean(jsonObject, 'sided', false);
    data.warmth = getNumber(jsonObject, 'warmth', 0);
    data.weightCapacityModifier = getNumber(jsonObject, 'weight_capacity_modifier', 1);
    data.weightCapacityBonus = getNumber(jsonObject, 'weight_capacity_bonus', 0);
    data.powerArmor = getBoolean(jsonObject, 'power_armor', false);
    data.nonFunctional = getOptionalCddaItemRef(jsonObject, 'non_functional', CddaType.item);
    data.validMods = generateCddaItemRefs(getArray(jsonObject, 'valid_mods', []) as string[], CddaType.item);
    assginArmorPortions();

    function assginArmorPortions() {
      const covers: CddaItemRef[] = getCddaItemRefs(jsonObject, 'covers', CddaType.bodyPart, commonUpdateName);
      data.subArmorPortions = getArray(jsonObject, 'armor', []).map((armorObject) => {
        const armorPortion = new ArmorPortion();
        armorPortion.load(jsonItem, armorObject as object);
        return armorPortion;
      });
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
  nonFunctional?: CddaItemRef;
  warmth: number;
  weightCapacityModifier: number;
  weightCapacityBonus: number;
  powerArmor: boolean;
  armorPortions: ArmorPortion[];
  subArmorPortions: ArmorPortion[];
  rigid: boolean;
  comfortable: boolean;
  validMods: CddaItemRef[];
  materialThickness?: number;
  environmentalProtection?: number;
  environmentalProtectionFilter?: number;
  allLayers: CddaItemRef[];

  armorResists: ArmorResistInterface[][];
}
