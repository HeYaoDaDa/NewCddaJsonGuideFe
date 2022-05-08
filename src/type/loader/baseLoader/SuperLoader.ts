import { reactive, VNode } from 'vue';
import { Version } from 'src/type/common/baseType';

export abstract class SuperLoader<T extends object> {
  data: T = reactive({}) as T;
  isLoad = false;

  abstract load(value: object): Promise<void>;

  toView(): VNode[] {
    return [];
  }

  validateValue(value: object): boolean {
    return value !== undefined;
  }

  validateVersion(version: Version): boolean {
    return version !== undefined;
  }
}
