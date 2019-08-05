<template>
  <div class="karuselo-slide">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Slide extends Vue {
}
</script>

<style scoped>
.karuselo-slide {
  justify-content: center;
}
</style>
