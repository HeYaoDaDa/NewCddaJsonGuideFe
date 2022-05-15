import RecipeCard from 'src/components/loaderView/card/recipe/RecipeCard.vue';
import { CddaType } from 'src/constant/cddaType';
import { JsonItem } from 'src/type/common/baseType';
import { CddaItemRef } from 'src/type/common/CddaItemRef';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { getBoolean, getNumber, getString } from 'src/util/baseJsonUtil';
import { getCddaItemRef, getOptionalCddaItemRef } from 'src/util/jsonUtil';
import { commonUpdateName } from 'src/util/updateNameUtil';
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
  doToView(result: VNode[]): void {
    if (this.isLoad && this.jsonItem) {
      result.push(h(RecipeCard, { cddaData: this }));
    }
  }

  doLoad(data: RecipeInterface, jsonItem: JsonItem): void {
    this.parseJson(data, jsonItem.content as Record<string, unknown>, jsonItem);
    data.normalRequirement = normalizeRequirmentInterface(data.requirement, 1, data.usings);
  }

  validateValue(jsonItem: JsonItem): boolean {
    return jsonItem.type === CddaType.recipe;
  }

  private parseJson(data: RecipeInterface, jsonObject: Record<string, unknown>, jsonItem: JsonItem) {
    data.obsolete = getBoolean(jsonObject, 'obsolete');
    data.difficulty = getNumber(jsonObject, 'difficulty');
    data.activity = getString(jsonObject, 'activity_level');
    data.neverLearn = getBoolean(jsonObject, 'never_learn');
    data.time = parseTime(jsonObject);
    const batchTuple = parseBatch(jsonObject);
    data.batchScale = batchTuple[0];
    data.batchSize = batchTuple[1];

    data.result = getOptionalCddaItemRef(jsonObject, 'result', CddaType.item, commonUpdateName);
    data.byproducts = parseByproducts(jsonObject);
    data.skillRequire = parseSkillRequire(jsonObject);
    data.bookLearn = parseBookLearn(jsonObject);
    data.proficiencies = parseProficiencies(jsonObject, jsonItem);
    data.requirement = parseRequirement(jsonObject, jsonItem);
    data.usings = parseUsings(jsonObject);
    data.bookLearn = parseBookLearn(jsonObject);
    data.skillUse = getCddaItemRef(jsonObject, 'skill_used', CddaType.skill, commonUpdateName);
    data.autolearnRequire = parseAutoLearn(jsonObject, data.skillUse, data.difficulty);
    data.decompLearn = parseDecompLearn(jsonObject, data.skillUse);
  }
}

interface RecipeInterface {
  result?: CddaItemRef;
  byproducts: [CddaItemRef, number][];
  time: number;
  skillUse: CddaItemRef;
  difficulty: number;
  skillRequire: [CddaItemRef, number][];

  activity: string;

  neverLearn: boolean;
  autolearnRequire: [CddaItemRef, number][];
  decompLearn: [CddaItemRef, number][];
  bookLearn: { book: CddaItemRef; level: number; name: string | undefined; hidden: boolean }[];

  proficiencies: RecipeProficiency[];
  requirement: Requirement;
  usings: { requirment: CddaItemRef; count: number }[];
  obsolete: boolean;
  flags: CddaItemRef[];

  //automatically set contained if we specify as container
  contained: boolean;
  sealed: boolean;
  container: CddaItemRef;

  batchScale: number;
  batchSize: number;

  charges: number;
  resultMult: number;

  normalRequirement: Requirement;
}
