import JsonCard from 'src/components/loaderView/card/common/JsonCard.vue';
import { JsonItem } from 'src/type/common/baseType';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { h, VNode } from 'vue';

export class Dummy extends SuperLoader<object> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async doLoad(data: object, jsonItem: JsonItem): Promise<void> {
    return;
  }

  toView(): VNode[] {
    const result = new Array<VNode>();

    if (this.isLoad && this.jsonItem) {
      result.push(h(JsonCard, { jsonItem: this.jsonItem }));
    }

    return result;
  }
}
