import Lazyload from '@/models/Lazyload'

describe('Lazyload.ts', () => {
  describe('execute()', () => {
    describe('when element is image', () => {
      it('should be lazyloaded', () => {
        let htmlElement = document.createElement('img')
        htmlElement.setAttribute('src', 'https://example.com/dummy-org.png')
        htmlElement.setAttribute('data-lazy', 'https://example.com/dummy-lazy.png')
        document.body.appendChild(htmlElement)
        const nodeList = document.querySelectorAll('img')
        Lazyload.execute(nodeList)
        expect(nodeList.item(0).getAttribute('src')).toBe('https://example.com/dummy-lazy.png')
        expect(nodeList.item(0).getAttribute('data-lazy')).toBeNull()
        document.body.removeChild(htmlElement)
      })

      it('should not be lazyloaded if data-lazy is not set', () => {
        let htmlElement = document.createElement('img')
        htmlElement.setAttribute('src', 'https://example.com/dummy-org.png')
        document.body.appendChild(htmlElement)
        const nodeList = document.querySelectorAll('img')
        Lazyload.execute(nodeList)
        expect(nodeList.item(0).getAttribute('src')).toBe('https://example.com/dummy-org.png')
        expect(nodeList.item(0).getAttribute('data-lazy')).toBeNull()
        document.body.removeChild(htmlElement)
      })
    })

    describe('when element is video', () => {
      it('should be lazyloaded', () => {
        let htmlElement = document.createElement('video')
        htmlElement.setAttribute('src', 'https://example.com/dummy-org.mp4')
        htmlElement.setAttribute('data-lazy', 'https://example.com/dummy-lazy.mp4')
        document.body.appendChild(htmlElement)
        const nodeList = document.querySelectorAll('video')
        Lazyload.execute(nodeList)
        expect(nodeList.item(0).getAttribute('src')).toBe('https://example.com/dummy-lazy.mp4')
        expect(nodeList.item(0).getAttribute('data-lazy')).toBeNull()
        document.body.removeChild(htmlElement)
      })

      it('should not be lazyloaded if data-lazy is not set', () => {
        let htmlElement = document.createElement('video')
        htmlElement.setAttribute('src', 'https://example.com/dummy-org.mp4')
        document.body.appendChild(htmlElement)
        const nodeList = document.querySelectorAll('video')
        Lazyload.execute(nodeList)
        expect(nodeList.item(0).getAttribute('src')).toBe('https://example.com/dummy-org.mp4')
        expect(nodeList.item(0).getAttribute('data-lazy')).toBeNull()
        document.body.removeChild(htmlElement)
      })
    })

    describe('when element is others', () => {
      it('should not be lazyloaded', () => {
        let htmlElement = document.createElement('iframe')
        htmlElement.setAttribute('src', 'https://example.com/dummy.html')
        htmlElement.setAttribute('data-lazy', 'https://example.com/index.html')
        document.body.appendChild(htmlElement)
        const nodeList = document.querySelectorAll('iframe')
        Lazyload.execute(nodeList)
        expect(nodeList.item(0).getAttribute('src')).toBe('https://example.com/dummy.html')
        expect(nodeList.item(0).getAttribute('data-lazy')).toBe('https://example.com/index.html')
        document.body.removeChild(htmlElement)
      })
    })
  })
})
