import MyCard from 'src/components/cddaItemLoader/MyCard.vue';
import MyField from 'src/components/cddaItemLoader/MyField.vue';
import MyText from 'src/components/cddaItemLoader/MyText/MyText.vue';
import BaseItemCard from 'src/components/loaderView/card/item/BaseItemCard.vue';
import ItemMeleeCard from 'src/components/loaderView/card/item/ItemMeleeCard.vue';
import { CddaType } from 'src/constant/cddaType';
import { Flag } from 'src/constant/FlagsContant';
import { JsonItem } from 'src/type/common/baseType';
import { CddaItemRef } from 'src/type/common/CddaItemRef';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { ToHit } from 'src/type/loader/item/ToHitLoader';
import { getArray, getNumber, getOptionalObject, getOptionalUnknown, getString } from 'src/util/baseJsonUtil';
import { arrayIsNotEmpty } from 'src/util/commonUtil';
import { isItem } from 'src/util/dataUtil';
import {
  getCddaItemRefs,
  getLength,
  getOptionalCddaItemRef,
  getTranslationString,
  getVolume,
  getWeight,
} from 'src/util/jsonUtil';
import { commonUpdateName, updateNameAndDes } from 'src/util/updateNameUtil';
import { h, VNode } from 'vue';
import { Armor } from './armor/ArmorLoader';
import {
  assginMaterialsAndMaterialPortionsTotal,
  calcBaseMovesPerAttack,
  calcCategory,
  calcLength,
} from './BaseItemService';
import { PocketData } from './PocketDataLoader';
export class BaseItem extends SuperLoader<BaseItemInterface> {
  doToView(result: VNode[], data: BaseItemInterface): void {
    result.push(h(BaseItemCard, { cddaData: this }));
    result.push(h(ItemMeleeCard, { cddaData: this }));
    if (arrayIsNotEmpty(data.pockets)) {
      result.push(
        h(MyCard, { label: 'pocket' }, () =>
          data.pockets.map((pocket, i) => {
            const result = [h(MyField, { label: 'SN' }, () => h(MyText, { content: i + 1 }))];
            result.push(...pocket.toView());
            return result;
          })
        )
      );
    }
    if (data.armor) {
      result.push(...data.armor.toView());
    }
  }

  doLoad(data: BaseItemInterface, jsonItem: JsonItem): void {
    this.parseJson(data, jsonItem.content as Record<string, unknown>, jsonItem);
  }

  validateValue(jsonItem: JsonItem): boolean {
    return isItem(jsonItem.type);
  }

  public hasFlag(flag: Flag) {
    return this.data.flags.some((myflag) => myflag.value.id === flag);
  }

  public isStab() {
    return this.hasFlag(Flag.SPEAR) || this.hasFlag(Flag.STAB);
  }

  private parseJson(data: BaseItemInterface, jsonObject: Record<string, unknown>, jsonItem: JsonItem) {
    data.name = getTranslationString(jsonObject, 'name');
    data.description = getTranslationString(jsonObject, 'description');
    data.symbol = getString(jsonObject, 'symbol');
    data.color = getString(jsonObject, 'color');
    data.weight = getWeight(jsonObject, 'weight');
    data.volume = getVolume(jsonObject, 'volume');
    data.longestSide = getLength(jsonObject, 'longest_side', calcLength(data.volume));
    data.baseMovesPerAttack = calcBaseMovesPerAttack(data.volume, data.weight);
    data.bash = getNumber(jsonObject, 'bashing');
    data.cut = getNumber(jsonObject, 'cutting');
    data.toHit = new ToHit();

    data.category =
      getOptionalCddaItemRef(jsonObject, 'category', CddaType.itemCategory, commonUpdateName) ?? calcCategory();

    data.flags = getCddaItemRefs(jsonObject, 'flags', CddaType.flag, commonUpdateName);
    data.weaponCategory = getCddaItemRefs(jsonObject, 'weapon_category', CddaType.weaponCategory, commonUpdateName);
    data.techniques = getCddaItemRefs(jsonObject, 'techniques', CddaType.technique, updateNameAndDes);
    data.pockets = getArray(jsonObject, 'pocket_data').map((pocketDataObj) => {
      const pocketData = new PocketData();
      pocketData.load(jsonItem, pocketDataObj as object);
      return pocketData;
    });
    const armor = new Armor();
    const armorData = getOptionalObject(jsonObject, 'armor_data');
    if (jsonItem.type === CddaType.armor || jsonItem.type === CddaType.toolArmor) {
      armor.load(jsonItem, jsonItem.content);
      data.armor = armor;
    } else if (armorData) {
      armor.load(jsonItem, armorData);
      data.armor = armor;
    }
    assginMaterialsAndMaterialPortionsTotal(data, jsonObject);
    data.toHit.load(jsonItem, (getOptionalUnknown(jsonObject, 'to_hit') as object) ?? {});
    data.armor?.backLoad(jsonItem, this);
  }
}

export interface BaseItemInterface {
  name: string;
  description: string;
  symbol: string;
  color: string;

  materials: [CddaItemRef, number][];
  materialPortionsTotal: number;

  weight: number;
  volume: number;
  longestSide: number;

  category: CddaItemRef;

  flags: CddaItemRef[];

  //melee
  bash: number;
  cut: number;
  toHit: ToHit;
  baseMovesPerAttack: number;
  weaponCategory: CddaItemRef[];
  techniques: CddaItemRef[];

  pockets: PocketData[];
  armor?: Armor;
}
