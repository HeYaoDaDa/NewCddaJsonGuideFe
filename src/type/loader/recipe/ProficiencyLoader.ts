import ProficiencyCard from 'src/components/loaderView/card/recipe/ProficiencyCard.vue';
import { CddaType } from 'src/constant/cddaType';
import { AsyncId } from 'src/type/common/AsyncId';
import { JsonItem } from 'src/type/common/baseType';
import { Translation } from 'src/type/common/Translation';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { commonUpdateName } from 'src/util/asyncUpdateName';
import { getArray, getBoolean, getNumber, getOptionalUnknown } from 'src/util/baseJsonUtil';
import { toArray } from 'src/util/commonUtil';
import { getTime, getTranslationString } from 'src/util/jsonUtil';
import { h, VNode } from 'vue';

export class Proficiency extends SuperLoader<ProficiencyInterface> {
  async doLoad(data: ProficiencyInterface, jsonItem: JsonItem): Promise<void> {
    await this.parseJson(data, jsonItem.content as Record<string, unknown>);
  }

  toView(): VNode[] {
    const result = new Array<VNode>();

    if (this.isLoad && this.jsonItem) {
      result.push(h(ProficiencyCard, { cddaData: this }));
    }

    return result;
  }

  validateValue(jsonItem: JsonItem): boolean {
    return jsonItem.type === CddaType.proficiency;
  }

  private async parseJson(data: ProficiencyInterface, jsonObject: Record<string, unknown>) {
    const asyncPromises = new Array<Promise<unknown>>();

    data.name = getTranslationString(jsonObject, 'name');
    data.description = getTranslationString(jsonObject, 'description');

    data.canLearn = getBoolean(jsonObject, 'can_learn');
    data.ignoreFocus = getBoolean(jsonObject, 'ignore_focus');

    data.defaultTimeMultiplier = getNumber(jsonObject, 'default_time_multiplier', 2);
    data.defaultFailMultiplier = getNumber(jsonObject, 'default_fail_multiplier', 2);

    data.defaultWeakpointBonus = getNumber(jsonObject, 'default_weakpoint_bonus');
    data.defaultWeakpointPenalty = getNumber(jsonObject, 'default_weakpoint_penalty');

    data.learnTime = getTime(jsonObject, 'time_to_learn', 9999 * 60 * 60);
    asyncPromises.push(
      (async () =>
        (data.required = await Promise.all(
          getArray(jsonObject, 'required_proficiencies').map(async (required) => {
            return await AsyncId.new(required as string, CddaType.proficiency, commonUpdateName);
          })
        )))()
    );

    data.bonuses = [];
    const bonusesObject = getOptionalUnknown(jsonObject, 'bonuses');
    if (bonusesObject) {
      const bonusesMap = bonusesObject as Record<
        string,
        { type: string; value: number } | Array<{ type: string; value: number }>
      >;
      for (const key in bonusesMap) {
        data.bonuses.push({
          key,
          bonuses: toArray(bonusesMap[key]).map((bonuse) => {
            return { type: new Translation(bonuse.type, 'proficiencyBonuseType'), value: bonuse.value };
          }),
        });
      }
    }

    await Promise.allSettled(asyncPromises);
  }
}

interface ProficiencyInterface {
  name: string;
  description: string;

  canLearn: boolean;
  ignoreFocus: boolean;

  defaultTimeMultiplier: number;
  defaultFailMultiplier: number;

  defaultWeakpointBonus: number;
  defaultWeakpointPenalty: number;

  learnTime: number;
  required: AsyncId[];

  bonuses: { key: string; bonuses: { type: Translation; value: number }[] }[];
}
