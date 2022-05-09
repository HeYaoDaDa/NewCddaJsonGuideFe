import MaterialCard from 'src/components/loaderView/card/material/MaterialCard.vue';
import { BreathabilityRating } from 'src/constant/appConstant';
import { CddaType } from 'src/constant/cddaType';
import { AsyncId } from 'src/type/common/AsyncId';
import { JsonItem } from 'src/type/common/baseType';
import { Translation } from 'src/type/common/Translation';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { commonUpdateName } from 'src/util/asyncUpdateName';
import { getArray, getBoolean, getNumber, getOptionalNumber, getString } from 'src/util/baseJsonUtil';
import { arrayIsEmpty } from 'src/util/commonUtil';
import { getOptionalAsyncId, getTranslationString } from 'src/util/jsonUtil';
import { h, VNode } from 'vue';
import { Fuel } from './FuelLoader';
import { MaterialBurn } from './MaterialBurn';

export class Material extends SuperLoader<MaterialInterface> {
  async doLoad(data: MaterialInterface, jsonItem: JsonItem): Promise<void> {
    await this.parseJson(data, jsonItem.content as Record<string, unknown>, jsonItem);
  }

  toView(): VNode[] {
    const result = new Array<VNode>();

    if (this.isLoad && this.jsonItem) {
      result.push(h(MaterialCard, { cddaData: this }));
    }

    return result;
  }

  validateValue(jsonItem: JsonItem): boolean {
    return jsonItem.type === CddaType.material;
  }

  private async parseJson(data: MaterialInterface, jsonObject: Record<string, unknown>, jsonItem: JsonItem) {
    const asyncPromises = new Array<Promise<unknown>>();

    data.name = getTranslationString(jsonObject, 'name');

    data.bashResist = getNumber(jsonObject, 'bash_resist');
    data.cutResist = getNumber(jsonObject, 'cut_resist');
    data.bulletResist = getNumber(jsonObject, 'bullet_resist');
    data.acidResist = getNumber(jsonObject, 'acid_resist');
    data.elecResist = getNumber(jsonObject, 'elec_resist');
    data.fireResist = getNumber(jsonObject, 'fire_resist');
    data.chipResist = getNumber(jsonObject, 'chip_resist');

    data.density = getNumber(jsonObject, 'density', 1);
    data.sheetThickness = getNumber(jsonObject, 'sheet_thickness');
    data.windResist = getOptionalNumber(jsonObject, 'wind_resist');

    data.specificHeatSolid = getNumber(jsonObject, 'specific_heat_liquid', 4.186);
    data.specificTeatLiquid = getNumber(jsonObject, 'specific_heat_solid', 2.108);
    data.latentHeat = getNumber(jsonObject, 'latent_heat', 334);
    data.freezePoint = getNumber(jsonObject, 'freezing_point');

    data.breathability = new Translation(
      getString(jsonObject, 'breathability', BreathabilityRating.IMPERMEABLE.toString()),
      'breathabilityRating'
    );
    asyncPromises.push(
      (async () =>
        (data.salvagedInto = await getOptionalAsyncId(jsonObject, 'salvaged_into', CddaType.item, commonUpdateName)))()
    );
    asyncPromises.push(
      (async () =>
        (data.repairedWith = await getOptionalAsyncId(jsonObject, 'repaired_with', CddaType.item, commonUpdateName)))()
    );
    data.edible = getBoolean(jsonObject, 'edible');
    data.rotting = getBoolean(jsonObject, 'rotting');
    data.soft = getBoolean(jsonObject, 'soft');
    data.reinforces = getBoolean(jsonObject, 'reinforces');
    asyncPromises.push(
      (async () =>
        (data.vitamins = await Promise.all(
          getArray(jsonObject, 'vitamins').map(async (vitaminTulpe) => {
            const temp = vitaminTulpe as [string, number];
            const vitaminName = await AsyncId.new(temp[0], CddaType.vitamin, commonUpdateName);
            return [vitaminName, temp[1]];
          })
        )))()
    );
    asyncPromises.push(
      (async () => {
        data.burnData = await Promise.all(
          getArray(jsonObject, 'burn_data').map(async (burn_data) => {
            const materialBurn = new MaterialBurn();
            await materialBurn.load(jsonItem, burn_data as object);
            return materialBurn;
          })
        );
        if (arrayIsEmpty(data.burnData) && data.fireResist <= 0) {
          const materialBurn = new MaterialBurn();
          await materialBurn.load(jsonItem, { burn: 1 });
          data.burnData.push(materialBurn);
        }
      })()
    );
    if (jsonObject.hasOwnProperty('fuel_data')) {
      const fuel = new Fuel();
      fuel.load(jsonItem, <object>jsonObject.fuel_data);
      data.fuelData = fuel;
    }
    asyncPromises.push(
      (async () =>
        (data.burnProducts = await Promise.all(
          getArray(jsonObject, 'burn_products').map(async (burnProduct) => {
            const temp = burnProduct as [string, number];
            const burnProductName = await AsyncId.new(temp[0], CddaType.item, commonUpdateName);
            return [burnProductName, temp[1]];
          })
        )))()
    );

    await Promise.allSettled(asyncPromises);
  }
}

interface MaterialInterface {
  name: string;

  salvagedInto?: AsyncId;
  repairedWith?: AsyncId;

  bashResist: number;
  cutResist: number;
  bulletResist: number;
  acidResist: number;
  elecResist: number;
  fireResist: number;
  chipResist: number;

  density: number;
  breathability: Translation;
  windResist?: number;

  specificTeatLiquid: number;
  specificHeatSolid: number;
  latentHeat: number;

  freezePoint: number;
  edible: boolean;
  rotting: boolean;
  soft: boolean;
  reinforces: boolean;

  sheetThickness: number;
  vitamins: [AsyncId, number][];
  fuelData?: Fuel;
  burnData: MaterialBurn[];
  burnProducts: [AsyncId, number][];
}
