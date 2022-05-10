import MyText from 'src/components/cddaItemLoader/MyText/MyText.vue';
import MyTextAsyncId from 'src/components/cddaItemLoader/MyText/MyTextAsyncId.vue';
import { CddaType } from 'src/constant/cddaType';
import { AsyncId } from 'src/type/common/AsyncId';
import { JsonItem } from 'src/type/common/baseType';
import { commonUpdateName } from 'src/util/asyncUpdateName';
import { getNumber } from 'src/util/baseJsonUtil';
import { toArray } from 'src/util/commonUtil';
import { getAsyncId } from 'src/util/jsonUtil';
import { h, VNode } from 'vue';
import { SuperLoader } from '../../baseLoader/SuperLoader';

export class RequirementQualitie extends SuperLoader<RequirementQualitieInterface> {
  async doLoad(data: RequirementQualitieInterface, jsonItem: JsonItem, jsonObject: object): Promise<void> {
    await this.parseJson(data, jsonObject as Record<string, unknown>);
  }

  toView() {
    const vNodes = new Array<VNode>();
    const data = this.data;

    vNodes.push(
      h(MyTextAsyncId, {
        content: toArray(data.name),
      }),
      h(MyText, {
        content: `(${data.level}) x ${data.amount}`,
      })
    );

    return vNodes;
  }

  validateValue(jsonItem: JsonItem, jsonObject?: object): boolean {
    return jsonObject !== undefined;
  }

  private async parseJson(data: RequirementQualitieInterface, jsonObject: Record<string, unknown>) {
    data.name = await getAsyncId(jsonObject, 'id', CddaType.quality, commonUpdateName);
    data.level = getNumber(jsonObject, 'levle', 1);
    data.amount = getNumber(jsonObject, 'amount', 1);
  }
}

interface RequirementQualitieInterface {
  name: AsyncId;
  level: number;
  amount: number;
}
