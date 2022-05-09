import { loaderFactorys } from 'src/constant/factoryConstant';
import { useCddaData } from 'src/stores/cddaData';
import { CddaItem } from 'src/type/common/CddaItem';
import { SuperLoader } from 'src/type/loader/baseLoader/SuperLoader';
import { reactive, VNode, h } from 'vue';
import JsonCard from 'src/components/loaderView/card/common/JsonCard.vue';

export async function loadCddaItems(cddaItems: CddaItem[]) {
  await Promise.allSettled(cddaItems.map((cddaItem) => loadCddaItem(cddaItem)));
}

async function loadCddaItem(cddaItem: CddaItem) {
  const loader = cddaItem.data ?? loaderFactorys.find((loaderFactory) => loaderFactory.validate(cddaItem))?.getLoader();
  if (loader) {
    await loader.load(cddaItem.jsonItem);
    if (!cddaItem.data) {
      const cddaData = useCddaData();
      cddaData.addLoaderByJsonItem(cddaItem.jsonItem, loader);
      cddaItem.data = loader;
    }
  }
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
