<template>
  <v-container id="all">
    <v-responsive :aspect-ratio="1">
      <v-container id="table" :style="[gridStyle]">
        <div class="margin"></div>
        <div v-for="col in objectives.length" :key="col" class="margin">
          COL{{ col }}
        </div>
        <template v-for="row in objectives.length">
          <div :key="'row' + row" class="margin">ROW{{ row }}</div>
          <v-container
            v-for="col in objectives.length"
            :key="row + '' + col"
            class="item"
            :class="objectives[row - 1][col - 1].state"
            :style="textStyle"
            @click.self="spotClicked(objectives[row - 1][col - 1])"
            @click.self.right.prevent="spotMarked(objectives[row - 1][col - 1])"
          >
            {{ objectives[row - 1][col - 1].name }}
            <template
              v-if="
                objectives[row - 1][col - 1].steps &&
                  objectives[row - 1][col - 1].state !== 'ban'
              "
            >
              <v-btn
                x-small
                class="minusbutton"
                fab
                color="gray"
                v-if="objectives[row - 1][col - 1].stepsDone !== 0"
                @click="decrementSteps(objectives[row - 1][col - 1])"
              >
                <v-icon dark>mdi-minus</v-icon>
              </v-btn>
              <h4 class="status">
                {{ objectives[row - 1][col - 1].stepsDone }}/{{
                  objectives[row - 1][col - 1].steps
                }}
              </h4>
              <v-btn
                x-small
                class="plusbutton"
                fab
                color="gray"
                v-if="
                  objectives[row - 1][col - 1].stepsDone !==
                    objectives[row - 1][col - 1].steps
                "
                @click="incrementSteps(objectives[row - 1][col - 1])"
              >
                <v-icon dark>mdi-plus</v-icon>
              </v-btn>
            </template>
          </v-container>
        </template>
      </v-container>
    </v-responsive>
    <h2>Size:</h2>
    <vue-slider
      class="slider"
      v-model="size"
      tooltip="none"
      :adsorb="true"
      :marks="true"
      :min="3"
      :max="8"
    ></vue-slider>
    <h2>Difficulty:</h2>
    <vue-slider
      class="slider"
      v-model="difficulty"
      tooltip="none"
      :adsorb="true"
      :marks="true"
      :min-range="3"
      :min="1"
      :max="9"
    ></vue-slider>
    <v-row justify="center">
      <v-col>
        <v-select
          dense
          class="select"
          label="Type"
          :items="types"
          v-model="type"
        ></v-select>
      </v-col>
      <v-spacer></v-spacer>
      <v-col>
        <v-text-field
          dense
          class="input"
          label="Seed"
          v-model="seed"
          maxlength="20"
        >
          <template v-slot:append>
            <v-btn text class="randombtn" @click="seed = generateSeed()">
              Random
            </v-btn>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    <v-btn @click="regenerate">Generate</v-btn>
  </v-container>
</template>

<script>
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";
import boardGenerator from "../scripts/BoardGenerator.js";

export default {
  name: "BingoBoard",
  components: {
    VueSlider
  },
  data: () => {
    return {
      size: 5,
      difficulty: [1, 9],
      seed: "",
      lastSeed: "",
      objectives: [],
      types: [
        { text: "Bingo", value: "bingo" },
        { text: "Tic-Tac-Toe", value: "ttt" },
        { text: "Two by Two Block", value: "2x2" }
      ],
      type: "bingo"
    };
  },
  created() {
    this.onLoad(this.$route.query);
  },
  computed: {
    gridStyle: function() {
      return {
        gridTemplateColumns: `1fr repeat(${this.objectives.length},
                              ${12 / this.objectives.length}fr)`,
        gridTemplateRows: `1fr repeat(${this.objectives.length},
                           ${16 / this.objectives.length}fr)`
      };
    },
    textStyle: function() {
      let n = this.objectives.length;
      if (n === 8) {
        return {
          fontSize: "0.8em"
        };
      } else if (n === 7) {
        return {
          fontSize: "0.9em"
        };
      } else if (n === 6) {
        return {
          fontSize: "1.1em"
        };
      }
      return {
        fontSize: "1.3em"
      };
    }
  },
  watch: {
    $route(to) {
      this.onLoad(to.query);
    }
  },
  methods: {
    onLoad: function(query) {
      let needReload = false;

      // variable + P means url parameter
      let sizeP = Number(query.size);
      if (sizeP && sizeP >= 3 && sizeP <= 8) {
        this.size = sizeP;
      } else {
        needReload = true;
      }

      let minDiffP = Number(query.minDiff);
      let maxDiffP = Number(query.maxDiff);
      if (
        minDiffP &&
        maxDiffP &&
        minDiffP >= 1 &&
        maxDiffP <= 9 &&
        maxDiffP - minDiffP >= 3
      ) {
        this.difficulty[0] = minDiffP;
        this.difficulty[1] = maxDiffP;
      } else {
        needReload = true;
      }

      let seedP = query.seed;
      if (seedP && seedP.length <= 20) {
        this.seed = seedP;
        this.lastSeed = seedP;
      } else {
        needReload = true;
        this.seed = this.generateSeed();
        this.lastSeed = this.seed;
      }

      let typeP = query.type;
      if (typeP && this.types.map(type => type.value).includes(typeP)) {
        this.type = typeP;
      } else {
        needReload = true;
      }

      if (needReload) {
        this.$router.replace({
          query: {
            size: this.size,
            minDiff: this.difficulty[0],
            maxDiff: this.difficulty[1],
            seed: this.seed,
            type: this.type
          }
        });
      } else {
        this.objectives = boardGenerator(
          this.size,
          this.difficulty[0],
          this.difficulty[1],
          this.seed,
          this.type
        );

        this.objectives.forEach(row => {
          row.forEach(objective => {
            if (objective.steps) {
              this.$set(objective, "stepsDone", 0);
            }
          });
        });
      }
    },
    generateSeed: function() {
      return String(Math.floor(Math.random() * 100000));
    },
    regenerate: function() {
      if (this.seed === this.lastSeed) {
        this.seed = this.generateSeed();
      }
      this.$router.replace({
        query: {
          size: this.size,
          lowDiff: this.difficulty[0],
          highDiff: this.difficulty[1],
          seed: this.seed,
          type: this.type
        }
      });
    },
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
#table {
  text-align: center;
  display: grid;
  height: 100%;
}

#table > div {
  display: flex;
  justify-content: center;
  align-items: center;
}

.margin {
  background: #000811;
  border: 1px #0a245a solid;
  color: #3c70df;
  font-size: 75%;
  font-weight: 700;
}

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

.slider {
  margin: 0px 10px 30px;
}

.plusbutton {
  position: absolute !important;
  right: 5px;
  top: 5px;
  display: none !important;
}

.minusbutton {
  position: absolute !important;
  left: 5px;
  top: 5px;
  display: none !important;
}

.status {
  position: absolute !important;
  bottom: 5px;
  display: none !important;
}

.item:hover .plusbutton,
.item:hover .minusbutton,
.item:hover .status {
  display: inline-block !important;
}
</style>
