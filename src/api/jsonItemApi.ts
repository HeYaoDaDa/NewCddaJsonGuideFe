import { api } from 'boot/axios';
import { API_VERSION, HOST } from 'src/constant/apiConstant';
import { useUserConfigStore } from 'src/stores/userConfig';
import { JsonItem, SearchResult } from 'src/type';

export async function getCurrentVersionAndLanguageAllJsonItems(
  language?: string,
  version?: string
): Promise<JsonItem[]> {
  const userConfig = useUserConfigStore();
  language = language ?? userConfig.language.value;
  version = version ?? userConfig.version._id;
  const response = await api.get(`${HOST}/${API_VERSION}/jsonItems/versions`, {
    params: {
      language,
      version,
    },
  });
  return response.data;
}

export async function getJsonItemsByItemType(
  itemType: string,
  pipeline?: object[],
  language?: string,
  version?: string,
  mods?: string[]
): Promise<JsonItem[]> {
  const userConfig = useUserConfigStore();
  language = language ?? userConfig.language.value;
  version = version ?? userConfig.version._id;
  mods = mods ?? userConfig.mods.map((mod) => mod.data.id);
  const response = await api.get(`${HOST}/${API_VERSION}/jsonItems/${itemType}`, {
    params: {
      pipeline: pipeline ? JSON.stringify(pipeline) : '',
      language,
      version,
      mods: mods ? JSON.stringify(mods) : '',
    },
  });
  return response.data;
}

export async function getJsonItemListByJsonId(
  itemType: string,
  jsonId: string,
  language?: string,
  version?: string,
  mods?: string[]
): Promise<JsonItem[]> {
  const userConfig = useUserConfigStore();
  language = language ?? userConfig.language.value;
  version = version ?? userConfig.version._id;
  mods = mods ?? userConfig.mods.map((mod) => mod.data.id);
  const response = await api.get(`${HOST}/${API_VERSION}/jsonItems/${itemType}/${jsonId}`, {
    params: { language, version, mods: JSON.stringify(mods) },
  });
  return response.data;
}

export async function searchJsonItem(
  name: string,
  category: string,
  language?: string,
  version?: string,
  mods?: string[]
): Promise<SearchResult[]> {
  const userConfig = useUserConfigStore();
  language = language ?? userConfig.language.value;
  version = version ?? userConfig.version._id;
  mods = mods ?? userConfig.mods.map((mod) => mod.data.id);
  const response = await api.get(`${HOST}/${API_VERSION}/jsonItems/search`, {
    params: { name, category, language, version, mods: JSON.stringify(mods) },
  });
  return response.data;
}
