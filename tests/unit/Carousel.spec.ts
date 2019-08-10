import { shallowMount } from '@vue/test-utils'
import Carousel from '@/components/Carousel.vue'

describe('Carousel.vue', () => {
  it('is a Vue instance', () => {
    const wrapper = shallowMount(Carousel)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
