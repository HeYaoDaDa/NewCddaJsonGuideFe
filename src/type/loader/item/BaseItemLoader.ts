import { CddaType } from 'src/constant/cddaType';
import { AsyncId } from 'src/type/common/AsyncId';
import { JsonItem } from 'src/type/common/baseType';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { commonUpdateName } from 'src/util/asyncUpdateName';
import { getArray, getNumber, getString } from 'src/util/baseJsonUtil';
import { getLength, getOptionalAsyncId, getTranslationString, getVolume, getWeight } from 'src/util/jsonUtil';
import { h, VNode } from 'vue';
import { assginMaterialsAndMaterialPortionsTotal, calcBaseMovesPerAttack, calcCategory } from './BaseItemService';
import BaseItemCard from 'src/components/loaderView/card/item/BaseItemCard.vue';
import { isItem } from 'src/util/dataUtil';

export class BaseItem extends SuperLoader<BaseItemInterface> {
  async doLoad(data: BaseItemInterface, jsonItem: JsonItem): Promise<void> {
    await this.parseJson(data, jsonItem.content as Record<string, unknown>, jsonItem);
  }

  toView(): VNode[] {
    const result = new Array<VNode>();

    result.push(h(BaseItemCard, { cddaData: this }));

    return result;
  }

  validateValue(jsonItem: JsonItem): boolean {
    return isItem(jsonItem.type);
  }

  private async parseJson(data: BaseItemInterface, jsonObject: Record<string, unknown>, jsonItem: JsonItem) {
    data.name = getTranslationString(jsonObject, 'name');
    data.description = getTranslationString(jsonObject, 'description');
    data.symbol = getString(jsonObject, 'symbol');
    data.color = getString(jsonObject, 'color');
    data.weight = getWeight(jsonObject, 'weight');
    data.volume = getVolume(jsonObject, 'volume');
    data.baseMovesPerAttack = calcBaseMovesPerAttack(data.volume, data.weight);
    data.longestSide = getLength(jsonObject, 'longest_side', -1);
    data.bash = getNumber(jsonObject, 'bashing');
    data.cut = getNumber(jsonObject, 'cutting');

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
            async (value) => await AsyncId.new(<string>value, CddaType.technique, commonUpdateName)
          )
        )))(),
      assginMaterialsAndMaterialPortionsTotal(data, jsonObject)
    );
    await Promise.allSettled(asyncPromises);
  }
}

export interface BaseItemInterface {
  name: string;
  description: string;
  symbol: string;
  color: string;

  // pockets?: PocketData[];

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
  // ToHitNum: number;
  weaponCategory: AsyncId[];
  techniques: AsyncId[];
  baseMovesPerAttack: number;
}
