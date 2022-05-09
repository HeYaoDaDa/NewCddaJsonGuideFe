import { JsonItem } from 'src/type/common/baseType';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { VNode } from 'vue';

export class Dummy extends SuperLoader<object> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async doLoad(data: object, jsonItem: JsonItem): Promise<void> {
    return;
  }

  toView(): VNode[] {
    const result = new Array<VNode>();

    return result;
  }
}
