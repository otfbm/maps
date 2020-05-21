import tap from "tap";
import InputParser from "../input-parser.js";

tap.test("board parsing", (t) => {
  const defaultBoard = new InputParser({ "*": "" }, {}).board;
  t.same(defaultBoard, [10, 10]);

  const oneByOne = new InputParser({ "*": "1x1" }, {}).board;
  t.same(oneByOne, [1, 1]);
  t.end();
});

tap.test("token parsing", (t) => {
  const defaultTokens = new InputParser({ "*": "" }, {}).tokens;
  t.same(defaultTokens, [
    {
      name: "",
      position: [undefined, undefined],
      color: "",
      size: "medium",
    },
  ]);

  const withColor = new InputParser({ "*": "B2r" }, {}).tokens;
  t.same(withColor, [
    {
      name: "",
      position: ["B", "2"],
      color: "firebrick",
      size: "medium",
    },
  ]);

  const withName = new InputParser({ "*": "B2-Pizza" }, {}).tokens;
  t.same(withName, [
    {
      name: "Pizza",
      position: ["B", "2"],
      color: "",
      size: "medium",
    },
  ]);

  const withSize = new InputParser({ "*": "B2L" }, {}).tokens;
  t.same(withSize, [
    {
      name: "",
      position: ["B", "2"],
      color: "",
      size: "large",
    },
  ]);
  t.end();
});
