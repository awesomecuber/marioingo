<template>
  <div id="app">
    <bingo-board class="board" />
    <!-- <about-bingo class="about" /> -->
  </div>
</template>

<script>
import AboutBingo from "../components/AboutBingo.vue";
import BingoBoard from "../components/BingoBoard.vue";

export default {
  name: "App",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    AboutBingo,
    BingoBoard
  }
};
</script>

<style>
body {
  background: #111;
  margin: 0;
  padding: 0;
}

#app {
  height: 100%;
  line-height: 15px;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 0.9em;
  font-weight: 400;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.3);
  color: #bec7d2;
  margin: 0 auto;
  padding: 8px 0 8px 16px;
}

/* .about {
  float: right;
  width: 330px;
}

.board {
  float: left;
  margin-right: 16px;
  width: 650px;
} */
.about {
  width: 330px;
}
</style>
