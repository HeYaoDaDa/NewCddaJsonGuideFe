import MyField from 'src/components/cddaItemLoader/MyField.vue';
import MyText from 'src/components/cddaItemLoader/MyText/MyText.vue';
import { JsonItem } from 'src/type/common/baseType';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { getBoolean, getNumber } from 'src/util/baseJsonUtil';
import { h, VNode } from 'vue';
import { Shrapnel } from './ShrapnelLoader';

export class Explosion extends SuperLoader<ExplosionlInterface> {
  async doLoad(data: ExplosionlInterface, jsonItem: JsonItem, jsonObject: object): Promise<void> {
    await this.parseJson(data, jsonObject as Record<string, unknown>, jsonItem);
  }

  toView(): VNode[] {
    const result = new Array<VNode>();
    const data = this.data;

    result.push(
      h(MyField, { label: 'power' }, () => h(MyText, { content: data.power })),
      h(MyField, { label: 'distanceFactor' }, () => h(MyText, { content: data.distanceFactor })),
      h(MyField, { label: 'maxNoise' }, () => h(MyText, { content: data.maxNoise })),
      h(MyField, { label: 'fire' }, () => h(MyText, { content: data.fire }))
    );

    if (data.shrapnel) {
      result.push(h(MyField, { label: 'shrapnel', dl: true }, () => data.shrapnel?.toView()));
    }

    return result;
  }

  validateValue(jsonItem: JsonItem, jsonObject?: object): boolean {
    return jsonObject !== undefined;
  }

  private async parseJson(data: ExplosionlInterface, jsonObject: Record<string, unknown>, jsonItem: JsonItem) {
    data.power = getNumber(jsonObject, 'power');
    data.distanceFactor = getNumber(jsonObject, 'distance_factor', 0.75);
    data.maxNoise = getNumber(jsonObject, 'max_noise ', 90000000);
    data.fire = getBoolean(jsonObject, 'fire');
    if (jsonObject.hasOwnProperty('shrapnel')) {
      const temp = jsonObject.shrapnel;
      if (typeof temp === 'number') {
        data.shrapnel = new Shrapnel();
        await data.shrapnel.load(jsonItem, { casing_mass: temp });
      } else {
        data.shrapnel = new Shrapnel();
        await data.shrapnel.load(jsonItem, temp as object);
      }
    }
  }
}

interface ExplosionlInterface {
  power: number;
  distanceFactor: number;
  maxNoise: number;
  fire: boolean;
  shrapnel?: Shrapnel;
}
