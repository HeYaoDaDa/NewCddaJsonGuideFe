import { JsonItem, Version } from 'src/type/common/baseType';
import { reactive, VNode } from 'vue';

export abstract class SuperLoader<T extends object> {
  data: T = reactive({}) as T;
  isLoad = false;
  jsonItem?: JsonItem;
  jsonObject?: object;

  load(jsonItem: JsonItem, jsonObject?: object) {
    if (this.isLoad || !this.validateValue(jsonItem, jsonObject)) return;
    console.debug(
      '<%s> start load (%s)(%s)(%s)\n(%o)',
      this.constructor.name,
      jsonItem.type,
      jsonItem.jsonId,
      jsonItem._id,
      jsonObject
    );
    this.isLoad = true;
    this.jsonItem = jsonItem;
    this.jsonObject = jsonObject;
    this.doLoad(this.data, jsonItem, jsonObject);
  }

  abstract doLoad(data: T, jsonItem: JsonItem, jsonObject?: object): void;

  toView(): VNode[] {
    const result: Array<VNode> = reactive([]);
    const data = this.data;

    if (!this.isLoad) {
      console.debug(
        '<%s> call toView fail, because no load (%s)(%s)(%s)\n(%o)',
        this.constructor.name,
        this.jsonItem?.type,
        this.jsonItem?.jsonId,
        this.jsonItem?._id,
        this.jsonObject
      );
      return result;
    }
    this.doToView(result, data);

    return result;
  }

  abstract doToView(result: VNode[], data: T): void;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validateValue(jsonItem: JsonItem, jsonObject?: object): boolean {
    return jsonItem !== undefined;
  }

  validateVersion(version: Version): boolean {
    return version !== undefined;
  }
}
