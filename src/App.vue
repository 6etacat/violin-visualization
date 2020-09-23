<template>
  <Visualization v-if="isLoaded" :violin="currentViolin" :results="results" :resultsName="resultsName" :updateResults="updateResults" />
  <div v-else class="loading">
    <svg class="loading-icon" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
      <circle cx="50" cy="50" fill="none" stroke="#94a9ce" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138">
        <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
      </circle>
    </svg>
  </div>
</template>

<script>
import Visualization from './components/Visualization.vue';
import axios from 'axios';
import { parseMessage } from './helper';

export default {
  name: 'App',
  components: {
    Visualization,
  },
  data: function() {
    return {
      violin: undefined,
      currentViolin: undefined,
      results: undefined,
      resultsName: "all_data",
    };
  },
  computed: {
    isLoaded () {
      return this.$store.state.isLoaded;
    }
  },
  methods: {
    fetchData: function() {
      axios.get('violin_annotation.json').then(response => {
        this.violin = response.data;
        this.currentViolin = this.violin;
        this.$store.commit('setIsLoaded', true);
      });
    },
    updateResults: function(resultsName) {
      if (this.resultsName == resultsName) {
        return;
      }
      this.$store.commit('setIsLoaded', false);
      if (resultsName === "all_data") {
        this.results = undefined;
        this.currentViolin = this.violin;
        this.$store.commit('setIsLoaded', true);
      } else {
        axios.get(`results/${resultsName}.txt`).then(response => {
          this.resultsName = resultsName;
          this.results = {};
          this.currentViolin = {};
          const messages = response.data.split('\n').map(line => line.split('$'));
          messages.forEach(message => {
            this.results[message[0]] = parseMessage(message);
          });
          Object.keys(this.results).forEach(clip => {
            this.currentViolin[clip] = this.violin[clip];
          });
          this.$store.commit('setIsLoaded', true);
        });
      }
    }
  },
  mounted: function() {
    this.fetchData();
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

.loading {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .loading-icon {
    width: 20vh;
    height: 20vh;
  }
}
</style>
