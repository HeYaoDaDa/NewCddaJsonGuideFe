import MyCard from 'src/components/cddaItemLoader/MyCard.vue';
import MyField from 'src/components/cddaItemLoader/MyField.vue';
import MyText from 'src/components/cddaItemLoader/MyText/MyText.vue';
import BaseItemCard from 'src/components/loaderView/card/item/BaseItemCard.vue';
import ItemMeleeCard from 'src/components/loaderView/card/item/ItemMeleeCard.vue';
import { CddaType } from 'src/constant/cddaType';
import { Flag } from 'src/constant/FlagsContant';
import { AsyncId } from 'src/type/common/AsyncId';
import { JsonItem } from 'src/type/common/baseType';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { ToHit } from 'src/type/loader/item/ToHitLoader';
import { commonUpdateName, updateNameAndDes } from 'src/util/asyncUpdateName';
import { getArray, getNumber, getOptionalUnknown, getString } from 'src/util/baseJsonUtil';
import { arrayIsNotEmpty } from 'src/util/commonUtil';
import { isItem } from 'src/util/dataUtil';
import { getLength, getOptionalAsyncId, getTranslationString, getVolume, getWeight } from 'src/util/jsonUtil';
import { h, VNode } from 'vue';
import {
  assginMaterialsAndMaterialPortionsTotal,
  calcBaseMovesPerAttack,
  calcCategory,
  calcLength,
} from './BaseItemService';
import { PocketData } from './PocketDataLoader';
export class BaseItem extends SuperLoader<BaseItemInterface> {
  async doLoad(data: BaseItemInterface, jsonItem: JsonItem): Promise<void> {
    await this.parseJson(data, jsonItem.content as Record<string, unknown>, jsonItem);
  }

  toView(): VNode[] {
    const result = new Array<VNode>();
    const data = this.data;
    result.push(h(BaseItemCard, { cddaData: this }));
    result.push(h(ItemMeleeCard, { cddaData: this }));
    if (arrayIsNotEmpty(data.pockets))
      result.push(
        h(MyCard, { label: 'pocket' }, () =>
          data.pockets.map((pocket, i) => {
            const result = [h(MyField, { label: 'SN' }, () => h(MyText, { content: i + 1 }))];
            result.push(...pocket.toView());
            return result;
          })
        )
      );

    return result;
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

  private async parseJson(data: BaseItemInterface, jsonObject: Record<string, unknown>, jsonItem: JsonItem) {
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

    const asyncPromises = new Array<Promise<unknown>>();
    asyncPromises.push(
      (async () =>
        (data.category =
          (await getOptionalAsyncId(jsonObject, 'category', CddaType.itemCategory, commonUpdateName)) ??
          (await calcCategory())))(),
      (async () =>
        (data.flags = await Promise.all(
          getArray(jsonObject, 'flags', []).map(
            async (flag) => await AsyncId.new(<string>flag, CddaType.flag, commonUpdateName)
          )
        )))(),
      (async () =>
        (data.weaponCategory = await Promise.all(
          getArray(jsonObject, 'weapon_category').map(
            async (value) => await AsyncId.new(<string>value, CddaType.weaponCategory, commonUpdateName)
          )
        )))(),
      (async () =>
        (data.techniques = await Promise.all(
          getArray(jsonObject, 'techniques').map(
            async (value) => await AsyncId.new(<string>value, CddaType.technique, updateNameAndDes)
          )
        )))(),
      (async () =>
        (data.pockets = await Promise.all(
          getArray(jsonObject, 'pocket_data').map(async (pocketDataObj) => {
            const pocketData = new PocketData();
            await pocketData.load(jsonItem, pocketDataObj as object);
            return pocketData;
          })
        )))(),
      assginMaterialsAndMaterialPortionsTotal(data, jsonObject),
      data.toHit.load(jsonItem, (getOptionalUnknown(jsonObject, 'to_hit') as object) ?? {})
    );
    await Promise.allSettled(asyncPromises);
  }
}

export interface BaseItemInterface {
  name: string;
  description: string;
  symbol: string;
  color: string;

  materials: [AsyncId, number][];
  materialPortionsTotal: number;

  weight: number;
  volume: number;
  longestSide: number;

  category: AsyncId;

  flags: AsyncId[];

  //melee
  bash: number;
  cut: number;
  toHit: ToHit;
  baseMovesPerAttack: number;
  weaponCategory: AsyncId[];
  techniques: AsyncId[];

  pockets: PocketData[];
}
