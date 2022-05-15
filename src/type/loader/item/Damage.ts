import DamageFieldSet from 'src/components/loaderView/card/item/DamageFieldSet.vue';
import { JsonItem } from 'src/type/common/baseType';
import { Translation } from 'src/type/common/Translation';
import { getNumber } from 'src/util/baseJsonUtil';
import { getTranslation } from 'src/util/jsonUtil';
import { h, VNode } from 'vue';
import { SuperLoader } from '../baseLoader/SuperLoader';

export class Damage extends SuperLoader<DamageInterface> {
  doLoad(data: DamageInterface, jsonItem: JsonItem, jsonObject?: object): void {
    this.parseJson(data, jsonObject as Record<string, unknown>);
  }

  doToView(result: VNode[]): void {
    result.push(h(DamageFieldSet, { loader: this }));
  }

  validateValue(jsonItem: JsonItem, jsonObject?: object): boolean {
    return jsonObject !== undefined;
  }

  private parseJson(data: DamageInterface, jsonObject: Record<string, unknown>) {
    data.damageType = getTranslation(jsonObject, 'damage_type', 'damageType');
    data.amount = getNumber(jsonObject, 'amount');
    data.armorPenetration = getNumber(jsonObject, 'armor_penetration');
    data.armorPenetrationMultiplier = getNumber(jsonObject, 'armor_multiplier', 1);
    data.damageMultiplier = getNumber(jsonObject, 'damage_multiplier', 1);
    data.unconditionalArmorPenetrationMultiplier = getNumber(jsonObject, 'constant_armor_multiplier', 1);
    data.unconditionalDamageMultiplier = getNumber(jsonObject, 'constant_damage_multiplier', 1);
  }
}

export interface DamageInterface {
  damageType: Translation;
  amount: number;
  armorPenetration: number;
  armorPenetrationMultiplier: number;
  damageMultiplier: number;
  unconditionalArmorPenetrationMultiplier: number;
  unconditionalDamageMultiplier: number;
}
