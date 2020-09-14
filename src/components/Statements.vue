<template>
  <div class="statements">
    <Fragment v-for="(stmts, i) in statements" :key="i">
      <div class="true">{{ stmts[0] }}</div>
      <div class="false">{{ stmts[1] }}</div>
    </Fragment>
  </div>
</template>

<script>
import { Fragment } from 'vue-fragment'

export default {
  name: 'Statements',
  components: {
    Fragment,
  },
  props: {
    statements: Array,
  },
  computed: {
    trueStatements: function() {
      return this.statements.map((stmt) => stmt[0]);
    },
    falseStatements: function() {
      return this.statements.map((stmt) => stmt[1]);
    }
  }
}
</script>

<style lang="scss">
.statements {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 0.1rem;
  column-gap: 0.1rem;
  border-radius: 1rem;
  overflow: hidden;

  div {
    padding: 1rem;
  }

  .true {
    background: rgba(0, 128, 0, 0.363);
  }

  .false {
    background: rgba(255, 0, 0, 0.363);
  }
}
</style>
