import MyField from 'src/components/cddaItemLoader/MyField.vue';
import MyText from 'src/components/cddaItemLoader/MyText/MyText.vue';
import MyTextAsyncId from 'src/components/cddaItemLoader/MyText/MyTextAsyncId.vue';
import { CddaType } from 'src/constant/cddaType';
import { AsyncId } from 'src/type/common/AsyncId';
import { JsonItem } from 'src/type/common/baseType';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { commonUpdateName } from 'src/util/asyncUpdateName';
import { getNumber } from 'src/util/baseJsonUtil';
import { toArray } from 'src/util/commonUtil';
import { getOptionalAsyncId } from 'src/util/jsonUtil';
import { h, VNode } from 'vue';

export class Shrapnel extends SuperLoader<ShrapnelInterface> {
  async doLoad(data: ShrapnelInterface, jsonItem: JsonItem, jsonObject: object): Promise<void> {
    await this.parseJson(data, jsonObject as Record<string, unknown>);
  }

  toView(): VNode[] {
    const result = new Array<VNode>();
    const data = this.data;

    result.push(
      h(MyField, { label: 'casingMass' }, () => h(MyText, { content: data.casingMass })),
      h(MyField, { label: 'fragmentMass' }, () => h(MyText, { content: data.fragmentMass })),
      h(MyField, { label: 'recovery' }, () => h(MyText, { content: data.recovery }))
    );

    if (data.drop) {
      result.push(h(MyField, { label: 'casingMass' }, () => h(MyTextAsyncId, { content: toArray(data.drop) })));
    }

    return result;
  }

  validateValue(jsonItem: JsonItem, jsonObject?: object): boolean {
    return jsonObject !== undefined;
  }

  private async parseJson(data: ShrapnelInterface, jsonObject: Record<string, unknown>) {
    data.casingMass = getNumber(jsonObject, 'casing_mass');
    data.fragmentMass = getNumber(jsonObject, 'fragment_mass', 0.08);
    data.recovery = getNumber(jsonObject, 'recovery');
    data.drop = await getOptionalAsyncId(jsonObject, 'drop', CddaType.item, commonUpdateName);
  }
}

interface ShrapnelInterface {
  casingMass: number;
  fragmentMass: number;
  recovery: number;
  drop?: AsyncId;
}
