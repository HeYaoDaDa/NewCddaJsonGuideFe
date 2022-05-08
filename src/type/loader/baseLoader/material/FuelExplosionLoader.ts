import { JsonItem } from 'src/type/common/baseType';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { getBoolean, getNumber } from 'src/util/baseJsonUtil';
import { h, VNode } from 'vue';
import FuelExplosionFieldSet from 'src/components/loaderView/card/material/FuelExplosionFieldSet.vue';

export class FuelExplosion extends SuperLoader<FuelExplosionInterface> {
  async doLoad(data: FuelExplosionInterface, jsonItem: JsonItem, jsonObject: object): Promise<void> {
    await this.parseJson(data, jsonObject as Record<string, unknown>);
  }

  toView(): VNode[] {
    const result = new Array<VNode>();

    if (this.isLoad && this.jsonItem) {
      h(FuelExplosionFieldSet, { cddaData: this });
    }

    return result;
  }

  validateValue(jsonItem: JsonItem, jsonObject?: object): boolean {
    return jsonObject !== undefined;
  }

  private async parseJson(data: FuelExplosionInterface, jsonObject: Record<string, unknown>) {
    data.chanceHot = getNumber(jsonObject, 'chance_hot');
    data.chanceCold = getNumber(jsonObject, 'chance_cold');
    data.factor = getNumber(jsonObject, 'factor');
    data.sizeFactor = getNumber(jsonObject, 'size_factor');
    data.fiery = getBoolean(jsonObject, 'fiery');
  }
}

interface FuelExplosionInterface {
  chanceHot: number;
  chanceCold: number;
  factor: number;
  sizeFactor: number;
  fiery: boolean;
}
