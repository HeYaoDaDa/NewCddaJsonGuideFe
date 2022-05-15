import FuelFieldSet from 'src/components/loaderView/card/material/FuelFieldSet.vue';
import { CddaType } from 'src/constant/cddaType';
import { JsonItem } from 'src/type/common/baseType';
import { CddaItemRef } from 'src/type/common/CddaItemRef';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { getBoolean, getNumber } from 'src/util/baseJsonUtil';
import { getOptionalCddaItemRef } from 'src/util/jsonUtil';
import { commonUpdateName } from 'src/util/updateNameUtil';
import { h, VNode } from 'vue';
import { FuelExplosion } from './FuelExplosionLoader';

export class Fuel extends SuperLoader<FuelnInterface> {
  doToView(result: VNode[]): void {
    if (this.isLoad && this.jsonItem) {
      result.push(h(FuelFieldSet, { cddaData: this }));
    }
  }

  doLoad(data: FuelnInterface, jsonItem: JsonItem, jsonObject: object): void {
    this.parseJson(data, jsonObject as Record<string, unknown>, jsonItem);
  }

  validateValue(jsonItem: JsonItem, jsonObject?: object): boolean {
    return jsonObject !== undefined;
  }

  private parseJson(data: FuelnInterface, jsonObject: Record<string, unknown>, jsonItem: JsonItem) {
    data.energy = getNumber(jsonObject, 'energy', 0);
    if (jsonObject.hasOwnProperty('explosion_data')) {
      data.explosionData = new FuelExplosion();
      data.explosionData.load(jsonItem, jsonObject.explosion_data as object);
    }
    data.pumpTerrain = getOptionalCddaItemRef(jsonObject, 'pump_terrain', CddaType.terrain, commonUpdateName);
    data.isPerpetualFuel = getBoolean(jsonObject, 'perpetual', false);
  }
}

interface FuelnInterface {
  energy: number;
  explosionData?: FuelExplosion;
  pumpTerrain?: CddaItemRef;
  isPerpetualFuel: boolean;
}
