import { reactive, VNode } from 'vue';
import { JsonItem, Version } from 'src/type/common/baseType';

export abstract class SuperLoader<T extends object> {
  data: T = reactive({}) as T;
  isLoad = false;
  jsonItem?: JsonItem;
  jsonObject?: object;

  async load(jsonItem: JsonItem, jsonObject?: object) {
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
    await this.doLoad(this.data, jsonItem, jsonObject);
  }

  abstract doLoad(data: T, jsonItem: JsonItem, jsonObject?: object): Promise<void>;

  toView(): VNode[] {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validateValue(jsonItem: JsonItem, jsonObject?: object): boolean {
    return jsonItem !== undefined;
  }

  validateVersion(version: Version): boolean {
    return version !== undefined;
  }
}
