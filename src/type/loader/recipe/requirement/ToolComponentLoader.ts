import MyText from 'src/components/cddaItemLoader/MyText/MyText.vue';
import MyTextAsyncId from 'src/components/cddaItemLoader/MyText/MyTextAsyncId.vue';
import { h, VNode } from 'vue';
import { AbstractComponent } from './AbstractComponentLoader';

export class ToolComponent extends AbstractComponent {
  toView() {
    const vNodes = new Array<VNode>();
    const data = this.data;

    if (data.requirement) {
      return vNodes;
    }

    vNodes.push(
      h(MyTextAsyncId, {
        content: data,
      }),
      h(MyText, {
        content: ` x ${data.count}`,
      })
    );

    return vNodes;
  }
}
