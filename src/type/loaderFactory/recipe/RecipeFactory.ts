import { CddaType } from 'src/constant/cddaType';
import { CddaItem } from 'src/type/common/CddaItem';
import { Recipe } from 'src/type/loader/recipe/RecipeLoader';
import { SuperFactory } from '../SuperFactory';

export class RecipeFactory extends SuperFactory {
  loaders = [new Recipe()];

  validate(cdddaItem: CddaItem): boolean {
    return cdddaItem.jsonItem.type === CddaType.recipe;
  }
}
