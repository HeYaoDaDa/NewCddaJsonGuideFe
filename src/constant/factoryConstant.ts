import { BodyFactory } from 'src/type/loaderFactory/bodyPart/BodyFactory';
import { SubBodyFactory } from 'src/type/loaderFactory/bodyPart/SubBodyFactory';
import { DummyFactory } from 'src/type/loaderFactory/DummyFactory';
import { BaseItemFactory } from 'src/type/loaderFactory/item/BaseItemFactory';
import { MaterialFactory } from 'src/type/loaderFactory/material/MaterialFactory';
import { ProficiencyFactory } from 'src/type/loaderFactory/recipe/ProficiencyFactory';
import { RecipeFactory } from 'src/type/loaderFactory/recipe/RecipeFactory';
import { RequirementFactory } from 'src/type/loaderFactory/recipe/RequirementFactory';
import { SuperFactory } from 'src/type/loaderFactory/SuperFactory';

export const loaderFactorys: SuperFactory[] = [
  new BaseItemFactory(),
  new RecipeFactory(),
  new SubBodyFactory(),
  new BodyFactory(),
  new MaterialFactory(),
  new RequirementFactory(),
  new ProficiencyFactory(),
  new DummyFactory(),
];
