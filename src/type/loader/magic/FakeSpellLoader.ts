import FakeSpellFieldSet from 'src/components/loaderView/card/magic/FakeSpellFieldSet.vue';
import { CddaType } from 'src/constant/cddaType';
import { JsonItem } from 'src/type/common/baseType';
import { CddaItemRef } from 'src/type/common/CddaItemRef';
import { getBoolean, getNumber, getOptionalNumber, getOptionalString } from 'src/util/baseJsonUtil';
import { getCddaItemRef } from 'src/util/jsonUtil';
import { commonUpdateName } from 'src/util/updateNameUtil';
import { h, VNode } from 'vue';
import { SuperLoader } from '../baseLoader/SuperLoader';

export class FakeSpell extends SuperLoader<FakeSpellInterface> {
  doLoad(data: FakeSpellInterface, jsonItem: JsonItem, jsonObject: object): void {
    this.parseJson(data, jsonObject as Record<string, unknown>, jsonItem);
  }

  doToView(result: VNode[]): void {
    result.push(h(FakeSpellFieldSet, { loader: this }));
  }

  validateValue(jsonItem: JsonItem, jsonObject: object): boolean {
    return jsonObject !== undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private parseJson(data: FakeSpellInterface, jsonObject: Record<string, unknown>, jsonItem: JsonItem) {
    data.spell = getCddaItemRef(jsonObject, 'id', CddaType.spell, commonUpdateName);
    data.hitSelf = getBoolean(jsonObject, 'hit_self');
    data.onceInChance = getNumber(jsonObject, 'once_in', 1);
    data.message = getOptionalString(jsonObject, 'message');
    data.npcMessage = getOptionalString(jsonObject, 'npc_message');
    data.minLevel = getNumber(jsonObject, 'min_level');
    data.maxLevel = getOptionalNumber(jsonObject, 'max_level');
  }
}

interface FakeSpellInterface {
  spell: CddaItemRef;
  hitSelf: boolean;
  onceInChance: number;
  message?: string;
  npcMessage?: string;

  minLevel: number;
  maxLevel?: number;
}
