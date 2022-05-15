import { CddaType } from 'src/constant/cddaType';
import { JsonItem } from 'src/type/common/baseType';
import { CddaItemRef } from 'src/type/common/CddaItemRef';
import { getArray, getOptionalArray, getOptionalUnknown } from 'src/util/baseJsonUtil';
import { arrayIsNotEmpty } from 'src/util/commonUtil';
import { getTime } from 'src/util/jsonUtil';
import { commonUpdateName } from 'src/util/updateNameUtil';
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

export function parseSkillRequire(jsonObject: Record<string, unknown>) {
  let skillRequire: [CddaItemRef, number][];
  const temp = getArray(jsonObject, 'skills_required');
  if (arrayIsNotEmpty(temp)) {
    if (typeof temp[0] === 'object') {
      skillRequire = temp.map((skill) => {
        const temp = <[string, number | undefined]>skill;
        return [CddaItemRef.new(temp[0], CddaType.skill, commonUpdateName), temp[1] ?? 0];
      });
    } else {
      skillRequire = [temp].map((skill) => {
        const temp = <[string, number | undefined]>skill;
        return [CddaItemRef.new(temp[0], CddaType.skill, commonUpdateName), temp[1] ?? 0];
      });
    }
  } else {
    skillRequire = [];
  }
  return skillRequire;
}

export function parseBookLearn(jsonObject: Record<string, unknown>) {
  const bookLearnJson = getOptionalUnknown(jsonObject, 'book_learn') as
    | undefined
    | Record<string, BookLearnJson>
    | [string, number | undefined][];
  const bookLearn: { book: CddaItemRef; level: number; name: string | undefined; hidden: boolean }[] = [];
  if (bookLearnJson !== undefined) {
    if (Array.isArray(bookLearnJson)) {
      bookLearnJson.forEach((bookLearnTuple) =>
        bookLearn.push({
          book: CddaItemRef.new(bookLearnTuple[0], CddaType.item, commonUpdateName),
          level: bookLearnTuple[1] ?? -1,
          name: undefined,
          hidden: false,
        })
      );
    } else {
      for (const bookId in bookLearnJson) {
        const bookLearnObject = bookLearnJson[bookId];
        bookLearn.push({
          book: CddaItemRef.new(bookId, CddaType.item, commonUpdateName),
          level: bookLearnObject.skill_level,
          name: bookLearnObject.recipe_name,
          hidden: bookLearnObject.hidden ?? false,
        });
      }
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
export function parseAutoLearn(jsonObject: Record<string, unknown>, skillUse: CddaItemRef, difficulty: number) {
  const temp = getOptionalUnknown(jsonObject, 'autolearn');
  let autolearnRequire: [CddaItemRef, number][] = [];
  if (temp) {
    if (typeof temp === 'boolean') {
      if (temp) {
        autolearnRequire.push([skillUse, difficulty]);
      }
    } else {
      const learnJsons = temp as [string, number][];
      autolearnRequire = learnJsons.map((learnJson) => [CddaItemRef.new(learnJson[0], CddaType.skill), learnJson[1]]);
    }
  }
  return autolearnRequire;
}

// after skillUse
export function parseDecompLearn(jsonObject: Record<string, unknown>, skillUse: CddaItemRef) {
  const temp = getOptionalUnknown(jsonObject, 'decomp_learn');
  let decompLearn: [CddaItemRef, number][] = [];
  if (temp) {
    if (typeof temp === 'number') {
      decompLearn.push([skillUse, temp]);
    } else {
      const learnJsons = temp as [string, number][];
      decompLearn = learnJsons.map((learnJson) => [CddaItemRef.new(learnJson[0], CddaType.skill), learnJson[1]]);
    }
  }
  return decompLearn;
}

export function parseProficiencies(jsonObject: Record<string, unknown>, jsonItem: JsonItem) {
  const proficiencies = getOptionalArray(jsonObject, 'proficiencies') as object[] | undefined;
  let result: RecipeProficiency[] = [];
  if (proficiencies && arrayIsNotEmpty(proficiencies)) {
    result = proficiencies.map((proficiency) => {
      const result = new RecipeProficiency();
      result.load(jsonItem, proficiency);
      return result;
    });
  }
  return result;
}

export function parseRequirement(jsonObject: Record<string, unknown>, jsonItem: JsonItem) {
  const requirement = new Requirement();
  requirement.load(jsonItem, jsonObject);
  return requirement;
}

export function parseUsings(jsonObject: Record<string, unknown>) {
  return getArray(jsonObject, 'using').map((usingObject) => {
    if (typeof usingObject === 'string') {
      return { requirment: CddaItemRef.new(usingObject, CddaType.requirement), count: 1 };
    } else {
      const usingTuple = usingObject as [string, number];
      return { requirment: CddaItemRef.new(usingTuple[0], CddaType.requirement), count: usingTuple[1] };
    }
  });
}

export function parseByproducts(jsonObject: Record<string, unknown>): [CddaItemRef, number][] {
  return getArray(jsonObject, 'byproducts').map((byproduct) => {
    const temp = <[string, number | undefined]>byproduct;
    return [CddaItemRef.new(temp[0], CddaType.item, commonUpdateName), temp[1] ?? 1];
  });
}
