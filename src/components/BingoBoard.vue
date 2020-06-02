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
          <div
            v-for="col in objectives.length"
            :key="row + '' + col"
            class="item"
            :class="objectives[row - 1][col - 1].state"
            :style="textStyle"
            @click="spotClicked(objectives[row - 1][col - 1])"
          >
            {{ objectives[row - 1][col - 1].name }}
          </div>
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
    <div id="typeseed">
      <h2>
        Type:
        <v-select
          class="select"
          :options="types"
          v-model="type"
          :clearable="false"
          :searchable="false"
          :reduce="type => type.code"
        ></v-select>
      </h2>
      <h2>
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
      </h2>
    </div>
    <v-btn @click="regenerate">Generate</v-btn>
  </v-container>
</template>

<script>
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import boardGenerator from "../scripts/BoardGenerator.js";

export default {
  name: "BingoBoard",
  components: {
    VueSlider,
    vSelect
  },
  data: () => {
    return {
      size: 5,
      difficulty: [1, 9],
      seed: "",
      lastSeed: "",
      objectives: [],
      types: [
        { label: "Bingo", code: "bingo" },
        { label: "Tic-Tac-Toe", code: "ttt" },
        { label: "Two by Two Block", code: "2x2" }
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
      if (typeP && this.types.map(type => type.code).includes(typeP)) {
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
      if (objective.state === "black") {
        objective.state = "green";
      } else if (objective.state === "green") {
        objective.state = "red";
      } else if (objective.state === "red") {
        objective.state = "black";
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
  border: 1px #424242 solid;
  box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.6);
  cursor: pointer;
  padding: 0 5px;
  text-align: center;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.black {
  background: #000;
}

.black:hover {
  background: #001a36;
  color: #fff;
}

.green {
  background: #051;
}

.green:hover {
  background: #072;
}

.red {
  background: #501;
}

.red:hover {
  background: #702;
}

#typeseed {
  display: flex;
  justify-content: space-between;
}

.slider {
  margin: 0px 10px 30px;
}

.select {
  width: 200px;
  display: inline-block;
}

.vs__selected {
  color: #bec7d2;
}

.input {
  width: 200px;
  display: inline-block;
}

.randombtn {
  display: inline-block;
}
</style>
