export default class Lazyload {
  static readonly targetAttribute = 'data-lazy'

  static execute(nodeList: NodeList): void {
    nodeList.forEach(node => {
      if (!(node instanceof HTMLImageElement || node instanceof HTMLVideoElement)) return
      if (!node.hasAttribute(Lazyload.targetAttribute)) return
      node.setAttribute('src', node.getAttribute(Lazyload.targetAttribute) || '')
      node.removeAttribute(Lazyload.targetAttribute)
    })
  }
}
