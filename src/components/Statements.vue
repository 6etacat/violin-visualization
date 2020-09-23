<template>
  <div class="statements-wrapper">
    <div class="statements">
      <div class="header real">Real</div>
      <div class="header fake">Fake</div>
      <Fragment v-for="(stmts, i) in statements" :key="i">
        <div :class="getClass('real', i)">{{ stmts[0] }}</div>
        <div :class="getClass('fake', i)">{{ stmts[1] }}</div>
      </Fragment>
    </div>
    <div v-if="errors" class="footer">
      <div v-for="(line, i) in footer" :key="i" :class="line.class">{{line.content}}</div>
    </div>
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
    errors: Object,
  },
  computed: {
    footer: function() {
      if (!this.errors) {
        return [];
      }
      if (this.errors.comparison) {
        return [
          {
            content: 'both models correct',
            class: 'cell'
          },
          {
            content: `error of ${this.errors.A.name} model`,
            class: 'A'
          },
          {
            content: `error of ${this.errors.B.name} model`,
            class: 'B'
          },
          {
            content: `error of both models`,
            class: 'error'
          }
        ];
      }
      return [
          {
            content: `model correct`,
            class: 'cell'
          },
          {
            content: `model error`,
            class: 'error'
          }
        ];
    }
  },
  methods: {
    getClass: function(stmtType, idx) {
      console.log(this.errors);
      if (!this.errors) {
        return 'cell';
      }
      if (this.errors.comparison) {
        const errA = this.errors.A[stmtType][idx];
        const errB = this.errors.B[stmtType][idx];
        if (errA && errB) {
          return 'error';
        } else if (errA) {
          return 'A';
        } else if (errB) {
          return 'B';
        } else {
          return 'cell';
        }
      } else if (this.errors[stmtType][idx]) {
        return 'error';
      }
      return 'cell';
    }
  }
}
</script>

<style lang="scss">
.statements {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 0.2rem;
  column-gap: 0.2rem;
  border-radius: 1rem;
  overflow: hidden;

  div {
    padding: 1rem;
  }
}

.cell {
  background: lightgrey;
}

.header {
  text-align: center;
}

.real {
  background: rgba(0, 128, 0, 0.3);
}

.fake {
  background: rgba(255, 0, 0, 0.3);
}

.error {
  background: rgba(255, 0, 0, 0.5);
}

.A {
  background: rgba(63, 63, 255, 0.5);
}

.B {
  background: rgba(182, 49, 182, 0.5);
}

.footer {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  line-height: 1.5rem;

  div {
    display: inline-block;
    margin-right: 0.3rem;
    padding: 0.2rem 0.3rem;
    border-radius: 0.3rem;
  }
}
</style>
