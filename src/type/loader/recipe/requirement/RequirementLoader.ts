import MyCard from 'src/components/cddaItemLoader/MyCard.vue';
import RequirementFieldSet from 'src/components/loaderView/card/recipe/RequirementFieldSet.vue';
import { CddaType } from 'src/constant/cddaType';
import { JsonItem } from 'src/type/common/baseType';
import { getArray } from 'src/util/baseJsonUtil';
import { toArray } from 'src/util/commonUtil';
import { h, VNode } from 'vue';
import { SuperLoader } from '../../baseLoader/SuperLoader';
import { ItemComponent } from './ItemComponentLoader';
import { RequirementQualitie } from './RequirementQualitieLoader';
import { ToolComponent } from './ToolComponentLoader';

export class Requirement extends SuperLoader<RequirementInterface> {
  async doLoad(data: RequirementInterface, jsonItem: JsonItem, jsonObject?: object): Promise<void> {
    await this.parseJson(data, (jsonObject ? jsonObject : jsonItem.content) as Record<string, unknown>, jsonItem);
  }

  toView() {
    const vNodes = new Array<VNode>();

    const fieldSet = h(RequirementFieldSet, { cddaData: this });
    if (this.jsonObject) {
      vNodes.push(fieldSet);
    } else {
      vNodes.push(h(MyCard, { label: 'requirement' }, () => fieldSet));
    }

    return vNodes;
  }

  validateValue(jsonItem: JsonItem, jsonObject?: object): boolean {
    return jsonItem.type === CddaType.requirement || jsonObject !== undefined;
  }

  private async parseJson(data: RequirementInterface, jsonObject: Record<string, unknown>, jsonItem: JsonItem) {
    const asyncPromises = new Array<Promise<unknown>>();

    asyncPromises.push(
      (async () =>
        (data.qualities = await Promise.all(
          getArray(jsonObject, 'qualities').map(
            async (qualitieObjects) =>
              await Promise.all(
                toArray(qualitieObjects).map(async (qualitieObject) => {
                  const qualitie = new RequirementQualitie();
                  await qualitie.load(jsonItem, qualitieObject as object);
                  return qualitie;
                })
              )
          )
        )))()
    );

    asyncPromises.push(
      (async () =>
        (data.tools = await Promise.all(
          getArray(jsonObject, 'tools').map(
            async (toolObjects) =>
              await Promise.all(
                toArray(toolObjects).map(async (toolObject) => {
                  const tool = new ToolComponent();
                  await tool.load(jsonItem, toolObject as object);
                  return tool;
                })
              )
          )
        )))()
    );

    asyncPromises.push(
      (async () =>
        (data.components = await Promise.all(
          getArray(jsonObject, 'components').map(
            async (componentObjects) =>
              await Promise.all(
                toArray(componentObjects).map(async (componentObject) => {
                  const component = new ItemComponent();
                  await component.load(jsonItem, componentObject as object);
                  return component;
                })
              )
          )
        )))()
    );

    await Promise.allSettled(asyncPromises);
  }
}

interface RequirementInterface {
  qualities: Array<Array<RequirementQualitie>>;
  tools: Array<Array<ToolComponent>>;
  components: Array<Array<ItemComponent>>;
}
