<template>
  <v-container id="all">
    <v-responsive :aspect-ratio="1">
      <v-container v-if="started" id="table" :style="[gridStyle]">
        <div class="margin"></div>
        <div v-for="col in objectives.length" :key="col" class="margin">
          COL{{ col }}
        </div>
        <template v-for="row in objectives.length">
          <div :key="'row' + row" class="margin">ROW{{ row }}</div>
          <bingo-spot
            v-for="col in objectives.length"
            :style="textStyle"
            :key="row + '' + col"
            :objective="objectives[row - 1][col - 1]"
          >
          </bingo-spot>
        </template>
      </v-container>
      <v-container v-else id="placeholder" @click="started = true">
        CLICK TO REVEAL BOARD
      </v-container>
    </v-responsive>
    <h2>Size:</h2>
    <vue-slider
      class="slider"
      v-model="size"
      tooltip="none"
      :adsorb="true"
      :marks="true"
      :min="BingoConstants.MIN_SIZE"
      :max="BingoConstants.MAX_SIZE"
    ></vue-slider>
    <h2>Difficulty:</h2>
    <vue-slider
      class="slider"
      v-model="difficulty"
      tooltip="none"
      :adsorb="true"
      :marks="true"
      :min-range="BingoConstants.MIN_DIFF_DIFFERENCE"
      :min="BingoConstants.MIN_DIFF"
      :max="BingoConstants.MAX_DIFF"
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
import BingoSpot from "../components/BingoSpot.vue";

import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";

import boardGenerator from "../scripts/BoardGenerator.js";
import processParameters from "../scripts/ProcessParameters.js";
import BingoConstants from "../scripts/config.js";

import { v4 as uuid } from "uuid";
import axios from "axios";

export default {
  name: "BingoBoard",
  components: {
    VueSlider,
    BingoSpot
  },
  data: () => {
    return {
      size: BingoConstants.DEFAULT_SIZE,
      difficulty: [BingoConstants.MIN_SIZE, BingoConstants.MAX_SIZE],
      seed: "",
      lastSeed: "",
      objectives: [],
      types: BingoConstants.TYPES,
      type: BingoConstants.DEFAULT_TYPE,
      tooltips: {
        // should probably be moved to ObjectiveList
        hat: "Your hat must be gone at the time the game is over",
        lives: "Your number of lives must be at least X when the game is over",
        race:
          "Koopa the Quick in BoB, Rematch with Koopa the Quick in THI, and Penguin Race in CCM. You must collect the stars as well.",
        boss: "Bobomb King, Whomp King, Hand Boss in SSL, Wiggler",
        eachcourse: "The 15 main courses, not Bowser stages or secret stages",
        hmc: "The metal cap stage does not count as an HMC star"
      },
      started: false,
      BingoConstants // so that i can access in the DOM
    };
  },
  created() {
    if (!localStorage.uid) {
      localStorage.uid = uuid();
    }
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
      if (n >= 8) {
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
      if (!query.room) {
        this.started = false;
        let response = processParameters(query);

        if (response.needReload) {
          // the query params have some sort of issue, and therefore we need
          // to replace them
          this.$router.replace({
            query: {
              size: response.size,
              minDiff: response.difficulty[0],
              maxDiff: response.difficulty[1],
              seed: response.seed,
              type: response.type
            }
          });
        } else {
          // query params are good, generate the board
          this.size = response.size;
          this.difficulty = [response.difficulty[0], response.difficulty[1]];
          this.seed = response.seed;
          this.lastSeed = response.seed;
          this.type = response.type;

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
              if (objective.tooltip) {
                objective.tooltip = this.tooltips[objective.tooltip];
              }
            });
          });
        }
      } else {
        // this.$socket.emit("joinroom", query.room, localStorage.uid);
        axios
          .get(BingoConstants.SOCKET_URL + "rooms")
          .then(res => res.data)
          .then(rooms => {
            this.$socket.emit("register", localStorage.uid);
            console.log(rooms);
          })
          .catch(error => console.log(error));
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

#placeholder {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000811;
  border: 1px #0a245a solid;
  cursor: pointer;
}

.margin {
  background: #000811;
  border: 1px #0a245a solid;
  color: #3c70df;
  font-size: 75%;
  font-weight: 700;
}

.slider {
  margin: 0px 10px 30px;
}
</style>
