import RecipeCard from 'src/components/loaderView/card/recipe/RecipeCard.vue';
import { CddaType } from 'src/constant/cddaType';
import { AsyncId } from 'src/type/common/AsyncId';
import { JsonItem } from 'src/type/common/baseType';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { commonUpdateName } from 'src/util/asyncUpdateName';
import {
  getArray,
  getBoolean,
  getNumber,
  getOptionalArray,
  getOptionalUnknown,
  getString,
} from 'src/util/baseJsonUtil';
import { arrayIsNotEmpty } from 'src/util/commonUtil';
import { getAsyncId, getOptionalAsyncId, getTime } from 'src/util/jsonUtil';
import { h, VNode } from 'vue';
import { RecipeProficiency } from './RecipeProficiencyLoader';
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
    const asyncPromises = new Array<Promise<unknown>>();

    asyncPromises.push(
      (async () => (data.result = await getOptionalAsyncId(jsonObject, 'result', CddaType.item, commonUpdateName)))()
    );
    data.obsolete = getBoolean(jsonObject, 'obsolete');
    if (data.obsolete)
      asyncPromises.push(
        (async () =>
          (data.byproducts = await Promise.all(
            getArray(jsonObject, 'byproducts').map(async (byproduct) => {
              const temp = <[string, number | undefined]>byproduct;
              return [await AsyncId.new(temp[0], CddaType.item, commonUpdateName), temp[1] ?? 1];
            })
          )))()
      );
    parseTime();

    asyncPromises.push(
      (async () => {
        data.skillUse = await getAsyncId(jsonObject, 'skill_used', CddaType.skill, commonUpdateName);
        void parseAutoLearn();
        void parseDecompLearn();
      })()
    );
    data.difficulty = getNumber(jsonObject, 'difficulty');
    asyncPromises.push(parseSkillRequire());
    data.activity = getString(jsonObject, 'activity_level');
    data.neverLearn = getBoolean(jsonObject, 'never_learn');
    parseBookLearn();

    parseBatch();

    asyncPromises.push(parseProficiencies());
    asyncPromises.push(parseRequirement());
    asyncPromises.push(parseUsings());

    await Promise.allSettled(asyncPromises);

    function parseTime() {
      const temp = getOptionalUnknown(jsonObject, 'time');
      if (temp && typeof temp === 'number') {
        data.time = Math.round(temp * 0.01);
      } else {
        data.time = getTime(jsonObject, 'time');
      }
    }
    async function parseSkillRequire() {
      const temp = getArray(jsonObject, 'skills_required');
      if (arrayIsNotEmpty(temp)) {
        if (typeof temp[0] === 'object') {
          data.skillRequire = await Promise.all(
            temp.map(async (skill) => {
              const temp = <[string, number | undefined]>skill;
              return [await AsyncId.new(temp[0], CddaType.skill, commonUpdateName), temp[1] ?? 0];
            })
          );
        } else {
          data.skillRequire = await Promise.all(
            [temp].map(async (skill) => {
              const temp = <[string, number | undefined]>skill;
              return [await AsyncId.new(temp[0], CddaType.skill, commonUpdateName), temp[1] ?? 0];
            })
          );
        }
      } else {
        data.skillRequire = [];
      }
    }
    // after skillUse and difficulty
    async function parseAutoLearn() {
      const temp = getOptionalUnknown(jsonObject, 'autolearn');
      data.autolearnRequire = [];
      if (temp) {
        if (typeof temp === 'boolean') {
          if (temp) {
            data.autolearnRequire.push([data.skillUse, data.difficulty]);
          }
        } else {
          const learnJsons = temp as [string, number][];
          data.autolearnRequire = await Promise.all(
            learnJsons.map(async (learnJson) => [await AsyncId.new(learnJson[0], CddaType.skill), learnJson[1]])
          );
        }
      }
    }
    // after skillUse
    async function parseDecompLearn() {
      const temp = getOptionalUnknown(jsonObject, 'decomp_learn');
      data.decompLearn = [];
      if (temp) {
        if (typeof temp === 'number') {
          data.decompLearn.push([data.skillUse, temp]);
        } else {
          const learnJsons = temp as [string, number][];
          data.decompLearn = await Promise.all(
            learnJsons.map(async (learnJson) => [await AsyncId.new(learnJson[0], CddaType.skill), learnJson[1]])
          );
        }
      }
    }
    function parseBatch() {
      const batchTuple = getOptionalUnknown(jsonObject, 'batch_time_factors') as undefined | [number, number];
      if (batchTuple) {
        data.batchScale = batchTuple[0];
        data.batchSize = batchTuple[1];
      } else {
        data.batchScale = 100;
        data.batchSize = 1;
      }
    }
    function parseBookLearn() {
      const bookLearnJson = getOptionalUnknown(jsonObject, 'book_learn') as
        | undefined
        | Map<string, BookLearnJson>
        | [string, number][];
      data.bookLearn = [];
      if (bookLearnJson !== undefined) {
        if (Array.isArray(bookLearnJson)) {
          bookLearnJson.forEach(async (bookLearnTuple) =>
            data.bookLearn.push({
              book: await AsyncId.new(bookLearnTuple[0], CddaType.item, commonUpdateName),
              level: bookLearnTuple[1],
              name: undefined,
              hidden: false,
            })
          );
        } else {
          bookLearnJson.forEach(async (bookLearnObject, bookId) =>
            data.bookLearn.push({
              book: await AsyncId.new(bookId, CddaType.item, commonUpdateName),
              level: bookLearnObject.skill_level,
              name: bookLearnObject.recipe_name,
              hidden: bookLearnObject.hidden ?? false,
            })
          );
        }
      }
    }
    async function parseProficiencies() {
      const proficiencies = getOptionalArray(jsonObject, 'proficiencies') as object[] | undefined;
      data.proficiencies = [];
      if (proficiencies && arrayIsNotEmpty(proficiencies)) {
        data.proficiencies = await Promise.all(
          proficiencies.map(async (proficiency) => {
            const result = new RecipeProficiency();
            await result.load(jsonItem, proficiency);
            return result;
          })
        );
      }
    }
    async function parseRequirement() {
      data.requirement = new Requirement();
      await data.requirement.load(jsonItem, jsonObject);
    }
    async function parseUsings() {
      data.usings = await Promise.all(
        getArray(jsonObject, 'using').map(async (usingObject) => {
          if (typeof usingObject === 'string') {
            return { requirment: await AsyncId.new(usingObject, CddaType.requirement), count: 1 };
          } else {
            const usingTuple = usingObject as [string, number];
            return { requirment: await AsyncId.new(usingTuple[0], CddaType.requirement), count: usingTuple[1] };
          }
        })
      );
    }
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

interface BookLearnJson {
  skill_level: number;
  recipe_name?: string;
  hidden?: boolean;
}
