import MaterialBurnFieldSet from 'src/components/loaderView/card/material/MaterialBurnFieldSet.vue';
import { JsonItem } from 'src/type/common/baseType';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { getBoolean, getNumber } from 'src/util/baseJsonUtil';
import { getVolume } from 'src/util/jsonUtil';
import { h, VNode } from 'vue';

export class MaterialBurn extends SuperLoader<MaterialBurnInterface> {
  doToView(result: VNode[]): void {
    if (this.isLoad && this.jsonItem) {
      result.push(h(MaterialBurnFieldSet, { cddaData: this }));
    }
  }

  doLoad(data: MaterialBurnInterface, jsonItem: JsonItem, jsonObject: object): void {
    this.parseJson(data, jsonObject as Record<string, unknown>);
  }

  validateValue(jsonItem: JsonItem, jsonObject?: object): boolean {
    return jsonObject !== undefined;
  }

  private parseJson(data: MaterialBurnInterface, jsonObject: Record<string, unknown>) {
    data.immune = getBoolean(jsonObject, 'immune');
    data.volumePerTurn = getVolume(jsonObject, 'volume_per_turn');
    data.fuel = getNumber(jsonObject, 'fuel');
    data.smoke = getNumber(jsonObject, 'smoke');
    data.burn = getNumber(jsonObject, 'burn');
  }
}

interface MaterialBurnInterface {
  immune: boolean;
  volumePerTurn: number;
  fuel: number;
  smoke: number;
  burn: number;
}
