export default class CssTransform {
  static getTranslateX(element: HTMLElement): string | null {
    if (element.style.transform === null) return null
    return element.style.transform.replace('translateX(', '').replace(')', '')
  }

  static setTranslateX(element: HTMLElement, value: string): void {
    element.style.transform = `translateX(${value})`
  }
}
