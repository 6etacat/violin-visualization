<template>
  <div class="visualization">
    <YouTubeVideo :key="indices[id]" :violin="violin" :id="indices[id]" :start="start" :end="end" :muted="muted" ref="video" />
    <div class="subtitles-wrapper">
      <Subtitles :subtitles="subtitles" :currentSubtitles="currentSubtitles" ref="subtitles" />
    </div>
    <Statements :statements="statements" :errors="errors" />
    <div class="controls-wrapper">
      <div class="controls">
        <div class="row">
          <input class="input" type="text" :value="clipId" v-on:keyup.enter="submitNewClipId" v-on:click="selectElement"/>
        </div>
        <div class="row">
          <input id="id-input" class="input" type="text" :value="id+1" v-on:keyup.enter="submitNewId"/> / {{ indices.length }}
        </div>
        <div class="row">
          <button v-on:click="updateContent(-1)" :disabled="id == 0">Prev</button>
          <button v-on:click="updateContent(1)" :disabled="id == indices.length - 1">Next</button>
        </div>
        <button v-on:click="muted = !muted; toggleMute();">{{ muted ? 'Unmute': 'Mute' }}</button>
      </div>
      <div class="footnote">
        {{ file }} [{{start}}:{{end}}] in {{ split }} split
      </div>
    </div>
  </div>
</template>

<script>
import YouTubeVideo from './YouTubeVideo.vue';
import Subtitles from './Subtitles.vue';
import Statements from './Statements.vue';

const DEFAULT_ERRORS = {real: [false, false, false], fake: [false, false, false]};

export default {
  name: 'App',
  components: {
    YouTubeVideo,
    Subtitles,
    Statements,
  },
  props: {
    violin: Object,
  },
  data: function() {
    return {
      id: 0,
      currentSubtitles: [],
      muted: false,
      errors: DEFAULT_ERRORS,
    };
  },
  computed: {
    indices: function() {
      return Object.keys(this.violin);
    },
    clipId: function() {
      return this.indices[this.id];
    },
    file: function() {
      return this.violin[this.clipId].file;
    },
    split: function() {
      return this.violin[this.clipId].split;
    },
    start: function() {
      return this.violin[this.clipId].span[0];
    },
    end: function() {
      return this.violin[this.clipId].span[1];
    },
    playbackTime: function() {
      return this.$store.state.playbackTime;
    },
    statements: function() {
      return this.violin[this.clipId].statement
    },
    subtitles: function() {
      return this.violin[this.clipId].sub
    },
  },
  methods: {
    updateSubtitles: function() {
      if (this.currentSubtitles.length == 0) {
        this.currentSubtitles = Array(this.subtitles.length).fill(false);
      }
      this.subtitles.forEach((sub, i) => {
        this.currentSubtitles[i] = this.playbackTime * 1000 >= sub[1][0] && this.playbackTime * 1000 <= sub[1][1];
      });
      this.$refs.subtitles.$forceUpdate();
    },
    updateContent: function(offset) {
      this.id += offset;
      this.currentSubtitles = [];
    },
    submitNewId: function(event) {
      const newId = Number(event.target.value);
      console.assert(parseInt(event.target.value) === newId);
      console.assert(newId > 0 && newId <= this.indices.length);
      this.id = newId - 1;
      this.currentSubtitles = [];
      this.errors = DEFAULT_ERRORS;
    },
    submitNewClipId: function(event) {
      const message = event.target.value.split('$');
      const newId = this.indices.indexOf(message[0]);
      if (newId < 0) {
        alert(`clip ${event.target.value} not found`);
      } else {
        this.id = newId;
        this.currentSubtitles = [];
        this.errors = DEFAULT_ERRORS;
        if (message.length == 3) {
          this.errors = {
            real: message[1].split('').map((x) => x == 1),
            fake: message[2].split('').map((x) => x == 1)
          }
        }
      }
    },
    selectElement: function(event) {
      event.target.select();
    },
    toggleMute: function() {
      this.$refs.video.toggleMute(this.muted);
    }
  },
  mounted: function() {
    setInterval(this.updateSubtitles, 10);
  },
}
</script>

<style lang="scss">
.visualization {
  display: grid;
  grid-template-columns: 40vw calc(20vw - 1rem);
  column-gap: 1rem;
  row-gap: 1rem;
  margin: 10vh 20vw 0 20vw;
}

.subtitles-wrapper {
  display: flex;
  align-items: center;
  background: rgb(226, 226, 226);
}

.controls-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5%;
    border: 1px solid black;

    .row {
      margin-bottom: 0.7rem;
    }

    .input {
      padding: 2px;
      min-width: 1rem;
      font-family: Avenir, Helvetica, Arial, sans-serif;
      font-size: 1rem;
      border: none;
      outline: none;
      text-align: center;
      border-bottom: 1px solid black;
    }

    .input:focus {
      border-bottom: 1px solid rgb(0, 75, 189);
    }

    #id-input {
      width: 5ch;
    }

    .measure{  
      position: absolute;
      left: -9999px;
      top: -9999px;
    }

    button {
      margin: 0 0.3rem;
    }
  }

  .footnote {
    margin-top: 0.5rem;
    color: grey;
    font-size: 0.85rem;
  }
}
</style>
