import JsonCard from 'src/components/loaderView/card/common/JsonCard.vue';
import { JsonItem } from 'src/type/common/baseType';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { h, VNode } from 'vue';

export class Dummy extends SuperLoader<object> {
  jsonItem?: JsonItem;
  async load(value: JsonItem): Promise<void> {
    if (this.isLoad || !this.validateValue(value)) return;
    console.debug('start load %s', this.constructor.name);
    this.isLoad = true;
    this.jsonItem = value;
  }

  toView(): VNode[] {
    const result = new Array<VNode>();

    if (this.isLoad && this.jsonItem) {
      result.push(h(JsonCard, { jsonItem: this.jsonItem }));
    }

    return result;
  }
}
