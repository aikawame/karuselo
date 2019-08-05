import { VueConstructor, PluginObject } from 'vue'
import Carousel from './components/Carousel.vue'
import Slide from './components/Slide.vue'

declare global {
  interface Window {
    Vue: VueConstructor
  }
}

const version = '__VERSION__'

const install = (Vue: VueConstructor): void => {
  /*
   * NOTE:
   *   if you need to extend Vue contstructor, you can extend it in here.
   */

  Vue.component('carousel', Carousel)
  Vue.component('slide', Slide)

  /*
   * NOTE:
   *  somthing implementation here ...
   */
}

const plugin: PluginObject<VueConstructor> = {
  install,
  version
}
export default plugin

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}
