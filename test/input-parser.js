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

  t.same(new InputParser("/A1").darkMode, false, 'darkmode should be inactive');
  t.same(new InputParser("/@d").darkMode, true, 'darkmode should be active');
  t.same(new InputParser("/@zd").darkMode, true, 'darkmode should be active');
  t.same(new InputParser("/@dz").darkMode, true, 'darkmode should be active');
  t.same(new InputParser("/@d2").darkMode, true, 'darkmode should be active');
  t.same(new InputParser("/@2d").darkMode, true, 'darkmode should be active');

  t.same(new InputParser("/A1").gridOpacity, 1.0, 'grid should be opaque');
  
  t.same(new InputParser("/@h").gridOpacity, 0.5, 'grid should be half transparent');
  t.same(new InputParser("/@zh").gridOpacity, 0.5, 'grid should be half transparent');
  t.same(new InputParser("/@hz").gridOpacity, 0.5, 'grid should be half transparent');
  t.same(new InputParser("/@2h").gridOpacity, 0.5, 'grid should be half transparent');
  t.same(new InputParser("/@h2").gridOpacity, 0.5, 'grid should be half transparent');

  t.same(new InputParser("/@n").gridOpacity, 0.0, 'grid should be invisible');
  t.same(new InputParser("/@zn").gridOpacity, 0.0, 'grid should be invisible');
  t.same(new InputParser("/@nz").gridOpacity, 0.0, 'grid should be invisible');
  t.same(new InputParser("/@2n").gridOpacity, 0.0, 'grid should be invisible');
  t.same(new InputParser("/@n2").gridOpacity, 0.0, 'grid should be invisible');

  t.same(new InputParser("/@2").zoom, 2, 'zoom level should be 2');
  t.same(new InputParser("/@z2").zoom, 2, 'zoom level should be 2');
  t.same(new InputParser("/@2z").zoom, 2, 'zoom level should be 2');

  t.same(new InputParser("/@3").zoom, 3, 'zoom level should be 3');
  t.same(new InputParser("/@z3").zoom, 3, 'zoom level should be 3');
  t.same(new InputParser("/@3z").zoom, 3, 'zoom level should be 3');

  t.end();
});
