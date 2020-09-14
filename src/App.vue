<template>
  <div class="contents">
    <YouTubeVideo :key="indices[id]" :id="indices[id]" :start="start" :end="end" :muted="muted" ref="video" />
    <div class="subtitles-wrapper">
      <Subtitles :subtitles="subtitles" :currentSubtitles="currentSubtitles" ref="subtitles" />
    </div>
    <Statements :statements="statements" />
    <div class="controls-wrapper">
      <div class="controls">
        <div class="row">
          <input id="id-input" type="text" :value="id+1" v-on:input="onInputResize" v-on:keyup.enter="submitNewId"/><span class='measure'/> / {{ indices.length }}
        </div>
        <div class="row">
          <button v-on:click="updateContent(-1)" :disabled="id == 0">Prev</button>
          <button v-on:click="updateContent(1)" :disabled="id == indices.length - 1">Next</button>
        </div>
        <button class="row" v-on:click="muted = !muted; toggleMute();">{{ muted ? 'Unmute': 'Mute' }}</button>
      </div>
      <div class="footnote">
        {{ file }} [{{start}}:{{end}}] in {{ split }} split
      </div>
    </div>
  </div>
</template>

<script>
import YouTubeVideo from './components/YouTubeVideo.vue';
import Subtitles from './components/Subtitles.vue';
import Statements from './components/Statements.vue';
import violin from './violin_annotation.json'

export default {
  name: 'App',
  components: {
    YouTubeVideo,
    Subtitles,
    Statements,
  },
  data: function() {
    return {
      id: 0,
      indices: Object.keys(violin),
      violin: violin,
      currentSubtitles: [],
      muted: false,
    };
  },
  computed: {
    file: function() {
      return this.violin[this.indices[this.id]].file;
    },
    split: function() {
      return this.violin[this.indices[this.id]].split;
    },
    start: function() {
      return this.violin[this.indices[this.id]].span[0];
    },
    end: function() {
      return this.violin[this.indices[this.id]].span[1];
    },
    playbackTime: function() {
      return this.$store.state.playbackTime;
    },
    statements: function() {
      return this.violin[this.indices[this.id]].statement
    },
    subtitles: function() {
      return this.violin[this.indices[this.id]].sub
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
      let newId = Number(event.target.value);
      console.assert(parseInt(event.target.value) === newId);
      console.assert(newId > 0 && newId <= this.indices.length);
      this.id = newId - 1;
      this.currentSubtitles = [];
    },
    onInputResize: function (event) {
      let spanElm = event.target.nextElementSibling;
      spanElm.textContent = event.target.value; // the hidden span takes the value of the input; 
      event.target.style.width = spanElm.offsetWidth + 'px'; // apply width of the span to the input
    },
    initialInputResize: function () {
      let elt = document.getElementById('id-input');
      var spanElm = elt.nextElementSibling;
      spanElm.textContent = elt.value; // the hidden span takes the value of the input; 
      elt.style.width = spanElm.offsetWidth + 'px'; // apply width of the span to the input
    },
    toggleMute: function() {
      this.$refs.video.toggleMute(this.muted);
    }
  },
  mounted: function() {
    setInterval(this.updateSubtitles, 10);
    this.initialInputResize();
  },
}
</script>

<style lang="scss">
html, body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
}

.contents {
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

    #id-input {
      padding: 2px;
      min-width: 1rem;
      border: none;
      outline: none;
      text-align: center;
      border-bottom: 1px solid black;
    }

    #id-input:focus {
      border-bottom: 1px solid rgb(0, 75, 189);
    }

    #id-input, .measure {
      padding: 2px;
      font-size: 1rem;
      font-family: Avenir, Helvetica, Arial, sans-serif;
      white-space: pre; /* white-spaces will work effectively */
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
