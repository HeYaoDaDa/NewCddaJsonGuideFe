import { getJsonItemsByItemType } from 'src/api/jsonItemApi';

export async function getModsOptions() {
  const response = await getJsonItemsByItemType(
    'mod_info',
    undefined,
    undefined,
    undefined,
    ['all']
  );
  return response.map((mod) => {
    const modJson = mod.content as {
      name: string;
      description: string;
      category: string;
    };
    return {
      id: mod.jsonId,
      name: modJson.name,
      description: modJson.description,
      category: modJson.category,
    };
  });
}
