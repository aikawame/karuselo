<template>
  <div class="karuselo-carousel">
    <div class="karuselo-arrow karuselo-arrow-left" @click="forceBackward"></div>
    <div class="karuselo-slider" @mouseenter="isFocused = true" @mouseleave="isFocused = false">
      <div class="karuselo-list">
        <slot></slot>
      </div>
    </div>
    <div class="karuselo-arrow karuselo-arrow-right" @click="forceForward"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

const enum Event {
  TOUCH_START = 'touchstart',
  TOUCH_MOVE = 'touchmove',
  TOUCH_END = 'touchend'
}

const enum SwipeType {
  LEFT = 'left',
  RIGHT = 'right',
  NEUTRAL = 'neutral'
}

@Component
export default class Carousel extends Vue {
  @Prop({ default: false })
  readonly autoplay!: boolean

  @Prop({ default: 3000 })
  readonly autoplaySpeed!: number

  @Prop({ default: false })
  readonly centerMode!: boolean

  @Prop({ default: 1 })
  readonly slidesToShow!: number

  @Prop({ default: 300 })
  readonly speed!: number

  @Prop({ default: 1000 })
  readonly zIndex!: number

  // 内部設定
  translateThreshold: number = 0.2

  // 内部ステータス
  listNode!: HTMLDivElement
  orgSlideNodes: any[] = [] // TODO: 型を厳密にする
  slideNodes: any[] = [] // TODO: 型を厳密にする
  currentIndex: number = 0
  intervalId: number = 0
  isFocused: boolean = false
  isSliding: boolean = false
  touchStartX: number = 0
  touchLastX: number = 0
  touchRestX: number = 0
  touchDiffX: number = 0

  mounted() {
    this.listNode = this.$el.getElementsByClassName('karuselo-list')[0] as HTMLDivElement
    this.orgSlideNodes = Array.from(this.listNode.children)
    this.orgSlideNodes.forEach(slideNode => {
      slideNode.style.width = `${100 / this.slidesToShow}%`
    })
    this.slideNodes = Object.create(this.orgSlideNodes)
    this.cloneSlides()
    while (this.slideNodes.length < this.slidesToShow * 2 + 2) {
      // スライド枚数が足りないとレイアウトが崩れるため増やす
      this.cloneSlides()
    }
    // スライドの初期位置を調整する
    const unshiftCount = this.centerMode ? Math.floor(this.slidesToShow / 2) + 1 : 1
    for (let i = 0; i < unshiftCount; i++) {
      this.listNode.insertBefore(this.listNode.lastChild as ChildNode, this.listNode.firstChild)
      this.slideNodes.unshift(this.slideNodes.pop())
    }

    this.$el.addEventListener(Event.TOUCH_START, { handleEvent: (event: TouchEvent) => this.onTouchStart(event) })
    this.$el.addEventListener(Event.TOUCH_MOVE, { handleEvent: (event: TouchEvent) => this.onTouchMove(event) })
    this.$el.addEventListener(Event.TOUCH_END, { handleEvent: (event: TouchEvent) => this.onTouchEnd(event) })

    this.firstLazyload()
    this.forward()
    this.playInterval()
  }

  destroyed() {
    this.$el.removeEventListener(Event.TOUCH_START, { handleEvent: (event: TouchEvent) => this.onTouchStart(event) })
    this.$el.removeEventListener(Event.TOUCH_MOVE, { handleEvent: (event: TouchEvent) => this.onTouchMove(event) })
    this.$el.removeEventListener(Event.TOUCH_END, { handleEvent: (event: TouchEvent) => this.onTouchEnd(event) })
    this.pauseInterval()
  }

  get isLastSlide(): boolean {
    return this.currentIndex === this.slideNodes.length - this.orgSlideNodes.length
  }

  get swipeType(): string {
    const threshold = this.slideNodes[0].clientWidth * this.translateThreshold
    if (this.touchStartX - this.touchLastX > threshold) {
      return SwipeType.LEFT
    } else if (this.touchLastX - this.touchStartX > threshold) {
      return SwipeType.RIGHT
    }
    return SwipeType.NEUTRAL
  }

  cloneSlides(): void {
    this.slideNodes.forEach(slide => {
      let clonedSlide = slide.cloneNode(true)
      if (clonedSlide instanceof HTMLDivElement) {
        this.listNode.appendChild(clonedSlide)
        this.slideNodes.push(clonedSlide)
      }
    })
  }

  firstLazyload(): void {
    for (let index = 0; index <= this.slidesToShow + 1; index++) {
      Carousel.lazyload(this.slideNodes[index].querySelector('img, video'))
    }
  }

  forceForward(): void {
    this.pauseInterval()
    this.forward()
    this.playInterval()
  }

  forceBackward(): void {
    this.pauseInterval()
    this.backward()
    this.playInterval()
  }

  forward(): void {
    if (this.isFocused || this.isSliding) return
    // console.log('forward')
    Carousel.lazyload(this.slideNodes[this.currentIndex + this.slidesToShow + 1].querySelector('img, video'))
    if (this.currentIndex < this.slideNodes.length) this.currentIndex++
    this.translate()
  }

  backward(): void {
    if (this.isFocused || this.isSliding) return
    // console.log('backward')
    Carousel.lazyload(this.slideNodes[0].querySelector('img, video'))
    if (this.currentIndex > 1) this.currentIndex--
    this.translate()
  }

  translate(): void {
    this.isSliding = true
    this.listNode.style.transition = `transform ${this.speed}ms ease 0s`
    Carousel.setTranslateX(this.listNode, `-${(100 / this.slidesToShow) * this.currentIndex}%`)
    setTimeout(() => {
      this.listNode.style.transition = ''
      if (this.isLastSlide) {
        Carousel.setTranslateX(this.listNode, '0')
        this.currentIndex = 0
      }
      this.isSliding = false
    }, this.speed)
  }

  onTouchStart(event: TouchEvent): void {
    event.preventDefault()
    this.pauseInterval()
    this.touchStartX = event.touches[0].pageX
    this.touchLastX = this.touchStartX
  }

  onTouchMove(event: TouchEvent): void {
    event.preventDefault()
    const touchDiffX = this.touchRestX + (event.changedTouches[0].pageX - this.touchLastX)
    if (Math.abs(touchDiffX) > 0) {
      this.touchDiffX = Math.floor(touchDiffX)
      this.touchRestX = touchDiffX - this.touchDiffX
      this.listNode.style.transitionDuration = '0ms'
      Carousel.setTranslateX(this.listNode, `calc(${Carousel.getTranslateX(this.listNode)} + ${this.touchDiffX}px)`)
    } else {
      this.touchRestX = touchDiffX
    }
    this.touchLastX = event.touches[0].pageX
  }

  onTouchEnd(event: TouchEvent): void {
    event.preventDefault()
    switch (this.swipeType) {
      case SwipeType.LEFT:
        this.forward()
        break
      case SwipeType.RIGHT:
        this.backward()
        break
      default:
        this.translate()
    }
    this.playInterval()
  }

  pauseInterval(): void {
    if (!this.autoplay) return
    clearInterval(this.intervalId)
  }

  playInterval(): void {
    if (!this.autoplay) return
    this.intervalId = setInterval(this.forward, this.autoplaySpeed + this.speed)
  }

  static lazyload(mediaElement: HTMLImageElement | HTMLVideoElement | null): void {
    if (mediaElement === null || !mediaElement.hasAttribute('data-lazy')) return
    mediaElement.setAttribute('src', mediaElement.getAttribute('data-lazy') || '')
    mediaElement.removeAttribute('data-lazy')
  }

  static getTranslateX(element: HTMLElement): string | null {
    if (element.style.transform === null) return null
    return element.style.transform.replace('translateX(', '').replace(')', '')
  }

  static setTranslateX(element: HTMLElement, value: string): void {
    element.style.transform = `translateX(${value})`
  }
}
</script>

<style scoped>
.karuselo-slider {
  overflow: hidden;
}

.karuselo-list {
  position: relative;
  display: flex;
}
</style>