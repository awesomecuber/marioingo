<template>
  <v-container
    class="item"
    :class="[colorClass, { 'darken-2': hovering }]"
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
      <v-tooltip top v-if="objective.tooltip" max-width="200">
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
    objective: Object,
    objectiveNum: Number,
    multiColor: String
  },
  computed: {
    inMulti: function() {
      return this.$route.query.room;
    },
    colorClass: function() {
      if (!this.inMulti) {
        switch (this.objective.state) {
          case "blank":
            return "blank"; // vuetify doesnt work for me here
          case "done":
            return "green";
          case "wip":
            return "lime";
          case "ban":
            return "red";
          default:
            return "";
        }
      } else {
        return this.multiColor;
      }
    }
  },
  methods: {
    spotClicked: function(objective) {
      if (!this.inMulti) {
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
      } else {
        if (objective.steps && objective.stepsDone > 0) {
          if (objective.stepsDone === objective.steps) {
            this.$socket.emit(
              "toggleobjective",
              localStorage.uid,
              this.objectiveNum
            );
            objective.stepsDone = 0;
          } else {
            objective.stepsDone++;
            if (objective.stepsDone === objective.steps) {
              this.$socket.emit(
                "toggleobjective",
                localStorage.uid,
                this.objectiveNum
              );
            }
          }
        } else {
          this.$socket.emit(
            "toggleobjective",
            localStorage.uid,
            this.objectiveNum
          );
          if (objective.steps) {
            if (objective.stepsDone === 0) {
              objective.stepsDone = objective.steps;
            } else {
              objective.stepsDone = 0;
            }
          }
        }
      }
    },
    spotMarked: function(objective) {
      if (!this.inMulti) {
        if (objective.state === "blank") {
          objective.state = "ban";
        } else if (objective.state === "ban") {
          objective.state = "blank";
        }
      }
      // todo: mark in a multi with a star
    },
    spotOver: function() {
      this.hovering = true;
    },
    spotOut: function() {
      this.hovering = false;
    },
    incrementSteps: function(objective) {
      objective.stepsDone++; // todo: check if its the right color
      if (objective.stepsDone === 1) {
        if (!this.inMulti) {
          objective.state = "wip";
        }
      } else if (objective.stepsDone === objective.steps) {
        if (!this.inMulti) {
          objective.state = "done";
        } else {
          this.$socket.emit(
            "toggleobjective",
            localStorage.uid,
            this.objectiveNum
          );
        }
      }
    },
    decrementSteps: function(objective) {
      objective.stepsDone--;
      if (objective.stepsDone === objective.steps - 1) {
        if (!this.inMulti) {
          objective.state = "wip";
        } else {
          this.$socket.emit(
            "toggleobjective",
            localStorage.uid,
            this.objectiveNum
          );
        }
      } else if (objective.stepsDone === 0) {
        if (!this.inMulti) {
          objective.state = "blank";
        }
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
  background-color: #272727;
  padding: 1px 2px;
}

.tooltip {
  position: absolute !important;
  bottom: 5px;
  right: 5px;
}
</style>
