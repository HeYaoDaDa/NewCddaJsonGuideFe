import RecipeCard from 'src/components/loaderView/card/recipe/RecipeCard.vue';
import { CddaType } from 'src/constant/cddaType';
import { AsyncId } from 'src/type/common/AsyncId';
import { JsonItem } from 'src/type/common/baseType';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { commonUpdateName } from 'src/util/asyncUpdateName';
import { getBoolean, getNumber, getString } from 'src/util/baseJsonUtil';
import { getAsyncId, getOptionalAsyncId } from 'src/util/jsonUtil';
import { h, VNode } from 'vue';
import { RecipeProficiency } from './RecipeProficiencyLoader';
import {
  parseAutoLearn,
  parseBatch,
  parseBookLearn,
  parseByproducts,
  parseDecompLearn,
  parseProficiencies,
  parseRequirement,
  parseSkillRequire,
  parseTime,
  parseUsings,
} from './RecipeService';
import { normalizeRequirmentInterface, Requirement } from './requirement/RequirementLoader';

export class Recipe extends SuperLoader<RecipeInterface> {
  async doLoad(data: RecipeInterface, jsonItem: JsonItem): Promise<void> {
    await this.parseJson(data, jsonItem.content as Record<string, unknown>, jsonItem);
    data.normalRequirement = await normalizeRequirmentInterface(data.requirement, 1, data.usings);
  }

  toView(): VNode[] {
    const result = new Array<VNode>();

    if (this.isLoad && this.jsonItem) {
      result.push(h(RecipeCard, { cddaData: this }));
    }

    return result;
  }

  validateValue(jsonItem: JsonItem): boolean {
    return jsonItem.type === CddaType.recipe;
  }

  private async parseJson(data: RecipeInterface, jsonObject: Record<string, unknown>, jsonItem: JsonItem) {
    data.obsolete = getBoolean(jsonObject, 'obsolete');
    data.time = parseTime(jsonObject);
    data.difficulty = getNumber(jsonObject, 'difficulty');
    data.activity = getString(jsonObject, 'activity_level');
    data.neverLearn = getBoolean(jsonObject, 'never_learn');
    const batchTuple = parseBatch(jsonObject);
    data.batchScale = batchTuple[0];
    data.batchSize = batchTuple[1];

    const asyncPromises = new Array<Promise<unknown>>();
    asyncPromises.push(
      (async () => (data.result = await getOptionalAsyncId(jsonObject, 'result', CddaType.item, commonUpdateName)))(),
      (async () => (data.byproducts = await parseByproducts(jsonObject)))(),
      (async () => (data.skillRequire = await parseSkillRequire(jsonObject)))(),
      (async () => (data.bookLearn = await parseBookLearn(jsonObject)))(),
      (async () => (data.proficiencies = await parseProficiencies(jsonObject, jsonItem)))(),
      (async () => (data.requirement = await parseRequirement(jsonObject, jsonItem)))(),
      (async () => (data.usings = await parseUsings(jsonObject)))(),
      (async () => (data.bookLearn = await parseBookLearn(jsonObject)))(),
      (async () => {
        data.skillUse = await getAsyncId(jsonObject, 'skill_used', CddaType.skill, commonUpdateName);
        await Promise.all([
          (async () => (data.autolearnRequire = await parseAutoLearn(jsonObject, data.skillUse, data.difficulty)))(),
          (async () => (data.decompLearn = await parseDecompLearn(jsonObject, data.skillUse)))(),
        ]);
      })()
    );
    await Promise.allSettled(asyncPromises);
  }
}

interface RecipeInterface {
  result?: AsyncId;
  byproducts: [AsyncId, number][];
  time: number;
  skillUse: AsyncId;
  difficulty: number;
  skillRequire: [AsyncId, number][];

  activity: string;

  neverLearn: boolean;
  autolearnRequire: [AsyncId, number][];
  decompLearn: [AsyncId, number][];
  bookLearn: { book: AsyncId; level: number; name: string | undefined; hidden: boolean }[];

  proficiencies: RecipeProficiency[];
  requirement: Requirement;
  usings: { requirment: AsyncId; count: number }[];
  obsolete: boolean;
  flags: AsyncId[];

  //automatically set contained if we specify as container
  contained: boolean;
  sealed: boolean;
  container: AsyncId;

  batchScale: number;
  batchSize: number;

  charges: number;
  resultMult: number;

  normalRequirement: Requirement;
}
