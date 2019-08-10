import { shallowMount } from '@vue/test-utils'
import Slide from '@/components/Slide.vue'

describe('Slide.vue', () => {
  it('is a Vue instance', () => {
    const wrapper = shallowMount(Slide)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
