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
          <bingo-spot
            v-for="col in objectives.length"
            :style="textStyle"
            :key="row + '' + col"
            :objective="objectives[row - 1][col - 1]"
          >
          </bingo-spot>
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
import BingoSpot from "../components/BingoSpot.vue";

export default {
  name: "BingoBoard",
  components: {
    VueSlider,
    BingoSpot
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
      type: "bingo",
      tooltips: {
        hat: "Your hat must be gone at the time the game is over",
        lives: "Your number of lives must be at least X when the game is over",
        race:
          "Koopa the Quick in BoB, Rematch with Koopa the Quick in THI, and Penguin Race in CCM. You must collect the stars as well.",
        boss: "Bobomb King, Whomp King, Hand Boss in SSL, Wiggler",
        eachcourse: "The 15 main courses, not Bowser stages or secret stages",
        hmc: "The metal cap stage does not count as an HMC star"
      }
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
            if (objective.tooltip) {
              objective.tooltip = this.tooltips[objective.tooltip];
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

.slider {
  margin: 0px 10px 30px;
}
</style>
