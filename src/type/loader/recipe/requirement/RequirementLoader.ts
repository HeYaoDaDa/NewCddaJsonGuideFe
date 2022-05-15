import MyCard from 'src/components/cddaItemLoader/MyCard.vue';
import RequirementFieldSet from 'src/components/loaderView/card/recipe/RequirementFieldSet.vue';
import { CddaType } from 'src/constant/cddaType';
import { JsonItem } from 'src/type/common/baseType';
import { CddaItemRef } from 'src/type/common/CddaItemRef';
import { getArray } from 'src/util/baseJsonUtil';
import { cloneObject } from 'src/util/cloneObject';
import { arrayIsNotEmpty, toArray } from 'src/util/commonUtil';
import { h, VNode } from 'vue';
import { SuperLoader } from '../../baseLoader/SuperLoader';
import { ItemComponent } from './ItemComponentLoader';
import { RequirementQualitie } from './RequirementQualitieLoader';
import { ToolComponent } from './ToolComponentLoader';

export class Requirement extends SuperLoader<RequirementInterface> {
  doToView(result: VNode[]): void {
    const fieldSet = h(RequirementFieldSet, { cddaData: this });
    if (this.jsonObject) {
      result.push(fieldSet);
    } else {
      result.push(h(MyCard, { label: 'requirement' }, () => fieldSet));
    }
  }

  doLoad(data: RequirementInterface, jsonItem: JsonItem, jsonObject?: object): void {
    this.parseJson(data, (jsonObject ? jsonObject : jsonItem.content) as Record<string, unknown>, jsonItem);
  }

  validateValue(jsonItem: JsonItem, jsonObject?: object): boolean {
    return jsonItem.type === CddaType.requirement || jsonObject !== undefined;
  }

  private parseJson(data: RequirementInterface, jsonObject: Record<string, unknown>, jsonItem: JsonItem) {
    data.qualities = getArray(jsonObject, 'qualities').map((qualitieObjects) =>
      toArray(qualitieObjects).map((qualitieObject) => {
        const qualitie = new RequirementQualitie();
        qualitie.load(jsonItem, qualitieObject as object);
        return qualitie;
      })
    );

    data.tools = getArray(jsonObject, 'tools').map((toolObjects) =>
      toArray(toolObjects).map((toolObject) => {
        const tool = new ToolComponent();
        tool.load(jsonItem, toolObject as object);
        return tool;
      })
    );

    data.components = getArray(jsonObject, 'components').map((componentObjects) =>
      toArray(componentObjects).map((componentObject) => {
        const component = new ItemComponent();
        component.load(jsonItem, componentObject as object);
        return component;
      })
    );
  }
}

interface RequirementInterface {
  qualities: Array<Array<RequirementQualitie>>;
  tools: Array<Array<ToolComponent>>;
  components: Array<Array<ItemComponent>>;
}

export function normalizeRequirmentInterface(
  requirement: Requirement,
  multiplier?: number,
  usings?: { requirment: CddaItemRef; count: number }[]
): Requirement {
  const newRequirement = cloneObject(requirement);

  const myUsings: Array<{ requirment: CddaItemRef; count: number }> = usings ?? [];

  [newRequirement.data.tools, newRequirement.data.components].forEach((componentListList) => {
    componentListList.forEach((components) =>
      components.splice(
        0,
        components.length,
        ...components.filter((component) => {
          if (component.data.requirement) {
            myUsings.push({ requirment: component.data.name, count: component.data.count });
            return false;
          } else {
            return true;
          }
        })
      )
    );
    componentListList.splice(
      0,
      componentListList.length,
      ...componentListList.filter((tools) => arrayIsNotEmpty(tools))
    );
  });

  if (arrayIsNotEmpty(myUsings)) {
    const usingRequirments = myUsings.map((using) => {
      if (using.requirment !== undefined) {
        const requirmentJsonItems = using.requirment.getCddaItems();
        if (arrayIsNotEmpty(requirmentJsonItems)) {
          const usingRequirement = new Requirement();
          usingRequirement.load(requirmentJsonItems[0].jsonItem);
          return normalizeRequirmentInterface(usingRequirement, using.count);
        }
      } else {
        console.warn('wrong requirement', requirement);
      }
      return undefined;
    });

    usingRequirments.forEach((usingRequirment) => {
      if (usingRequirment) {
        usingRequirment.data.tools.forEach((tools) => newRequirement.data.tools.push(tools));
        usingRequirment.data.components.forEach((components) => newRequirement.data.components.push(components));
      }
    });
  }

  return requirmentMultiplier(newRequirement, multiplier ?? 1);
}

function requirmentMultiplier(requirement: Requirement, multiplier: number) {
  if (multiplier > 1) {
    requirement.data.tools.forEach((tools) => tools.forEach((tool) => (tool.data.count *= multiplier)));
    requirement.data.components.forEach((components) =>
      components.forEach((component) => (component.data.count *= multiplier))
    );
  }
  return requirement;
}
