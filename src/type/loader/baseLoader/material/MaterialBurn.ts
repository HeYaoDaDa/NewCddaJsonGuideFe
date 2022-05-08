import MaterialBurnFieldSet from 'src/components/loaderView/card/material/MaterialBurnFieldSet.vue';
import { JsonItem } from 'src/type/common/baseType';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { getBoolean, getNumber } from 'src/util/baseJsonUtil';
import { getVolume } from 'src/util/jsonUtil';
import { h, VNode } from 'vue';

export class MaterialBurn extends SuperLoader<MaterialBurnInterface> {
  async doLoad(data: MaterialBurnInterface, jsonItem: JsonItem, jsonObject: object): Promise<void> {
    await this.parseJson(data, jsonObject as Record<string, unknown>);
  }

  toView(): VNode[] {
    const result = new Array<VNode>();

    if (this.isLoad && this.jsonItem) {
      h(MaterialBurnFieldSet, { cddaData: this });
    }

    return result;
  }

  validateValue(jsonItem: JsonItem, jsonObject?: object): boolean {
    return jsonObject !== undefined;
  }

  private async parseJson(data: MaterialBurnInterface, jsonObject: Record<string, unknown>) {
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
