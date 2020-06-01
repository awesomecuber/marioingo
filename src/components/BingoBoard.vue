<template>
  <div>
    <div id="table" :style="[gridStyle]">
      <div class="margin">TL-BR</div>
      <div v-for="col in objectives.length" :key="col" class="margin">
        COL{{ col }}
      </div>
      <template v-for="row in objectives.length">
        <div :key="'row' + row" class="margin">ROW{{ row }}</div>
        <div
          v-for="col in objectives.length"
          :key="row + '' + col"
          class="item"
        >
          {{ objectives[row - 1][col - 1].name }}
        </div>
      </template>
      <div class="margin">BL-TR</div>
    </div>
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
          v-model="selectedType"
          :clearable="false"
          :reduce="selectedType => selectedType.code"
        ></v-select>
      </h2>
      <h2>
        Seed: <input v-model="seed" maxlength="8" />
        <button @click="seed = generateSeed()">
          Random
        </button>
      </h2>
    </div>
    <button @click="regenerate">Generate</button>
  </div>
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
    let size = 6;
    let difficulty = [1, 9];
    let selectedType = "bingo";
    let seed = Math.floor(Math.random() * 100000);
    let objectives = boardGenerator(
      size,
      difficulty[0],
      difficulty[1],
      seed,
      selectedType
    );
    return {
      size,
      difficulty,
      seed,
      lastSeed: seed,
      objectives,
      types: [
        { label: "Bingo", code: "bingo" },
        { label: "Tic-Tac-Toe", code: "ttt" },
        { label: "Two by Two Block", code: "2x2" }
      ],
      selectedType
    };
  },
  computed: {
    gridStyle: function() {
      return {
        gridTemplateColumns: `1fr repeat(${this.objectives.length},
                              ${12 / this.objectives.length}fr)`,
        gridTemplateRows: `1fr repeat(${this.objectives.length},
                           ${12 / this.objectives.length}fr) 1fr`
      };
    }
  },
  methods: {
    generateSeed: function() {
      return Math.floor(Math.random() * 100000);
    },
    regenerate: function() {
      if (this.seed === this.lastSeed) {
        this.seed = this.generateSeed();
      }
      this.lastSeed = this.seed;

      this.objectives = boardGenerator(
        this.size,
        this.difficulty[0],
        this.difficulty[1],
        this.seed,
        this.selectedType
      );
    }
  }
};
</script>

<style>
#table {
  margin-top: 16px;
  margin-right: 8px;
  text-align: center;
  height: 650px;
  display: grid;
}

#table > div {
  cursor: pointer;
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
  background: #000;
  border: 1px #424242 solid;
  box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.6);
  cursor: pointer;
  padding: 0 5px;
  text-align: center;
}

.margin:hover {
  background: #1448b3;
  color: #fff;
}

.item:hover {
  background: #001a36;
  color: #fff;
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

input {
  width: 110px;
}

button {
  display: inline-block;
  cursor: pointer;
  font-weight: bold;
  text-shadow: black 1px 1px 1px;
  color: white;
  margin: 4px 2px 4px 6px;
  text-decoration: none;
  padding: 4px 18px;
  text-align: center;
  -moz-border-radius: 15px;
  border-radius: 15px;
  border-left: 2px solid #2339a4;
  border-right: 2px solid #1a2a88;
  border-top: 2px solid #244ca6;
  border-bottom: 2px solid #192686;
  background-color: #1e3294;
  background: -moz-linear-gradient(top, #2045c0 0%, #1e3294 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#2045c0', endColorstr='#1e3294',GradientType=0 );
}
</style>
