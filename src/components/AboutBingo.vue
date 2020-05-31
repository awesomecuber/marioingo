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

    <p style="font-weight:bolder">Individual Item Rules:</p>
    <ul>
      <li>
        Lose Marios Hat - your hat must be gone at the time the game is over.
      </li>
      <li>
        X Lives - Your number of lives must be at least X when the game is over.
      </li>
      <li>
        Win 3 Character Races - Koopa the Quick in BoB, Rematch with Koopa the
        Quick in THI, and Penguin Race in CCM. You must collect the stars as
        well.
      </li>
      <li>
        Defeat all 4 Bosses - Bobomb King, Whomp King, Hand Boss in SSL, Wiggler
      </li>
      <li>
        Peach's Slide x 2 - you must collect both stars from Peach's Slide.
      </li>
      <li>
        1 star from each course means the 15 main courses, not Bowser stages or
        secret stages.
      </li>
      <li>
        X coins in one stage - you must collect a star while carrying at least X
        coins.
      </li>
      <li>HMC stars - The metal cap stage does not count as an HMC star.</li>
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
      You can click on the squares to turn them green and red. This may help you
      organize your route planning.
    </p>

    <p>&nbsp;</p>
    <p>
      <span class="note right"
        >"New" SM64 Bingo by ArcaneZaros.<br />SRT Bingo v1 by Nmaster64 based
        on SRL Bingo v5 by NarcissaWright.</span
      >
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
