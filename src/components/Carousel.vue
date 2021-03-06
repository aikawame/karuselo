<template>
  <div
    class="karuselo-carousel"
    @touchstart="onTouchStartCarousel"
    @touchmove="onTouchMoveCarousel"
    @touchend="onTouchEndCarousel"
  >
    <div class="karuselo-arrow karuselo-prev" @click="forceBackward" v-if="arrows"></div>
    <div class="karuselo-slider" @mouseenter="isFocused = true" @mouseleave="isFocused = false">
      <div class="karuselo-list">
        <slot></slot>
      </div>
    </div>
    <div class="karuselo-arrow karuselo-next" @click="forceForward" v-if="arrows"></div>
    <div class="karuselo-dots" v-if="dots">
      <span
        class="karuselo-dot"
        :class="{ active: index === currentDotIndex }"
        @click="changeIndex(index)"
        v-for="index in orgSlideNodes.length"
        :key="index"
      ></span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Event from '@/enums/Event'
import SwipeDirection from '@/enums/SwipeDirection'
import CssTransform from '@/models/CssTransform'
import Lazyload from '@/models/Lazyload'

@Component
export default class Carousel extends Vue {
  @Prop({ default: true })
  readonly arrows!: boolean

  @Prop({ default: false })
  readonly autoplay!: boolean

  @Prop({ default: 3000 })
  readonly autoplaySpeed!: number

  @Prop({ default: false })
  readonly centerMode!: boolean

  @Prop({ default: false })
  readonly dots!: boolean

  @Prop({ default: 1 })
  readonly slidesToShow!: number

  @Prop({ default: 300 })
  readonly speed!: number

  @Prop({ default: 1000 })
  readonly zIndex!: number

  // 内部設定
  readonly translateThreshold: number = 0.2

  // 内部ステータス
  listNode!: HTMLDivElement
  orgSlideNodes: any[] = [] // TODO: 型を厳密にする
  slideNodes: any[] = [] // TODO: 型を厳密にする
  currentIndex: number = 0
  intervalId: number = 0
  isFocused: boolean = false
  isSliding: boolean = false
  isAnchorTouched: boolean = false
  touchStartX: number = 0
  touchLastX: number = 0
  touchRestX: number = 0
  touchDiffX: number = 0

  mounted() {
    this.$el.querySelectorAll('a').forEach(anchorNode => {
      anchorNode.addEventListener(Event.TOUCH_START, {
        handleEvent: (event: TouchEvent) => this.onTouchStartAnchor(event)
      })
      anchorNode.addEventListener(Event.TOUCH_MOVE, {
        handleEvent: (event: TouchEvent) => this.onTouchMoveAnchor(event)
      })
      anchorNode.addEventListener(Event.TOUCH_END, {
        handleEvent: (event: TouchEvent) => this.onTouchEndAnchor(event)
      })
    })

    this.listNode = this.$el.getElementsByClassName('karuselo-list')[0] as HTMLDivElement
    this.orgSlideNodes = Array.from(this.listNode.children)
    if (this.orgSlideNodes.length < 1) return
    this.orgSlideNodes.forEach(slideNode => {
      slideNode.style.width = `${100 / this.slidesToShow}%`
    })
    this.slideNodes = Object.create(this.orgSlideNodes)
    if (this.slideNodes.length === 1) {
      this.slideNodes[0].classList.add('karuselo-center')
      Lazyload.execute(this.slideNodes[0].querySelectorAll('img, video'))
      return
    }
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

    this.firstLazyload()
    this.forward()
    this.playInterval()
  }

  destroyed() {
    this.$el.querySelectorAll('a').forEach(anchorNode => {
      anchorNode.removeEventListener(Event.TOUCH_START, {
        handleEvent: (event: TouchEvent) => this.onTouchStartAnchor(event)
      })
      anchorNode.removeEventListener(Event.TOUCH_MOVE, {
        handleEvent: (event: TouchEvent) => this.onTouchMoveAnchor(event)
      })
      anchorNode.removeEventListener(Event.TOUCH_END, {
        handleEvent: (event: TouchEvent) => this.onTouchEndAnchor(event)
      })
    })
  }

  get centerIndex(): number {
    if (this.isLastSlide) {
      return Math.ceil(this.slidesToShow / 2) - 1
    }
    return this.currentIndex + Math.ceil(this.slidesToShow / 2) - 1
  }

  get currentDotIndex(): number {
    // TODO: インデックスを統一する
    return this.currentIndex === 0 ? this.orgSlideNodes.length : this.currentIndex
  }

  get isLastSlide(): boolean {
    return this.currentIndex === this.slideNodes.length - this.orgSlideNodes.length
  }

  get swipeType(): string {
    const threshold = this.slideNodes[0].clientWidth * this.translateThreshold
    if (this.touchStartX - this.touchLastX > threshold) {
      return SwipeDirection.LEFT
    } else if (this.touchLastX - this.touchStartX > threshold) {
      return SwipeDirection.RIGHT
    }
    return SwipeDirection.NEUTRAL
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
      Lazyload.execute(this.slideNodes[index].querySelectorAll('img, video'))
    }
  }

  forceForward(): void {
    if (this.slideNodes.length === 1) return
    this.pauseInterval()
    this.isSliding = false
    this.forward()
    this.playInterval()
  }

  forceBackward(): void {
    if (this.slideNodes.length === 1) return
    this.pauseInterval()
    this.isSliding = false
    this.backward()
    this.playInterval()
  }

  forward(): void {
    if (this.isFocused || this.isSliding) return
    // console.log('forward')
    Lazyload.execute(this.slideNodes[this.currentIndex + this.slidesToShow + 1].querySelectorAll('img, video'))
    if (this.currentIndex < this.slideNodes.length) this.currentIndex++
    this.translate()
  }

  backward(): void {
    if (this.isFocused || this.isSliding) return
    // console.log('backward')
    Lazyload.execute(this.slideNodes[0].querySelectorAll('img, video'))
    if (this.currentIndex > 1) this.currentIndex--
    this.translate()
  }

  changeIndex(index: number): void {
    if (index > this.currentDotIndex) {
      ;[...Array(index - this.currentDotIndex)].map(() => this.forceForward())
    } else if (index < this.currentDotIndex) {
      ;[...Array(this.currentDotIndex - index)].map(() => this.forceBackward())
    }
  }

  translate(): void {
    this.isSliding = true
    this.listNode.style.transition = `transform ${this.speed}ms ease 0s`
    CssTransform.setTranslateX(this.listNode, `-${(100 / this.slidesToShow) * this.currentIndex}%`)

    this.slideNodes.forEach(slideNode => {
      slideNode.classList.remove('karuselo-center')
    })
    this.slideNodes[this.centerIndex].classList.add('karuselo-center')

    setTimeout(() => {
      this.listNode.style.transition = ''
      if (this.isLastSlide) {
        CssTransform.setTranslateX(this.listNode, '0')
        this.currentIndex = 0
      }
      this.isSliding = false
    }, this.speed)
  }

  onTouchStartCarousel(event: TouchEvent): void {
    this.pauseInterval()
    this.touchStartX = event.touches[0].pageX
    this.touchLastX = this.touchStartX
  }

  onTouchMoveCarousel(event: TouchEvent): void {
    const touchDiffX = this.touchRestX + (event.changedTouches[0].pageX - this.touchLastX)
    if (Math.abs(touchDiffX) > 0) {
      this.touchDiffX = Math.floor(touchDiffX)
      this.touchRestX = touchDiffX - this.touchDiffX
      this.listNode.style.transitionDuration = '0ms'
      CssTransform.setTranslateX(
        this.listNode,
        `calc(${CssTransform.getTranslateX(this.listNode)} + ${this.touchDiffX}px)`
      )
    } else {
      this.touchRestX = touchDiffX
    }
    this.touchLastX = event.touches[0].pageX
  }

  onTouchEndCarousel(_event: TouchEvent): void {
    switch (this.swipeType) {
      case SwipeDirection.LEFT:
        this.forward()
        break
      case SwipeDirection.RIGHT:
        this.backward()
        break
      default:
        this.translate()
    }
    this.playInterval()
  }

  onTouchStartAnchor(_event: TouchEvent): void {
    this.isAnchorTouched = true
  }

  onTouchMoveAnchor(_event: TouchEvent): void {
    this.isAnchorTouched = false
  }

  onTouchEndAnchor(event: TouchEvent): void {
    if (this.isAnchorTouched) {
      const anchorNode = event.currentTarget
      if (anchorNode instanceof HTMLAnchorElement) location.href = anchorNode.href
      this.isAnchorTouched = false
    }
  }

  pauseInterval(): void {
    if (!this.autoplay) return
    clearInterval(this.intervalId)
  }

  playInterval(): void {
    if (!this.autoplay) return
    this.intervalId = setInterval(this.forward, this.autoplaySpeed + this.speed)
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
