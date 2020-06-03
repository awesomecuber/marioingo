<template>
  <v-container
    class="item"
    :class="objective.state"
    @click.self="spotClicked(objective)"
    @click.self.right.prevent="spotMarked(objective)"
    @mouseover="spotOver"
    @mouseleave="spotOut"
  >
    {{ objective.name }}
    <template v-if="hovering">
      <template v-if="objective.steps && objective.state !== 'ban'">
        <v-btn
          x-small
          class="minusbutton"
          fab
          color="gray"
          v-if="objective.stepsDone !== 0"
          @click="decrementSteps(objective)"
        >
          <v-icon dark>mdi-minus</v-icon>
        </v-btn>
        <h4 class="status">{{ objective.stepsDone }}/{{ objective.steps }}</h4>
        <v-btn
          x-small
          class="plusbutton"
          fab
          color="gray"
          v-if="objective.stepsDone !== objective.steps"
          @click="incrementSteps(objective)"
        >
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-tooltip top v-if="objective.tooltip">
        <template v-slot:activator="{ on }">
          <v-icon color="grey" v-on="on" class="tooltip"
            >mdi-information</v-icon
          >
        </template>
        <span>{{ objective.tooltip }}</span>
      </v-tooltip>
    </template>
  </v-container>
</template>

<script>
export default {
  name: "BingoSpot",
  data: () => {
    return {
      hovering: false
    };
  },
  props: {
    objective: Object
  },
  methods: {
    spotClicked: function(objective) {
      if (objective.state === "blank") {
        objective.state = "done";
        if (objective.steps) {
          objective.stepsDone = objective.steps;
        }
      } else if (objective.state === "done") {
        objective.state = "blank";
        if (objective.steps) {
          objective.stepsDone = 0;
        }
      } else if (objective.state === "wip") {
        this.incrementSteps(objective);
      }
    },
    spotMarked: function(objective) {
      if (objective.state === "blank") {
        objective.state = "ban";
      } else if (objective.state === "ban") {
        objective.state = "blank";
      }
    },
    spotOver: function() {
      this.hovering = true;
    },
    spotOut: function() {
      this.hovering = false;
    },
    incrementSteps: function(objective) {
      objective.stepsDone++;
      if (objective.stepsDone === 1) {
        objective.state = "wip";
      } else if (objective.stepsDone === objective.steps) {
        objective.state = "done";
      }
    },
    decrementSteps: function(objective) {
      objective.stepsDone--;
      if (objective.stepsDone === objective.steps - 1) {
        objective.state = "wip";
      } else if (objective.stepsDone === 0) {
        objective.state = "blank";
      }
    }
  }
};
</script>

<style>
.item {
  -moz-box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.6);
  -webkit-box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.6);
  color: #fff;
  border: 1px #424242 solid;
  box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.6);
  cursor: pointer;
  text-align: center;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  position: relative;
}

.blank {
  background: #000;
}

.blank:hover {
  background: #001a36;
}

.done {
  background: #051;
}

.done:hover {
  background: #072;
}

.ban {
  background: #501;
}

.ban:hover {
  background: #702;
}

.wip {
  background: #ff8000;
}

.wip:hover {
  background: #ffbf00;
}

.plusbutton {
  position: absolute !important;
  right: 5px;
  top: 5px;
}

.minusbutton {
  position: absolute !important;
  left: 5px;
  top: 5px;
}

.status {
  position: absolute !important;
  bottom: 5px;
}

.tooltip {
  position: absolute !important;
  bottom: 5px;
  right: 5px;
}
</style>
