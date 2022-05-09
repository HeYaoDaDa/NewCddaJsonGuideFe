import { i18n } from 'src/boot/i18n';
import MyText from 'src/components/cddaItemLoader/MyText/MyText.vue';
import MyTextAsyncId from 'src/components/cddaItemLoader/MyText/MyTextAsyncId.vue';
import { CddaType } from 'src/constant/cddaType';
import { AsyncId } from 'src/type/common/AsyncId';
import { JsonItem } from 'src/type/common/baseType';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { commonUpdateName } from 'src/util/asyncUpdateName';
import { getBoolean, getNumber } from 'src/util/baseJsonUtil';
import { arrayIsNotEmpty } from 'src/util/commonUtil';
import { timeToString } from 'src/util/dataUtil';
import { getAsyncId, getOptionalTime } from 'src/util/jsonUtil';
import { h, VNode } from 'vue';
import { Proficiency } from './ProficiencyLoader';

export class RecipeProficiency extends SuperLoader<RecipeProficiencyInterface> {
  async doLoad(data: RecipeProficiencyInterface, jsonItem: JsonItem, jsonObject: object): Promise<void> {
    await this.parseJson(data, jsonObject as Record<string, unknown>);
  }

  toView(): VNode[] {
    const result = new Array<VNode>();
    const data = this.data;

    result.push(h(MyTextAsyncId, { content: data.name }));
    if (data.timeMultiplier > 1) {
      result.push(
        h(MyText, {
          content: `(${data.timeMultiplier}x${i18n.global.t('label.time')})`,
        })
      );
    }
    if (data.failMultiplier > 1) {
      result.push(
        h(MyText, {
          content: `(${data.failMultiplier}x${i18n.global.t('label.fail')})`,
        })
      );
    }
    if (data.learnTimeMultiplier > 1) {
      result.push(
        h(MyText, {
          content: `(${data.learnTimeMultiplier}x${i18n.global.t('label.learningTime')})`,
        })
      );
    }
    if (data.maxExperience) {
      result.push(
        h(MyText, {
          content: `(${timeToString(data.maxExperience)} ${i18n.global.t('label.maxExperience')})`,
        })
      );
    }
    if (data.required) {
      result.push(
        h(MyText, {
          content: `(${i18n.global.t('label.required')})`,
        })
      );
    }

    return result;
  }

  validateValue(jsonItem: JsonItem, jsonObject: object): boolean {
    return jsonObject !== undefined;
  }

  private async parseJson(data: RecipeProficiencyInterface, jsonObject: Record<string, unknown>) {
    const asyncPromises = new Array<Promise<unknown>>();

    data.required = getBoolean(jsonObject, 'required');
    data.timeMultiplier = getNumber(jsonObject, 'time_multiplier');
    data.failMultiplier = getNumber(jsonObject, 'fail_multiplier');
    data.learnTimeMultiplier = getNumber(jsonObject, 'learning_time_multiplier', 1);
    data.maxExperience = getOptionalTime(jsonObject, 'max_experience');

    asyncPromises.push(
      (async () => (data.name = await getAsyncId(jsonObject, 'proficiency', CddaType.proficiency, commonUpdateName)))()
    );

    await Promise.allSettled(asyncPromises);

    if (data.timeMultiplier === 0 || data.failMultiplier === 0) {
      const cddaItems = await data.name.getCddaItems();
      if (arrayIsNotEmpty(cddaItems)) {
        const proficiency: Proficiency = (cddaItems[0].data as Proficiency) ?? new Proficiency();
        if (!proficiency.isLoad) await proficiency.load(cddaItems[0].jsonItem);
        if (data.timeMultiplier <= 0) {
          data.timeMultiplier = proficiency.data.defaultTimeMultiplier;
        }
        if (data.failMultiplier <= 0) {
          data.failMultiplier = proficiency.data.defaultFailMultiplier;
        }
      }
    }
  }
}

interface RecipeProficiencyInterface {
  name: AsyncId;

  required: boolean;

  timeMultiplier: number;
  failMultiplier: number;
  learnTimeMultiplier: number;

  maxExperience?: number;
}
