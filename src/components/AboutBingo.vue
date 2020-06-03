<template>
  <div id="about_bingo">
    <h2>About Super Mario 64 Bingo</h2>
    <p>This is a bingo board for Super Mario 64.</p>

    <ul style="font-weight:bold;">
      <li>Start from a new file and reset on GO!</li>
      <li>
        You are done when you collect the final bowser star to beat the game,
        with all 5 objectives completed.
      </li>
      <li>
        LBLJ and SBLJ are *NOT* allowed. Mips Clip and other BLJs are allowed.
      </li>
      <li>
        Be careful when choosing a route to make sure you get all stars you will
        need. For example, to do "All Stars in WDW" you will want to get the
        vanish cap.
      </li>
    </ul>

    <h2>About Video Game Bingo</h2>
    <p>
      To win a "Bingo" race, you must complete 5 of the tasks in a row
      horizontally, vertically, or diagonally.
    </p>
    <p>
      The seed number is used to generate the board. Changing the seed will make
      a new board.
    </p>
    <p>
      You can right click on the squares to turn them red. This may help you
      organize your route planning.
    </p>

    <p>
      <span class="note right">
        Marioingo by Nicolas Brassard based on SRT Bingo v1 by Nmaster64 based
        on SRL Bingo v5 by NarcissaWright.
      </span>
    </p>
  </div>
</template>

<script>
export default {};
</script>

<style>
h2 {
  clear: both;
  color: #f7e279;
  display: block;
  font-size: 100%;
  font-weight: 700;
  margin: 20px 0 8px;
}

p {
  margin: 0;
  padding: 0 0 8px;
}

ul {
  margin-left: 0;
  margin-top: 2px;
  padding-left: 1em;
  text-indent: -1em;
}

ul li {
  list-style-position: inside;
  list-style-type: square;
  padding-bottom: 10px;
}

.note {
  color: gray;
  font-size: 11px;
  font-style: italic;
  line-height: 12px;
  display: block;
  padding-top: 3px;
  padding-bottom: 3px;
}
</style>
