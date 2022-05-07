import { Version, JsonItem, SelectOption } from 'src/type/common/baseType';
import { SearchResult } from 'src/type/api/apiType';
export { Version, JsonItem, SelectOption, SearchResult };

export interface Mod {
  id: string;
  name: string;
  description: string;
  category: string;
}
