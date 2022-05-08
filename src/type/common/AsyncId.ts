import { CddaType } from 'src/constant/cddaType';
import { getString } from 'src/util/baseJsonUtil';
import { getCddaItemByTypeAndId } from 'src/util/cddaItemUtil';
import { arrayIsEmpty, stringIsNotEmpty } from 'src/util/commonUtil';
import { getGetTextTransationString } from 'src/util/getTextUtil';
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

  static async new(
    id: string,
    type: string,
    asyncUpdateName?: (asyncId: AsyncId) => Promise<void>
  ) {
    const self = new AsyncId();
    self.value = reactive({ id: id, name: id });
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

  static async commonUpdateName(asyncId: AsyncId) {
    const cddaItems = await asyncId.getCddaItems();
    if (arrayIsEmpty(cddaItems)) return;
    const json = cddaItems[0].jsonItem.content;
    if ('name' in json)
      asyncId.value.name = getGetTextTransationString(
        getString(json as Record<string, unknown>, 'name')
      );
  }

  public getName(): string {
    return stringIsNotEmpty(this.value.name) ? this.value.name : this.value.id;
  }

  async getCddaItems(): Promise<CddaItem[]> {
    return await getCddaItemByTypeAndId(this.type, this.value.id);
  }
}
