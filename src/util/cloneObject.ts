import { cloneDeepWith } from 'lodash';
import { AsyncId } from 'src/type/common/AsyncId';

export function cloneObject<T>(value: T): T {
  return cloneDeepWith(value, (value) => {
    if (value instanceof AsyncId) {
      return value;
    }
  }) as T;
}
