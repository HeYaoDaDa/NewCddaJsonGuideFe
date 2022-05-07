import { api } from 'boot/axios';
import { apiVersion, host } from 'src/constant/apiConstant';
import { JsonItem, SearchResult } from 'src/type';

export async function getJsonItemsByItemType(
  itemType: string,
  pipeline?: object[],
  language?: string,
  version?: string,
  mods?: string[]
): Promise<JsonItem[]> {
  const response = await api.get(
    `${host}/${apiVersion}/jsonItems/${itemType}`,
    {
      params: {
        pipeline: pipeline ? JSON.stringify(pipeline) : '',
        language,
        version,
        mods: mods ? JSON.stringify(mods) : '',
      },
    }
  );
  return response.data;
}

export async function getJsonItemListByJsonId(
  itemType: string,
  jsonId: string,
  language?: string,
  version?: string,
  mods?: string[]
): Promise<JsonItem[]> {
  const response = await api.get(
    `${host}/${apiVersion}/jsonItems/${itemType}/${jsonId}`,
    {
      params: { language, version, mods },
    }
  );
  return response.data;
}

export async function searchJsonItem(
  name: string,
  category: string,
  language?: string,
  version?: string,
  mods?: string[]
): Promise<SearchResult[]> {
  const response = await api.get(`${host}/${apiVersion}/jsonItems/search`, {
    params: { name, category, language, version, mods },
  });
  return response.data;
}
