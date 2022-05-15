import FuelExplosionFieldSet from 'src/components/loaderView/card/material/FuelExplosionFieldSet.vue';
import { JsonItem } from 'src/type/common/baseType';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { getBoolean, getNumber } from 'src/util/baseJsonUtil';
import { h, VNode } from 'vue';

export class FuelExplosion extends SuperLoader<FuelExplosionInterface> {
  doToView(result: VNode[]): void {
    if (this.isLoad && this.jsonItem) {
      result.push(h(FuelExplosionFieldSet, { cddaData: this }));
    }
  }

  doLoad(data: FuelExplosionInterface, jsonItem: JsonItem, jsonObject: object): void {
    this.parseJson(data, jsonObject as Record<string, unknown>);
  }

  validateValue(jsonItem: JsonItem, jsonObject?: object): boolean {
    return jsonObject !== undefined;
  }

  private parseJson(data: FuelExplosionInterface, jsonObject: Record<string, unknown>) {
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
