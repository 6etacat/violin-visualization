<template>
  <div class="subtitles">
    <p v-for="(sub, i) in subtitles" :key="i+sub[0]" :class="currentSubtitles[i] ? 'current-subtitle' : ''">{{ sub[0] }}</p>
  </div>
</template>

<script>
export default {
  name: 'Subtitles',
  props: {
    subtitles: Array,
    currentSubtitles: Array,
  },
}
</script>

<style lang="scss">
.subtitles {
  height: 22.5vw;
  width: 100%;
  padding: 0 5%;
  overflow: auto;
  color: rgb(143, 143, 143);

  .current-subtitle {
    color: rgb(0, 0, 0);
  }
}
</style>
