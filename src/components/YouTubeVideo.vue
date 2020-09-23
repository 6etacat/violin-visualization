<template>
  <div class="video">
    <div id="video-player" class="disabled">
      <div>Video currently not available</div>
    </div>
  </div>
</template>

<script>
import YouTubePlayer from 'youtube-player';
import { isYoutubeId } from '../helper.js';

export default {
  name: 'YouTubePlayer',
  props: {
    source: String,
    start: Number,
    end: Number,
    muted: Boolean,
  },
  data: function() {
    return {
      player: undefined,
      timeUpdater: undefined,
    };
  },
  methods: {
    prepareVideo: function(source, start, end) {
      this.$store.commit('setIsPlayerLoaded', false);
      isYoutubeId(source).then(canLoad => {
        if (canLoad) {
          this.player = YouTubePlayer('video-player');
          this.player.cueVideoById({
            videoId: source,
            startSeconds: start,
            endSeconds: end
          });
          this.toggleMute(this.muted);
          this.$store.commit('setIsPlayerLoaded', true);
        } else {
          this.player = undefined;
          document.getElementById('video-player').outerHTML = '<div id="video-player" class="disabled"><div>Video currently not available</div></div>'
        }
      });
    },
    updateTime: function() {
      if (this.player) {
        this.player.getCurrentTime().then(
          (time) => {
            this.$store.commit('setPlaybackTime', time - this.start);
          }
        )
      } else {
        this.$store.commit('setPlaybackTime', 0);
      }
    },
    toggleMute: function(muted) {
      if (muted) {
        this.player.mute();
      } else {
        this.player.unMute();
      }
    }
  },
  created: function() {
    this.timeUpdater = setInterval(this.updateTime, 10);
  },
  mounted: function() {
    this.$store.commit('setPlaybackTime', 0);
    this.prepareVideo(this.source, this.start, this.end);
  },
  beforeDestroy: function() {
    clearInterval(this.timeUpdater);
  }
}
</script>

<style lang="scss">
#video-player {
  width: 40vw;
  height: 22.5vw;

  &.disabled {
    display: flex;
    background: rgb(175, 175, 175);
    align-items: center;
    justify-content: center;
  }
}
</style>
