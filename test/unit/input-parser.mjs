import tap from "tap";
import InputParser from "../../input-parser.js";
import Options from '../../options.js';

const clone = (item) => JSON.parse(JSON.stringify(item));

tap.test("view parsing", async (t) => {
  const options = new Options();  
  let input = new InputParser();
  await input.parse(options, '');
  t.same(options.view, { width: 10, height: 10, panX: 0, panY: 0 });
  
  input = new InputParser();
  await input.parse(options, "1x1");
  t.same(options.view, { width: 1, height: 1, panX: 0, panY: 0 });

  input = new InputParser();
  await input.parse(options, "/1x1");
  t.same(options.view, { width: 1, height: 1, panX: 0, panY: 0 });
  
  input = new InputParser();
  await input.parse(options, "/1x1/");
  t.same(options.view, { width: 1, height: 1, panX: 0, panY: 0 });

  input = new InputParser();
  await input.parse(options, "b2:2x3");
  t.same(options.view, { width: 2, height: 3, panX: 1, panY: 1 });

  input = new InputParser();
  await input.parse(options, "c3:e8");
  t.same(options.view, { width: 3, height: 6, panX: 2, panY: 2 });
  t.end();
});

tap.test("token parsing", async (t) => {
  const options = new Options();  
  let input = new InputParser()
  await input.parse(options, "");
  t.same(clone(input.tokens), [], "default tokens should match");

  input = new InputParser();
  await input.parse(options, "/");
  t.same(clone(input.tokens), [], "default tokens should match");

  input = new InputParser();
  await input.parse(options, "/5x5");
  t.same(clone(input.tokens), [], "default tokens should match");
  
  input = new InputParser();
  await input.parse(options, "/7x7/");
  t.same(clone(input.tokens), [], "default tokens should match");
  
  input = new InputParser();
  await input.parse(options, "6x6/B2");
  t.same(
    clone(input.tokens),
    [
      {
        tl: "B2",
        br: "B2",
        type: "token",
        label: "",
        color: "#07031a",
        size: "medium",
        imageCode: null,
      },
    ],
    "basic tokens should match"
  );

  input = new InputParser();
  await input.parse(options, "/6x6/B2");
  t.same(
    clone(input.tokens),
    [
      {
        tl: "B2",
        br: "B2",
        type: "token",
        label: "",
        color: "#07031a",
        size: "medium",
        imageCode: null,
      },
    ],
    "basic tokens should match"
  );

  input = new InputParser();
  await input.parse(options, "/B2");
  t.same(
    clone(input.tokens),
    [
      {
        tl: "B2",
        br: "B2",
        type: "token",
        label: "",
        color: "#07031a",
        size: "medium",
        imageCode: null,
      },
    ],
    "basic tokens should match"
  );

  input = new InputParser();
  await input.parse(options, "/B2/C3");
  t.same(
    clone(input.tokens),
    [
      {
        tl: "B2",
        br: "B2",
        type: "token",
        label: "",
        color: "#07031a",
        size: "medium",
        imageCode: null,
      },
      {
        tl: "C3",
        br: "C3",
        type: "token",
        label: "",
        color: "#07031a",
        size: "medium",
        imageCode: null,
      },
    ],
    "multiple basic tokens should match"
  );

  input = new InputParser();
  await input.parse(options, "/B2r");
  t.same(
    clone(input.tokens),
    [
      {
        tl: "B2",
        br: "B2",
        type: "token",
        label: "",
        color: "#e63c3c",
        size: "medium",
        imageCode: null,
      },
    ],
    "tokens with color should match"
  );

  input = new InputParser();
  await input.parse(options, "/B2-Pizza");
  t.same(
    clone(input.tokens),
    [
      {
        tl: "B2",
        br: "B2",
        type: "token",
        label: "Pizza",
        color: "#07031a",
        size: "medium",
        imageCode: null,
      },
    ],
    "tokens with names should match"
  );

  input = new InputParser();
  await input.parse(options, "/B2L");
  t.same(
    clone(input.tokens),
    [
      {
        tl: "B2",
        br: "B2",
        type: "token",
        label: "",
        color: "#07031a",
        size: "large",
        imageCode: null,
      },
    ],
    "tokens with size should match"
  );

  input = new InputParser();
  await input.parse(options, "/A1-ZOM1");
  t.same(
    clone(input.tokens),
    [
      {
        tl: "A1",
        br: "A1",
        type: "token",
        label: "ZOM1",
        color: "#07031a",
        size: "medium",
        imageCode: null,
      },
    ],
    "tokens with size should match"
  );

  input = new InputParser();
  await input.parse(options, "/A1-9ZOM1");
  t.same(
    clone(input.tokens),
    [
      {
        tl: "A1",
        br: "A1",
        type: "token",
        label: "9ZOM1",
        color: "#07031a",
        size: "medium",
        imageCode: null,
      },
    ],
    "tokens with size should match"
  );

  input = new InputParser();
  await input.parse(options, "/A1-123456");
  t.same(
    clone(input.tokens),
    [
      {
        tl: "A1",
        br: "A1",
        type: "token",
        label: "123456",
        color: "#07031a",
        size: "medium",
        imageCode: null,
      },
    ],
    "tokens with size should match"
  );

  input = new InputParser();
  await input.parse(options, "/A1");
  t.same(options.darkMode, false, "darkmode should be inactive");

  input = new InputParser();
  await input.parse(options, "/@d");
  t.same(options.darkMode, true, "darkmode should be active");

  input = new InputParser();
  await input.parse(options, "/@zd");
  t.same(options.darkMode, true, "darkmode should be active");

  input = new InputParser();
  await input.parse(options, "/@dz");
  t.same(options.darkMode, true, "darkmode should be active");

  input = new InputParser();
  await input.parse(options, "/@d2");
  t.same(options.darkMode, true, "darkmode should be active");

  input = new InputParser();
  await input.parse(options, "/@2d");
  t.same(options.darkMode, true, "darkmode should be active");

  input = new InputParser();
  await input.parse(options, "/A1");
  t.same(options.gridOpacity, 0.5, "grid should be visible");

  input = new InputParser();
  await input.parse(options, "/@h");
  t.same(
    options.gridOpacity,
    0.25,
    "grid should be half transparent"
  );

  input = new InputParser();
  await input.parse(options, "/@zh");
  t.same(
    options.gridOpacity,
    0.25,
    "grid should be half transparent"
  );

  input = new InputParser();
  await input.parse(options, "/@hz");
  t.same(
    options.gridOpacity,
    0.25,
    "grid should be half transparent"
  );

  input = new InputParser();
  await input.parse(options, "/@2h");
  t.same(
    options.gridOpacity,
    0.25,
    "grid should be half transparent"
  );

  input = new InputParser();
  await input.parse(options, "/@h10");
  t.same(
    options.gridOpacity,
    0.1,
    "grid should be 10% transparent"
  );

  input = new InputParser();
  await input.parse(options, "/@n");
  t.same(options.gridOpacity, 0.0, "grid should be invisible");

  input = new InputParser();
  await input.parse(options, "/@zn");
  t.same(options.gridOpacity, 0.0, "grid should be invisible");

  input = new InputParser();
  await input.parse(options, "/@nz");
  t.same(options.gridOpacity, 0.0, "grid should be invisible");

  input = new InputParser();
  await input.parse(options, "/@2n");
  t.same(options.gridOpacity, 0.0, "grid should be invisible");

  input = new InputParser();
  await input.parse(options, "/@n2");
  t.same(options.gridOpacity, 0.0, "grid should be invisible");

  input = new InputParser();
  await input.parse(options, "/@2");
  t.same(options.zoom, 2, "zoom level should be 2");

  input = new InputParser();
  await input.parse(options, "/@z2");
  t.same(options.zoom, 2, "zoom level should be 2");

  input = new InputParser();
  await input.parse(options, "/@2z");
  t.same(options.zoom, 2, "zoom level should be 2");
  
  input = new InputParser();
  await input.parse(options, "/@3");
  t.same(options.zoom, 3, "zoom level should be 3");

  input = new InputParser();
  await input.parse(options, "/@z3");
  t.same(options.zoom, 3, "zoom level should be 3");

  input = new InputParser();
  await input.parse(options, "/@3z");
  t.same(options.zoom, 3, "zoom level should be 3");

  t.end();
});
