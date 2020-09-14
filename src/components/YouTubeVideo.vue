<template>
  <div class="video">
    <div id="video-player" class="disabled">
      <div>Video currently not available</div>
    </div>
  </div>
</template>

<script>
import YouTubePlayer from 'youtube-player';
import violin from '../violin_annotation.json'

// const indices = Object.keys(violin);

function isYoutubeId(id) {
  var request = new XMLHttpRequest();
  request.open('GET', 'https://www.googleapis.com/youtube/v3/videos?id='+ id + '&key=AIzaSyCXENXFZ_zJ9tCGnHtci3aRQRSUuzWDY0Y&part=snippet', false);
  request.send();

  if (request.status === 200) {
    var response = JSON.parse(request.responseText);
    if (response.pageInfo.totalResults == 0) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
}

export default {
  name: 'YouTubePlayer',
  props: {
    id: String,
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
    prepareVideo: function(id, start, end) {
      if (id && isYoutubeId(violin[id].source)) {
        this.player = YouTubePlayer('video-player');
        this.player.cueVideoById({
          videoId: violin[id].source,
          startSeconds: start,
          endSeconds: end
        });
      } else {
        this.player = undefined;
        document.getElementById('video-player').outerHTML = '<div id="video-player" class="disabled"><div>Video currently not available</div></div>'
      }
      this.toggleMute(this.muted);
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
    this.prepareVideo(this.id, this.start, this.end);
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
