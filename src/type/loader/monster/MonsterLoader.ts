import MonsterCard from 'src/components/loaderView/card/monster/MonsterCard.vue';
import { CddaType } from 'src/constant/cddaType';
import { JsonItem } from 'src/type/common/baseType';
import { getString } from 'src/util/baseJsonUtil';
import { getTranslationString } from 'src/util/jsonUtil';
import { h, VNode } from 'vue';
import { SuperLoader } from '../baseLoader/SuperLoader';

export class Monster extends SuperLoader<MonsterInterface> {
  doLoad(data: MonsterInterface, jsonItem: JsonItem): void {
    this.parseJson(data, jsonItem.content as Record<string, unknown>, jsonItem);
  }

  doToView(result: VNode[]): void {
    result.push(h(MonsterCard, { loader: this }));
  }

  validateValue(jsonItem: JsonItem): boolean {
    return jsonItem.type === CddaType.monster;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private parseJson(data: MonsterInterface, jsonObject: Record<string, unknown>, jsonItem: JsonItem) {
    data.name = getTranslationString(jsonObject, 'name');
    data.description = getTranslationString(jsonObject, 'description');
    data.symbol = getString(jsonObject, 'sym');
    data.color = getString(jsonObject, 'color');
  }
}

interface MonsterInterface {
  name: string;
  description: string;
  symbol: string;
  color: string;
}
