import { CddaType } from 'src/constant/cddaType';
import { getCddaItemByTypeAndId } from 'src/util/cddaItemUtil';
import { stringIsNotEmpty } from 'src/util/commonUtil';
import { reactive } from 'vue';
import { RouteLocationRaw } from 'vue-router';
import { CddaItem } from './CddaItem';

export class CddaItemRef {
  value: { id: string; name: string };
  type: string;
  route: RouteLocationRaw;

  constructor() {
    this.value = reactive({ id: '', name: '' });
    this.type = CddaType.item;
    this.route = {
      name: 'jsonItem',
      params: {
        jsonType: this.type,
        jsonId: '',
      },
    };
  }

  static new(id: string, type: string, updateNameFunc?: (cddaItemRef: CddaItemRef) => void) {
    const self = new CddaItemRef();
    self.value.id = id;
    self.value.name = id;
    self.type = type;
    self.route = {
      name: 'jsonItem',
      params: {
        jsonType: type,
        jsonId: id,
      },
    };
    if (updateNameFunc) {
      updateNameFunc(self);
    }
    return self;
  }

  public getName(): string {
    return stringIsNotEmpty(this.value.name) ? this.value.name : this.value.id;
  }

  getCddaItems(): CddaItem[] {
    return getCddaItemByTypeAndId(this.type, this.value.id);
  }
}

export function generateCddaItemRefs(
  ids: string[],
  type: string,
  updateNameFunc?: (asyncId: CddaItemRef) => void
): CddaItemRef[] {
  const result: CddaItemRef[] = reactive([]);
  ids.map((id) => result.push(CddaItemRef.new(id, type, updateNameFunc)));
  return result;
}
