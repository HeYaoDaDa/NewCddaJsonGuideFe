import { CddaType } from 'src/constant/cddaType';
import { getCddaItemByTypeAndId } from 'src/util/cddaItemUtil';
import { stringIsNotEmpty } from 'src/util/commonUtil';
import { reactive } from 'vue';
import { RouteLocationRaw } from 'vue-router';
import { CddaItem } from './CddaItem';

export class AsyncId {
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

  static async new(id: string, type: string, asyncUpdateName?: (asyncId: AsyncId) => Promise<void>) {
    const self = new AsyncId();
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
    if (asyncUpdateName) {
      await asyncUpdateName(self);
    }
    return self;
  }

  public getName(): string {
    return stringIsNotEmpty(this.value.name) ? this.value.name : this.value.id;
  }

  async getCddaItems(): Promise<CddaItem[]> {
    return await getCddaItemByTypeAndId(this.type, this.value.id);
  }
}
