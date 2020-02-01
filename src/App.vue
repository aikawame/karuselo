<template>
  <article>
    <h1>Karuselo Example</h1>
    <section>
      <carousel
        :autoplay="true"
        :auto-play-speed="2000"
        :center-mode="false"
        :dots="true"
        :slides-to-show="3"
        :speed="500"
        :z-index="10000"
      >
        <slide>
          <div class="media">
            <a href="https://img.gifmagazine.net/gifmagazine/images/1290390/original.gif">
              <img
                alt="media-1"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAABAQMAAACVLeWUAAAAA1BMVEUAAACnej3aAAAADElEQVQImWNgIBIAAAApAAHB9cO/AAAAAElFTkSuQmCC"
                data-lazy="https://img.gifmagazine.net/gifmagazine/images/1290390/original.gif"
              />
            </a>
          </div>
        </slide>
        <slide>
          <div class="media">
            <a href="https://img.gifmagazine.net/gifmagazine/images/1291085/original.gif">
              <img
                alt="media-2"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAABAQMAAACVLeWUAAAAA1BMVEUAAACnej3aAAAADElEQVQImWNgIBIAAAApAAHB9cO/AAAAAElFTkSuQmCC"
                data-lazy="https://img.gifmagazine.net/gifmagazine/images/1291085/original.gif"
              />
            </a>
          </div>
        </slide>
        <slide>
          <div class="media">
            <a href="https://img.gifmagazine.net/gifmagazine/images/1290331/original.gif">
              <img
                alt="media-3"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAABAQMAAACVLeWUAAAAA1BMVEUAAACnej3aAAAADElEQVQImWNgIBIAAAApAAHB9cO/AAAAAElFTkSuQmCC"
                data-lazy="https://img.gifmagazine.net/gifmagazine/images/1290331/original.gif"
              />
            </a>
          </div>
        </slide>
        <slide>
          <div class="media">
            <a href="https://img.gifmagazine.net/gifmagazine/images/1291067/original.gif">
              <img
                alt="media-4"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAABAQMAAACVLeWUAAAAA1BMVEUAAACnej3aAAAADElEQVQImWNgIBIAAAApAAHB9cO/AAAAAElFTkSuQmCC"
                data-lazy="https://img.gifmagazine.net/gifmagazine/images/1291067/original.gif"
              />
            </a>
          </div>
        </slide>
        <slide>
          <div class="media">
            <a href="https://img.gifmagazine.net/gifmagazine/images/3666617/original.mp4">
              <video
                title="media-5"
                src=""
                data-lazy="https://img.gifmagazine.net/gifmagazine/images/3666617/original.mp4"
                playsinline
                muted
                autoplay
                loop
              ></video>
            </a>
          </div>
        </slide>
        <slide>
          <div class="media">
            <a href="https://img.gifmagazine.net/gifmagazine/images/3666618/original.mp4">
              <video
                title="media-6"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAABAQMAAACVLeWUAAAAA1BMVEUAAACnej3aAAAADElEQVQImWNgIBIAAAApAAHB9cO/AAAAAElFTkSuQmCC"
                data-lazy="https://img.gifmagazine.net/gifmagazine/images/3666618/original.mp4"
                playsinline
                muted
                autoplay
                loop
              ></video>
            </a>
          </div>
        </slide>
        <slide>
          <div class="media">
            <a href="https://img.gifmagazine.net/gifmagazine/images/1290353/original.mp4">
              <video
                title="media-7"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAABAQMAAACVLeWUAAAAA1BMVEUAAACnej3aAAAADElEQVQImWNgIBIAAAApAAHB9cO/AAAAAElFTkSuQmCC"
                data-lazy="https://img.gifmagazine.net/gifmagazine/images/1290353/original.mp4"
                playsinline
                muted
                autoplay
                loop
              ></video>
            </a>
          </div>
        </slide>
      </carousel>
    </section>
  </article>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Carousel from '@/components/Carousel.vue'
import Slide from '@/components/Slide.vue'

@Component({
  components: {
    Carousel,
    Slide
  }
})
export default class App extends Vue {}
</script>

<style>
body {
  background-color: #f0f0f0;
  margin: 0;
}

article {
  background-color: #fff;
  height: 100vh;
  margin: auto;
  width: 960px;
}

h1 {
  margin: 0;
  padding: 20px 0;
  text-align: center;
}

.karuselo-carousel {
  position: relative;
}

.karuselo-slide:not(.karuselo-center) {
  filter: opacity(30%);
  transition: 0.2s linear;
}

.karuselo-next::before,
.karuselo-prev::before {
  font-size: 40px;
  font-weight: bold;
  height: 60px;
  position: absolute;
  text-align: center;
  top: calc(50% - 30px);
  width: 60px;
}

.karuselo-next::before {
  content: '>';
  right: -60px;
}

.karuselo-prev::before {
  content: '<';
  left: -60px;
}

.karuselo-dots {
  text-align: center;
}

.karuselo-dot::before {
  color: #999;
  content: '•';
  font-size: 60px;
  line-height: 40px;
}

.karuselo-dot.active::before {
  color: #000;
}

.media video,
.media img {
  width: 320px;
}
</style>
