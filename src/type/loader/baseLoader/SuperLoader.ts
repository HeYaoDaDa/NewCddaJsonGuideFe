import { reactive, VNode } from 'vue';
import { JsonItem, Version } from 'src/type/common/baseType';

export abstract class SuperLoader<T extends object> {
  data: T = reactive({}) as T;
  isLoad = false;
  jsonItem?: JsonItem;

  async load(value: JsonItem) {
    if (this.isLoad || !this.validateValue(value)) return;
    console.debug('<%s> start load (%s)(%s)(%s)', this.constructor.name, value.type, value.jsonId, value._id);
    this.isLoad = true;
    this.jsonItem = value;
    await this.doLoad(this.data, value.content as Record<string, unknown>, value);
  }

  abstract doLoad(data: T, jsonObject: Record<string, unknown>, jsonItem: JsonItem): Promise<void>;

  toView(): VNode[] {
    return [];
  }

  validateValue(value: JsonItem): boolean {
    return value !== undefined;
  }

  validateVersion(version: Version): boolean {
    return version !== undefined;
  }
}
