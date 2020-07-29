import tap from "tap";
import InputParser from "../input-parser.js";

const clone = (item) => JSON.parse(JSON.stringify(item));

tap.test("board parsing", async (t) => {
  let input = new InputParser();
  await input.parse('');
  t.same(input.board, { width: 10, height: 10 });
  
  input = new InputParser();
  await input.parse("1x1");
  t.same(input.board, { width: 1, height: 1 });

  input = new InputParser();
  await input.parse("/1x1");
  t.same(input.board, { width: 1, height: 1 });
  
  input = new InputParser();
  await input.parse("/1x1/");
  t.same(input.board, { width: 1, height: 1 });
  t.end();
});

tap.test("token parsing", async (t) => {
  let input = new InputParser()
  await input.parse("");
  t.same(clone(input.tokens), [], "default tokens should match");

  input = new InputParser();
  await input.parse("/");
  t.same(clone(input.tokens), [], "default tokens should match");

  input = new InputParser();
  await input.parse("/5x5");
  t.same(clone(input.tokens), [], "default tokens should match");
  
  input = new InputParser();
  await input.parse("/7x7/");
  t.same(clone(input.tokens), [], "default tokens should match");
  
  input = new InputParser();
  await input.parse("6x6/B2");
  t.same(
    clone(input.tokens),
    [
      {
        tl: "B2",
        br: "B2",
        type: "token",
        label: "",
        color: "black",
        size: "medium",
      },
    ],
    "basic tokens should match"
  );

  input = new InputParser();
  await input.parse("/6x6/B2");
  t.same(
    clone(input.tokens),
    [
      {
        tl: "B2",
        br: "B2",
        type: "token",
        label: "",
        color: "black",
        size: "medium",
      },
    ],
    "basic tokens should match"
  );

  input = new InputParser();
  await input.parse("/B2");
  t.same(
    clone(input.tokens),
    [
      {
        tl: "B2",
        br: "B2",
        type: "token",
        label: "",
        color: "black",
        size: "medium",
      },
    ],
    "basic tokens should match"
  );

  input = new InputParser();
  await input.parse("/B2/C3");
  t.same(
    clone(input.tokens),
    [
      {
        tl: "B2",
        br: "B2",
        type: "token",
        label: "",
        color: "black",
        size: "medium",
      },
      {
        tl: "C3",
        br: "C3",
        type: "token",
        label: "",
        color: "black",
        size: "medium",
      },
    ],
    "multiple basic tokens should match"
  );

  input = new InputParser();
  await input.parse("/B2r");
  t.same(
    clone(input.tokens),
    [
      {
        tl: "B2",
        br: "B2",
        type: "token",
        label: "",
        color: "firebrick",
        size: "medium",
      },
    ],
    "tokens with color should match"
  );

  input = new InputParser();
  await input.parse("/B2-Pizza");
  t.same(
    clone(input.tokens),
    [
      {
        tl: "B2",
        br: "B2",
        type: "token",
        label: "Pizza",
        color: "black",
        size: "medium",
      },
    ],
    "tokens with names should match"
  );

  input = new InputParser();
  await input.parse("/B2L");
  t.same(
    clone(input.tokens),
    [
      {
        tl: "B2",
        br: "B2",
        type: "token",
        label: "",
        color: "black",
        size: "large",
      },
    ],
    "tokens with size should match"
  );

  input = new InputParser();
  await input.parse("/A1-ZOM1");
  t.same(
    clone(input.tokens),
    [
      {
        tl: "A1",
        br: "A1",
        type: "token",
        label: "ZOM1",
        color: "black",
        size: "medium",
      },
    ],
    "tokens with size should match"
  );

  input = new InputParser();
  await input.parse("/A1-9ZOM1");
  t.same(
    clone(input.tokens),
    [
      {
        tl: "A1",
        br: "A1",
        type: "token",
        label: "9ZOM1",
        color: "black",
        size: "medium",
      },
    ],
    "tokens with size should match"
  );

  input = new InputParser();
  await input.parse("/A1-123456");
  t.same(
    clone(input.tokens),
    [
      {
        tl: "A1",
        br: "A1",
        type: "token",
        label: "123456",
        color: "black",
        size: "medium",
      },
    ],
    "tokens with size should match"
  );

  input = new InputParser();
  await input.parse("/A1");
  t.same(input.darkMode, false, "darkmode should be inactive");

  input = new InputParser();
  await input.parse("/@d");
  t.same(input.darkMode, true, "darkmode should be active");

  input = new InputParser();
  await input.parse("/@zd");
  t.same(input.darkMode, true, "darkmode should be active");

  input = new InputParser();
  await input.parse("/@dz");
  t.same(input.darkMode, true, "darkmode should be active");

  input = new InputParser();
  await input.parse("/@d2");
  t.same(input.darkMode, true, "darkmode should be active");

  input = new InputParser();
  await input.parse("/@2d");
  t.same(input.darkMode, true, "darkmode should be active");

  input = new InputParser();
  await input.parse("/A1");
  t.same(input.gridOpacity, 1.0, "grid should be opaque");

  input = new InputParser();
  await input.parse("/@h");
  t.same(
    input.gridOpacity,
    0.5,
    "grid should be half transparent"
  );

  input = new InputParser();
  await input.parse("/@zh");
  t.same(
    input.gridOpacity,
    0.5,
    "grid should be half transparent"
  );

  input = new InputParser();
  await input.parse("/@hz");
  t.same(
    input.gridOpacity,
    0.5,
    "grid should be half transparent"
  );

  input = new InputParser();
  await input.parse("/@2h");
  t.same(
    input.gridOpacity,
    0.5,
    "grid should be half transparent"
  );

  input = new InputParser();
  await input.parse("/@h2");
  t.same(
    input.gridOpacity,
    0.5,
    "grid should be half transparent"
  );

  input = new InputParser();
  await input.parse("/@n");
  t.same(input.gridOpacity, 0.0, "grid should be invisible");

  input = new InputParser();
  await input.parse("/@zn");
  t.same(input.gridOpacity, 0.0, "grid should be invisible");

  input = new InputParser();
  await input.parse("/@nz");
  t.same(input.gridOpacity, 0.0, "grid should be invisible");

  input = new InputParser();
  await input.parse("/@2n");
  t.same(input.gridOpacity, 0.0, "grid should be invisible");

  input = new InputParser();
  await input.parse("/@n2");
  t.same(input.gridOpacity, 0.0, "grid should be invisible");

  input = new InputParser();
  await input.parse("/@2");
  t.same(input.zoom, 2, "zoom level should be 2");

  input = new InputParser();
  await input.parse("/@z2");
  t.same(input.zoom, 2, "zoom level should be 2");

  input = new InputParser();
  await input.parse("/@2z");
  t.same(input.zoom, 2, "zoom level should be 2");
  
  input = new InputParser();
  await input.parse("/@3");
  t.same(input.zoom, 3, "zoom level should be 3");

  input = new InputParser();
  await input.parse("/@z3");
  t.same(input.zoom, 3, "zoom level should be 3");

  input = new InputParser();
  await input.parse("/@3z");
  t.same(input.zoom, 3, "zoom level should be 3");

  t.end();
});
