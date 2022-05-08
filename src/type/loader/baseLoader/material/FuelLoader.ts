import { JsonItem } from 'src/type/common/baseType';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { getBoolean, getNumber } from 'src/util/baseJsonUtil';
import { h, VNode } from 'vue';
import FuelFieldSet from 'src/components/loaderView/card/material/FuelFieldSet.vue';
import { FuelExplosion } from './FuelExplosionLoader';
import { AsyncId } from 'src/type/common/AsyncId';
import { getOptionalAsyncId } from 'src/util/jsonUtil';
import { CddaType } from 'src/constant/cddaType';
import { commonUpdateName } from 'src/util/asyncUpdateName';

export class Fuel extends SuperLoader<FuelnInterface> {
  async doLoad(data: FuelnInterface, jsonItem: JsonItem, jsonObject: object): Promise<void> {
    await this.parseJson(data, jsonObject as Record<string, unknown>, jsonItem);
  }

  toView(): VNode[] {
    const result = new Array<VNode>();

    if (this.isLoad && this.jsonItem) {
      h(FuelFieldSet, { cddaData: this });
    }

    return result;
  }

  validateValue(jsonItem: JsonItem, jsonObject?: object): boolean {
    return jsonObject !== undefined;
  }

  private async parseJson(data: FuelnInterface, jsonObject: Record<string, unknown>, jsonItem: JsonItem) {
    const asyncPromises = new Array<Promise<unknown>>();
    data.energy = getNumber(jsonObject, 'energy', 0);
    if (jsonObject.hasOwnProperty('explosion_data')) {
      data.explosionData = new FuelExplosion();
      asyncPromises.push(data.explosionData.load(jsonItem, jsonObject.explosion_data as object));
    }
    asyncPromises.push(
      (async () =>
        (data.pumpTerrain = await getOptionalAsyncId(jsonObject, 'pump_terrain', CddaType.terrain, commonUpdateName)))()
    );
    data.isPerpetualFuel = getBoolean(jsonObject, 'perpetual', false);
    await Promise.allSettled(asyncPromises);
  }
}

interface FuelnInterface {
  energy: number;
  explosionData?: FuelExplosion;
  pumpTerrain?: AsyncId;
  isPerpetualFuel: boolean;
}
