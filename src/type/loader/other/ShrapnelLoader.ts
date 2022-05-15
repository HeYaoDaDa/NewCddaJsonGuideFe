import MyField from 'src/components/cddaItemLoader/MyField.vue';
import MyText from 'src/components/cddaItemLoader/MyText/MyText.vue';
import MyTextAsyncId from 'src/components/cddaItemLoader/MyText/MyTextAsyncId.vue';
import { CddaType } from 'src/constant/cddaType';
import { JsonItem } from 'src/type/common/baseType';
import { CddaItemRef } from 'src/type/common/CddaItemRef';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { getNumber } from 'src/util/baseJsonUtil';
import { toArray } from 'src/util/commonUtil';
import { getOptionalCddaItemRef } from 'src/util/jsonUtil';
import { commonUpdateName } from 'src/util/updateNameUtil';
import { h, VNode } from 'vue';

export class Shrapnel extends SuperLoader<ShrapnelInterface> {
  doToView(result: VNode[], data: ShrapnelInterface): void {
    result.push(
      h(MyField, { label: 'casingMass' }, () => h(MyText, { content: data.casingMass })),
      h(MyField, { label: 'fragmentMass' }, () => h(MyText, { content: data.fragmentMass })),
      h(MyField, { label: 'recovery' }, () => h(MyText, { content: data.recovery }))
    );

    if (data.drop) {
      result.push(h(MyField, { label: 'casingMass' }, () => h(MyTextAsyncId, { content: toArray(data.drop) })));
    }
  }

  doLoad(data: ShrapnelInterface, jsonItem: JsonItem, jsonObject: object): void {
    this.parseJson(data, jsonObject as Record<string, unknown>);
  }

  validateValue(jsonItem: JsonItem, jsonObject?: object): boolean {
    return jsonObject !== undefined;
  }

  private parseJson(data: ShrapnelInterface, jsonObject: Record<string, unknown>) {
    data.casingMass = getNumber(jsonObject, 'casing_mass');
    data.fragmentMass = getNumber(jsonObject, 'fragment_mass', 0.08);
    data.recovery = getNumber(jsonObject, 'recovery');
    data.drop = getOptionalCddaItemRef(jsonObject, 'drop', CddaType.item, commonUpdateName);
  }
}

interface ShrapnelInterface {
  casingMass: number;
  fragmentMass: number;
  recovery: number;
  drop?: CddaItemRef;
}
