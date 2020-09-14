<template>
  <Visualization v-if="dataLoaded" :violin="violin" />
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

export default {
  name: 'App',
  components: {
    Visualization,
  },
  data: function() {
    return {
      violin: undefined,
      dataLoaded: false,
    };
  },
  methods: {
    fetchData: function() {
      axios.get('violin_annotation.json').then(response => {
        this.violin = response.data;
        this.dataLoaded = true;
      });
    },
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
