import { getJsonItemsByItemType } from 'src/api/jsonItemApi';
import { Mod } from 'src/type/loader/baseLoader/ModLoader';

export async function getModsOptions() {
  const response = await getJsonItemsByItemType(
    'mod_info',
    undefined,
    undefined,
    undefined,
    ['all']
  );
  return Promise.all(
    response.map(async (jsonItem) => {
      const mod = new Mod();
      await mod.load(jsonItem);
      return mod;
    })
  );
}
