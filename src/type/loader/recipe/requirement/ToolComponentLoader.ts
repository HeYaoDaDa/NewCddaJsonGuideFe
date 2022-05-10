import MyText from 'src/components/cddaItemLoader/MyText/MyText.vue';
import MyTextAsyncId from 'src/components/cddaItemLoader/MyText/MyTextAsyncId.vue';
import { toArray } from 'src/util/commonUtil';
import { h, VNode } from 'vue';
import { AbstractComponent } from './AbstractComponentLoader';

export class ToolComponent extends AbstractComponent {
  toView() {
    const vNodes = new Array<VNode>();
    const data = this.data;

    if (data.requirement) {
      vNodes.push(
        h(MyText, {
          content: '<requirement>',
        })
      );
    }

    vNodes.push(
      h(MyTextAsyncId, {
        content: toArray(data.name),
      })
    );

    if (data.count > 0) {
      h(MyText, {
        content: ` x ${data.count}`,
      });
    }

    return vNodes;
  }
}
