import MaterialCard from 'src/components/loaderView/card/material/MaterialCard.vue';
import { BreathabilityRating } from 'src/constant/appConstant';
import { CddaType } from 'src/constant/cddaType';
import { JsonItem } from 'src/type/common/baseType';
import { CddaItemRef } from 'src/type/common/CddaItemRef';
import { Translation } from 'src/type/common/Translation';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { getArray, getBoolean, getNumber, getOptionalNumber, getString } from 'src/util/baseJsonUtil';
import { arrayIsEmpty } from 'src/util/commonUtil';
import { getOptionalCddaItemRef, getTranslationString } from 'src/util/jsonUtil';
import { commonUpdateName } from 'src/util/updateNameUtil';
import { h, VNode } from 'vue';
import { Fuel } from './FuelLoader';
import { MaterialBurn } from './MaterialBurn';

export class Material extends SuperLoader<MaterialInterface> {
  doToView(result: VNode[]): void {
    if (this.isLoad && this.jsonItem) {
      result.push(h(MaterialCard, { cddaData: this }));
    }
  }

  doLoad(data: MaterialInterface, jsonItem: JsonItem): void {
    this.parseJson(data, jsonItem.content as Record<string, unknown>, jsonItem);
  }

  validateValue(jsonItem: JsonItem): boolean {
    return jsonItem.type === CddaType.material;
  }

  public breathability(): number {
    return this.breathabilityToNumber(this.data.breathability.raw);
  }

  private breathabilityToNumber(str: string): number {
    for (const i in BreathabilityRating) {
      const isValueProperty = parseInt(i, 10) >= 0;
      if (!isValueProperty && str === i) {
        return parseInt(BreathabilityRating[i], 10) ?? 0;
      }
    }
    return 0;
  }

  private parseJson(data: MaterialInterface, jsonObject: Record<string, unknown>, jsonItem: JsonItem) {
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
    data.salvagedInto = getOptionalCddaItemRef(jsonObject, 'salvaged_into', CddaType.item, commonUpdateName);
    data.repairedWith = getOptionalCddaItemRef(jsonObject, 'repaired_with', CddaType.item, commonUpdateName);
    data.edible = getBoolean(jsonObject, 'edible');
    data.rotting = getBoolean(jsonObject, 'rotting');
    data.soft = getBoolean(jsonObject, 'soft');
    data.reinforces = getBoolean(jsonObject, 'reinforces');
    data.vitamins = getArray(jsonObject, 'vitamins').map((vitaminTulpe) => {
      const temp = vitaminTulpe as [string, number];
      const vitaminName = CddaItemRef.new(temp[0], CddaType.vitamin, commonUpdateName);
      return [vitaminName, temp[1]];
    });

    data.burnData = getArray(jsonObject, 'burn_data').map((burn_data) => {
      const materialBurn = new MaterialBurn();
      materialBurn.load(jsonItem, burn_data as object);
      return materialBurn;
    });
    if (arrayIsEmpty(data.burnData) && data.fireResist <= 0) {
      const materialBurn = new MaterialBurn();
      materialBurn.load(jsonItem, { burn: 1 });
      data.burnData.push(materialBurn);
    }

    if (jsonObject.hasOwnProperty('fuel_data')) {
      const fuel = new Fuel();
      fuel.load(jsonItem, <object>jsonObject.fuel_data);
      data.fuelData = fuel;
    }
    data.burnProducts = getArray(jsonObject, 'burn_products').map((burnProduct) => {
      const temp = burnProduct as [string, number];
      const burnProductName = CddaItemRef.new(temp[0], CddaType.item, commonUpdateName);
      return [burnProductName, temp[1]];
    });
  }
}

interface MaterialInterface {
  name: string;

  salvagedInto?: CddaItemRef;
  repairedWith?: CddaItemRef;

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
  vitamins: [CddaItemRef, number][];
  fuelData?: Fuel;
  burnData: MaterialBurn[];
  burnProducts: [CddaItemRef, number][];
}
