import tap from "tap";
import InputParser from "../input-parser.js";

const clone = (item) => JSON.parse(JSON.stringify(item));

tap.test("board parsing", (t) => {
  t.same(new InputParser("").board, { width: 10, height: 10 });
  t.same(new InputParser("1x1").board, { width: 1, height: 1 });
  t.same(new InputParser("/1x1").board, { width: 1, height: 1 });
  t.same(new InputParser("/1x1/").board, { width: 1, height: 1 });
  t.end();
});

tap.test("token parsing", (t) => {
  t.same(clone(new InputParser("").tokens), [], 'default tokens should match');
  t.same(clone(new InputParser("/").tokens), [], 'default tokens should match');
  t.same(clone(new InputParser("/5x5").tokens), [], 'default tokens should match');
  t.same(clone(new InputParser("/7x7/").tokens), [], 'default tokens should match');
  t.same(clone(new InputParser("6x6/B2").tokens), [
    {
      x: 2,
      y: 2,
      item: {
        name: "",
        color: "black",
        size: 0.5,
        offset: 0.5,
      }
    },
  ], 'basic tokens should match');

  t.same(clone(new InputParser("/6x6/B2").tokens), [
    {
      x: 2,
      y: 2,
      item: {
        name: "",
        color: "black",
        size: 0.5,
        offset: 0.5,
      }
    },
  ], 'basic tokens should match');

  t.same(clone(new InputParser("/B2").tokens), [
    {
      x: 2,
      y: 2,
      item: {
        name: "",
        color: "black",
        size: 0.5,
        offset: 0.5,
      }
    },
  ], 'basic tokens should match');

  t.same(clone(new InputParser("/B2/C3").tokens), [
    {
      x: 2,
      y: 2,
      item: {
        name: "",
        color: "black",
        size: 0.5,
        offset: 0.5,
      }
    },
    {
      x: 3,
      y: 3,
      item: {
        name: "",
        color: "black",
        size: 0.5,
        offset: 0.5,
      }
    },
  ], 'multiple basic tokens should match');

  t.same(clone(new InputParser("/B2r").tokens), [
    {
      x: 2,
      y: 2,
      item: {
        name: "",
        color: "firebrick",
        size: 0.5,
        offset: 0.5,
      }
    },
  ], 'tokens with color should match');

  t.same(clone(new InputParser("/B2-Pizza").tokens), [
    {
      x: 2,
      y: 2,
      item: {
        name: "Pizza",
        color: "black",
        size: 0.5,
        offset: 0.5,
      }
    },
  ], 'tokens with names should match');

  t.same(clone(new InputParser("/B2L").tokens), [
    {
      x: 2,
      y: 2,
      item: {
        name: "",
        color: "black",
        size: 1,
        offset: 1,
      }
    },
  ], 'tokens with size should match');

  t.same(clone(new InputParser("/A1-ZOM1").tokens), [
    {
      x: 1,
      y: 1,
      item: {
        name: "ZOM1",
        color: "black",
        size: 0.5,
        offset: 0.5,
      }
    },
  ], 'tokens with size should match');

  t.same(clone(new InputParser("/A1-9ZOM1").tokens), [
    {
      x: 1,
      y: 1,
      item: {
        name: "9ZOM1",
        color: "black",
        size: 0.5,
        offset: 0.5,
      }
    },
  ], 'tokens with size should match');

  t.same(clone(new InputParser("/A1-123456").tokens), [
    {
      x: 1,
      y: 1,
      item: {
        name: "123456",
        color: "black",
        size: 0.5,
        offset: 0.5,
      }
    },
  ], 'tokens with size should match');

  t.same(clone(new InputParser("/opt=d").options), {
      darkMode: true,
      gridOpacity: 1.0
  }, 'tokens with size should match');

  t.same(clone(new InputParser("/opt=gh").options), {
    darkMode: false,
    gridOpacity: 0.5
  }, 'tokens with size should match');

  t.same(clone(new InputParser("/opt=g0").options), {
    darkMode: false,
    gridOpacity: 0.0
  }, 'tokens with size should match');

  t.same(clone(new InputParser("/opt=dg0").options), {
    darkMode: true,
    gridOpacity: 0.0
  }, 'tokens with size should match');
  t.end();
});
