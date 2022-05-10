import { CddaType } from 'src/constant/cddaType';
import { AsyncId } from 'src/type/common/AsyncId';
import { JsonItem } from 'src/type/common/baseType';
import { commonUpdateName } from 'src/util/asyncUpdateName';
import { getArray, getOptionalArray, getOptionalUnknown } from 'src/util/baseJsonUtil';
import { arrayIsNotEmpty } from 'src/util/commonUtil';
import { getTime } from 'src/util/jsonUtil';
import { RecipeProficiency } from './RecipeProficiencyLoader';
import { Requirement } from './requirement/RequirementLoader';

export function parseTime(jsonObject: Record<string, unknown>): number {
  const temp = getOptionalUnknown(jsonObject, 'time');
  if (temp && typeof temp === 'number') {
    return Math.round(temp * 0.01);
  } else {
    return getTime(jsonObject, 'time');
  }
}

export async function parseSkillRequire(jsonObject: Record<string, unknown>) {
  let skillRequire: [AsyncId, number][];
  const temp = getArray(jsonObject, 'skills_required');
  if (arrayIsNotEmpty(temp)) {
    if (typeof temp[0] === 'object') {
      skillRequire = await Promise.all(
        temp.map(async (skill) => {
          const temp = <[string, number | undefined]>skill;
          return [await AsyncId.new(temp[0], CddaType.skill, commonUpdateName), temp[1] ?? 0];
        })
      );
    } else {
      skillRequire = await Promise.all(
        [temp].map(async (skill) => {
          const temp = <[string, number | undefined]>skill;
          return [await AsyncId.new(temp[0], CddaType.skill, commonUpdateName), temp[1] ?? 0];
        })
      );
    }
  } else {
    skillRequire = [];
  }
  return skillRequire;
}

export async function parseBookLearn(jsonObject: Record<string, unknown>) {
  const bookLearnJson = getOptionalUnknown(jsonObject, 'book_learn') as
    | undefined
    | Map<string, BookLearnJson>
    | [string, number][];
  const bookLearn: { book: AsyncId; level: number; name: string | undefined; hidden: boolean }[] = [];
  if (bookLearnJson !== undefined) {
    if (Array.isArray(bookLearnJson)) {
      bookLearnJson.forEach(async (bookLearnTuple) =>
        bookLearn.push({
          book: await AsyncId.new(bookLearnTuple[0], CddaType.item, commonUpdateName),
          level: bookLearnTuple[1],
          name: undefined,
          hidden: false,
        })
      );
    } else {
      bookLearnJson.forEach(async (bookLearnObject, bookId) =>
        bookLearn.push({
          book: await AsyncId.new(bookId, CddaType.item, commonUpdateName),
          level: bookLearnObject.skill_level,
          name: bookLearnObject.recipe_name,
          hidden: bookLearnObject.hidden ?? false,
        })
      );
    }
  }
  return bookLearn;

  interface BookLearnJson {
    skill_level: number;
    recipe_name?: string;
    hidden?: boolean;
  }
}

export function parseBatch(jsonObject: Record<string, unknown>) {
  const batchTuple = getOptionalUnknown(jsonObject, 'batch_time_factors') as undefined | [number, number];
  if (batchTuple) {
    return batchTuple;
  } else {
    return [100, 1];
  }
}

// after skillUse and difficulty
export async function parseAutoLearn(jsonObject: Record<string, unknown>, skillUse: AsyncId, difficulty: number) {
  const temp = getOptionalUnknown(jsonObject, 'autolearn');
  let autolearnRequire: [AsyncId, number][] = [];
  if (temp) {
    if (typeof temp === 'boolean') {
      if (temp) {
        autolearnRequire.push([skillUse, difficulty]);
      }
    } else {
      const learnJsons = temp as [string, number][];
      autolearnRequire = await Promise.all(
        learnJsons.map(async (learnJson) => [await AsyncId.new(learnJson[0], CddaType.skill), learnJson[1]])
      );
    }
  }
  return autolearnRequire;
}

// after skillUse
export async function parseDecompLearn(jsonObject: Record<string, unknown>, skillUse: AsyncId) {
  const temp = getOptionalUnknown(jsonObject, 'decomp_learn');
  let decompLearn: [AsyncId, number][] = [];
  if (temp) {
    if (typeof temp === 'number') {
      decompLearn.push([skillUse, temp]);
    } else {
      const learnJsons = temp as [string, number][];
      decompLearn = await Promise.all(
        learnJsons.map(async (learnJson) => [await AsyncId.new(learnJson[0], CddaType.skill), learnJson[1]])
      );
    }
  }
  return decompLearn;
}

export async function parseProficiencies(jsonObject: Record<string, unknown>, jsonItem: JsonItem) {
  const proficiencies = getOptionalArray(jsonObject, 'proficiencies') as object[] | undefined;
  let result: RecipeProficiency[] = [];
  if (proficiencies && arrayIsNotEmpty(proficiencies)) {
    result = await Promise.all(
      proficiencies.map(async (proficiency) => {
        const result = new RecipeProficiency();
        await result.load(jsonItem, proficiency);
        return result;
      })
    );
  }
  return result;
}

export async function parseRequirement(jsonObject: Record<string, unknown>, jsonItem: JsonItem) {
  const requirement = new Requirement();
  await requirement.load(jsonItem, jsonObject);
  return requirement;
}

export async function parseUsings(jsonObject: Record<string, unknown>) {
  return await Promise.all(
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

export async function parseByproducts(jsonObject: Record<string, unknown>): Promise<[AsyncId, number][]> {
  return await Promise.all(
    getArray(jsonObject, 'byproducts').map(async (byproduct) => {
      const temp = <[string, number | undefined]>byproduct;
      return [await AsyncId.new(temp[0], CddaType.item, commonUpdateName), temp[1] ?? 1];
    })
  );
}
