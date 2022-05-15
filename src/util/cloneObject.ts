import { cloneDeepWith } from 'lodash';
import { CddaItemRef } from 'src/type/common/CddaItemRef';

export function cloneObject<T>(value: T): T {
  return cloneDeepWith(value, (value) => {
    if (value instanceof CddaItemRef) {
      return value;
    }
  }) as T;
}
