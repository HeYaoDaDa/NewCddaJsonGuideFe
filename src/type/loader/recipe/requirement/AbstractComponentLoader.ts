import MyText from 'src/components/cddaItemLoader/MyText/MyText.vue';
import MyTextAsyncId from 'src/components/cddaItemLoader/MyText/MyTextAsyncId.vue';
import { CddaType } from 'src/constant/cddaType';
import { AsyncId } from 'src/type/common/AsyncId';
import { JsonItem } from 'src/type/common/baseType';
import { commonUpdateName } from 'src/util/asyncUpdateName';
import { toArray } from 'src/util/commonUtil';
import { h, VNode } from 'vue';
import { SuperLoader } from '../../baseLoader/SuperLoader';

export abstract class AbstractComponent extends SuperLoader<AbstractComponentInterface> {
  async doLoad(data: AbstractComponentInterface, jsonItem: JsonItem, jsonObject: object): Promise<void> {
    await this.parseJson(data, jsonObject as [string, number, string | undefined]);
  }

  toView() {
    const vNodes = new Array<VNode>();
    const data = this.data;

    if (data.requirement) {
      vNodes.push(
        h(MyText, {
          content: '<requirement>',
        })
      );
    }

    vNodes.push(
      h(MyTextAsyncId, {
        content: toArray(data.name),
      }),
      h(MyText, {
        content: ` x ${data.count}`,
      })
    );
    if (data.noRecoverable) {
      vNodes.push(
        h(MyText, {
          content: `(${'no recover'})`,
        })
      );
    }
    return vNodes;
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
    data.name = await AsyncId.new(
      jsonObject[0],
      data.requirement ? CddaType.requirement : CddaType.item,
      data.requirement ? undefined : commonUpdateName
    );
  }
}

interface AbstractComponentInterface {
  name: AsyncId;
  count: number;
  noRecoverable: boolean;
  requirement: boolean;
}
