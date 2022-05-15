import MyText from 'src/components/cddaItemLoader/MyText/MyText.vue';
import MyTextAsyncId from 'src/components/cddaItemLoader/MyText/MyTextAsyncId.vue';
import { CddaType } from 'src/constant/cddaType';
import { JsonItem } from 'src/type/common/baseType';
import { CddaItemRef } from 'src/type/common/CddaItemRef';
import { toArray } from 'src/util/commonUtil';
import { commonUpdateName } from 'src/util/updateNameUtil';
import { h, VNode } from 'vue';
import { SuperLoader } from '../../baseLoader/SuperLoader';

export abstract class AbstractComponent extends SuperLoader<AbstractComponentInterface> {
  async doLoad(data: AbstractComponentInterface, jsonItem: JsonItem, jsonObject: object): Promise<void> {
    await this.parseJson(data, jsonObject as [string, number, string | undefined]);
  }

  doToView(result: VNode[], data: AbstractComponentInterface): void {
    if (data.requirement) {
      result.push(
        h(MyText, {
          content: '<requirement>',
        })
      );
    }

    result.push(
      h(MyTextAsyncId, {
        content: toArray(data.name),
      }),
      h(MyText, {
        content: ` x ${data.count}`,
      })
    );
    if (data.noRecoverable) {
      result.push(
        h(MyText, {
          content: `(${'no recover'})`,
        })
      );
    }
  }

  validateValue(jsonItem: JsonItem, jsonObject?: object): boolean {
    return jsonObject !== undefined;
  }

  private async parseJson(data: AbstractComponentInterface, jsonObject: [string, number, string | undefined]) {
    data.count = jsonObject[1];
    const flag = jsonObject[2];
    if (flag) {
      data.requirement = flag.toLowerCase() === 'list';
      data.noRecoverable = flag.toLowerCase() === 'no_recover';
    } else {
      data.requirement = false;
      data.noRecoverable = false;
    }
    data.name = await CddaItemRef.new(
      jsonObject[0],
      data.requirement ? CddaType.requirement : CddaType.item,
      data.requirement ? undefined : commonUpdateName
    );
  }
}

export interface AbstractComponentInterface {
  name: CddaItemRef;
  count: number;
  noRecoverable: boolean;
  requirement: boolean;
}
