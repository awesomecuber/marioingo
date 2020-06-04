<template>
  <v-container fluid id="app">
    <v-row no-gutters justify="center">
      <v-col :xl="5" :lg="6" :md="8" :sm="12">
        <bingo-board class="board" />
      </v-col>
      <v-col :xl="2" :md="4" :sm="12">
        <bingo-sidebar class="about" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BingoSidebar from "../components/BingoSidebar.vue";
import BingoBoard from "../components/BingoBoard.vue";

export default {
  name: "App",
  components: {
    BingoSidebar,
    BingoBoard
  }
};
</script>

<style>
#app {
  line-height: 18px;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 0.9em;
  font-weight: 400;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.3);
}
</style>
