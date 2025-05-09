To register CustomHero block, add to src/index.js

import heroSVG from '@plone/volto/icons/hero.svg';
import { Edit as CustomHeroEdit, View as CustomHeroView } from './components/Blocks/CustomHero';

const applyConfig = (config) => {

  //CustomHero
  config.blocks.blocksConfig.customHero = {
    id: 'customHero',
    title: 'Hero Block',
    icon: heroSVG,
    group: 'common',
    view: CustomHeroView,
    edit: CustomHeroEdit,
    restricted: false,
    mostUsed: true,
    sidebarTab: 1,
  };

  return config;
};

export default applyConfig;