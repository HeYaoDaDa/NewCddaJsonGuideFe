import JsonCard from 'src/components/loaderView/card/common/JsonCard.vue';
import { CddaItem } from 'src/type/common/CddaItem';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { h, reactive, VNode } from 'vue';

export async function loadCddaItems(cddaItems: CddaItem[]) {
  await Promise.all(cddaItems.map((cddaItem) => cddaItem.getData()));
}

export function viewCddaItems(loaders: (SuperLoader<object> | undefined)[]) {
  const cards = reactive(new Array<VNode>());
  loaders.forEach((loader) => {
    if (loader) {
      cards.push(...loader.toView(), h(JsonCard, { jsonItem: loader.jsonItem }));
    }
  });
  return cards;
}
