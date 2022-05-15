import MyText from 'src/components/cddaItemLoader/MyText/MyText.vue';
import MyTextAsyncId from 'src/components/cddaItemLoader/MyText/MyTextAsyncId.vue';
import { toArray } from 'src/util/commonUtil';
import { h, VNode } from 'vue';
import { AbstractComponent, AbstractComponentInterface } from './AbstractComponentLoader';

export class ToolComponent extends AbstractComponent {
  doToView(result: VNode[], data: AbstractComponentInterface): void {
    if (data.requirement) {
      result.push(
        h(MyText, {
          content: '<requirement>',
        })
      );
    }

    result.push(
      h(MyTextAsyncId, {
        content: toArray(data.name),
      })
    );

    if (data.count > 0) {
      result.push(
        h(MyText, {
          content: ` x ${data.count}`,
        })
      );
    }
  }
}
