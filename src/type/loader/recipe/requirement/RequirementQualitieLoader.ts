import MyText from 'src/components/cddaItemLoader/MyText/MyText.vue';
import MyTextAsyncId from 'src/components/cddaItemLoader/MyText/MyTextAsyncId.vue';
import { CddaType } from 'src/constant/cddaType';
import { JsonItem } from 'src/type/common/baseType';
import { CddaItemRef } from 'src/type/common/CddaItemRef';
import { getNumber } from 'src/util/baseJsonUtil';
import { toArray } from 'src/util/commonUtil';
import { getCddaItemRef } from 'src/util/jsonUtil';
import { commonUpdateName } from 'src/util/updateNameUtil';
import { h, VNode } from 'vue';
import { SuperLoader } from '../../baseLoader/SuperLoader';

export class RequirementQualitie extends SuperLoader<RequirementQualitieInterface> {
  doToView(result: VNode[], data: RequirementQualitieInterface): void {
    result.push(
      h(MyTextAsyncId, {
        content: toArray(data.name),
      }),
      h(MyText, {
        content: `(${data.level}) x ${data.amount}`,
      })
    );
  }

  doLoad(data: RequirementQualitieInterface, jsonItem: JsonItem, jsonObject: object): void {
    this.parseJson(data, jsonObject as Record<string, unknown>);
  }

  validateValue(jsonItem: JsonItem, jsonObject?: object): boolean {
    return jsonObject !== undefined;
  }

  private parseJson(data: RequirementQualitieInterface, jsonObject: Record<string, unknown>) {
    data.name = getCddaItemRef(jsonObject, 'id', CddaType.quality, commonUpdateName);
    data.level = getNumber(jsonObject, 'levle', 1);
    data.amount = getNumber(jsonObject, 'amount', 1);
  }
}

interface RequirementQualitieInterface {
  name: CddaItemRef;
  level: number;
  amount: number;
}
