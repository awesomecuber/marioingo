export default {
  DEFAULT_SIZE: 5,
  MIN_SIZE: 3,
  MAX_SIZE: 8,
  MIN_DIFF: 1,
  MAX_DIFF: 9,
  MIN_DIFF_DIFFERENCE: 3,
  DEFAULT_TYPE: "bingo",
  TYPES: [
    { text: "Bingo", value: "bingo" },
    { text: "Tic-Tac-Toe", value: "ttt" },
    { text: "Two by Two Block", value: "2x2" }
  ],
  SOCKET_URL:
    process.env.NODE_ENV === "production"
      ? "https://great-dalmuti-socket.herokuapp.com/"
      : "http://localhost:3000/"
};
