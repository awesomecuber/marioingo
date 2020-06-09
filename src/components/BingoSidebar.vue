<template>
  <v-container id="about_bingo">
    <template v-if="!inMulti">
      <v-btn class="mb-3" color="blue" @click="createRoom"
        >Create Multi Room</v-btn
      >
      <v-text-field dense label="Code" v-model="code" maxlength="4">
        <template v-slot:append>
          <v-btn text @click="joinRoom">
            Join
          </v-btn>
        </template>
      </v-text-field>
    </template>

    <template v-else>
      <v-btn class="mb-3" color="blue" @click="leaveRoom">Leave Room</v-btn>
      <h2 class="mb-2">
        Room Code: <span class="title">{{ $route.query.room }}</span>
      </h2>
      <v-row no-gutters>
        <v-col
          class="bcol"
          :class="{ selected: colors[colorIndex - 1] === selectedColor }"
          :col="6"
          v-for="colorIndex in 4"
          :key="colorIndex - 1"
        >
          <v-btn
            :color="colors[colorIndex - 1]"
            class="button"
            @click="changeColor(colors[colorIndex - 1])"
          ></v-btn>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col
          class="bcol"
          :class="{ selected: colors[colorIndex + 3] === selectedColor }"
          :col="6"
          v-for="colorIndex in 4"
          :key="colorIndex + 3"
        >
          <v-btn
            :color="colors[colorIndex + 3]"
            class="button"
            @click="changeColor(colors[colorIndex + 3])"
          ></v-btn>
        </v-col>
      </v-row>
    </template>
    <br />
    <h2>About Super Mario 64 Bingo</h2>
    <p>This is a bingo board for Super Mario 64.</p>

    <ul>
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
      (only in single player for now) You can right click on the squares to turn
      them red. This may help you organize your route planning.
    </p>

    <p>
      <span class="note right">
        Marioingo by Nicolas Brassard based on SRT Bingo v1 by Nmaster64 based
        on SRL Bingo v5 by NarcissaWright.
      </span>
    </p>
  </v-container>
</template>

<script>
import BingoConstants from "../scripts/config.js";
import axios from "axios";

export default {
  name: "BingoSidebar",
  data: () => {
    return {
      code: "",
      colors: [
        "red",
        "purple",
        "indigo",
        "light-blue",
        "teal",
        "light-green",
        "yellow",
        "orange"
      ],
      selectedColor: "red"
    };
  },
  computed: {
    inMulti: function() {
      return this.$route.query.room;
    }
  },
  methods: {
    createRoom: function() {
      axios
        .post(BingoConstants.SOCKET_URL + "addRoom", {
          board: {
            size: Number(this.$route.query.size),
            minDiff: Number(this.$route.query.minDiff),
            maxDiff: Number(this.$route.query.maxDiff),
            seed: this.$route.query.seed,
            type: this.$route.query.type
          }
        })
        .then(res => {
          this.$router.replace({
            query: {
              room: res.data
            }
          });
        });
    },
    leaveRoom: function() {
      this.$socket.emit("leaveroom", localStorage.uid);
      this.$router.replace({});
    },
    joinRoom: function() {
      // todo: add proper validation
      if (this.code.length === 4) {
        axios
          .get(BingoConstants.SOCKET_URL + "rooms")
          .then(res => res.data)
          .then(rooms => {
            if (rooms.includes(this.code)) {
              this.$router.replace({
                query: {
                  room: this.code
                }
              });
            }
            this.code = "";
          });
      } else {
        this.code = "";
      }
    },
    changeColor: function(color) {
      if (color !== this.selectedColor) {
        this.selectedColor = color;
        this.$socket.emit("changecolor", localStorage.uid, color);
      }
    }
  },
  sockets: {
    color_select: function(color) {
      this.selectedColor = color;
    }
  }
};
</script>

<style>
.bcol {
  border: 2px black solid;
  border-radius: 6px;
}

.selected {
  border: 2px white solid;
  border-radius: 6px;
}

.button {
  width: 100%;
}

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
