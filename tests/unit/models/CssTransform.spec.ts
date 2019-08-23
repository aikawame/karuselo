import CssTransform from '@/models/CssTransform'

describe('CssTransform.ts', () => {
  describe('getTranslateX()', () => {
    it('should be get translateX', () => {
      let htmlElement = document.createElement('div')
      htmlElement.style.transform = 'translateX(100px)'
      expect(CssTransform.getTranslateX(htmlElement)).toBe('100px')
    })
  })

  describe('setTranslateX()', () => {
    it('should be set translateX', () => {
      let htmlElement = document.createElement('div')
      CssTransform.setTranslateX(htmlElement, '100px')
      expect(htmlElement.style.transform).toBe('translateX(100px)')
    })
  })
})
