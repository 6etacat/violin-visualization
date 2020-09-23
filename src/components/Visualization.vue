<template>
  <div class="visualization">
    <YouTubeVideo :key="indices[id]" :source="source" :id="indices[id]" :start="start" :end="end" :muted="muted" ref="video" />
    <div class="subtitles-wrapper">
      <Subtitles :subtitles="subtitles" :currentSubtitles="currentSubtitles" ref="subtitles" />
    </div>
    <Statements :statements="statements" :errors="errors" />
    <div class="controls-wrapper">
      <div class="controls">
        <div class="row">
          <input class="input" type="text" value="" v-on:keyup.enter="submitNewClipId" v-on:click="selectElement"/>
        </div>
        <div class="row">
          <input id="id-input" class="input" type="text" :value="id+1" v-on:keyup.enter="submitNewId"/> / {{ indices.length }}
        </div>
        <div class="row">
          <button v-on:click="updateContent(-1)" :disabled="id == 0">Prev</button>
          <button v-on:click="updateContent(1)" :disabled="id == indices.length - 1">Next</button>
        </div>
        <button class="row" :disabled="!isPlayerLoaded" v-on:click="muted = !muted; toggleMute();">{{ muted ? 'Unmute': 'Mute' }}</button>
        <select :value="resultsName" v-on:change="submitResults">
          <option value="all_data">All Data</option>
          <option value="vid+sub_err">Errors of Vid+Sub model</option>
          <option value="sub_err">Errors of Sub model</option>
          <option value="vid_err">Errors of Vid model</option>
          <option value="vid+sub_sub_err">Error comparisons of Vid+Sub vs Sub models</option>
          <option value="vid+sub_vid_err">Error comparisons of Vid+Sub vs Vid models</option>
          <option value="vid_sub_err">Error comparisons of Vid vs Sub models</option>
        </select>
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
import { parseMessage } from '../helper.js';

export default {
  name: 'App',
  components: {
    YouTubeVideo,
    Subtitles,
    Statements,
  },
  props: {
    violin: Object,
    results: Object,
    resultsName: String,
    updateResults: Function,
  },
  data: function() {
    return {
      id: 0,
      currentSubtitles: [],
      muted: false,
      errors: undefined,
    };
  },
  computed: {
    indices: function() {
      if (this.violin) {
        return Object.keys(this.violin);
      }
      return [];
    },
    clipId: function() {
      return this.indices[this.id];
    },
    file: function() {
      return this.violin[this.clipId].file;
    },
    source: function() {
      return this.violin[this.clipId].source;
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
      return this.violin[this.clipId].statement;
    },
    subtitles: function() {
      return this.violin[this.clipId].sub;
    },
    isPlayerLoaded: function() {
      return this.$store.state.isPlayerLoaded;
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
      if (this.$refs.subtitles) {
        this.$refs.subtitles.$forceUpdate();
      }
    },
    updateContent: function(offset) {
      this.id += offset;
      this.currentSubtitles = [];
    },
    updateErrors: function() {
      if (this.results && this.results[this.indices[this.id]]) {
        this.errors = this.results[this.indices[this.id]];
      } else {
        this.errors = undefined;
      }
    },
    submitResults: function(event) {
      this.updateResults(event.target.value);
    },
    submitNewId: function(event) {
      const newId = Number(event.target.value);
      console.assert(parseInt(event.target.value) === newId);
      console.assert(newId > 0 && newId <= this.indices.length);
      this.id = newId - 1;
      this.currentSubtitles = [];
      this.updateErrors();
    },
    submitNewClipId: function(event) {
      const message = event.target.value.split('$');
      const newId = this.indices.indexOf(message[0]);
      if (newId < 0) {
        alert(`clip ${event.target.value} not found`);
      } else {
        this.id = newId;
        this.currentSubtitles = [];
        this.updateErrors();
        this.errors = parseMessage(message);
      }
    },
    selectElement: function(event) {
      event.target.select();
    },
    toggleMute: function() {
      if (this.$refs.video) {
        this.$refs.video.toggleMute(this.muted);
      }
    }
  },
  mounted: function() {
    this.updateErrors();
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
