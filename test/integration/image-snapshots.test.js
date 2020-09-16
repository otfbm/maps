const drawCanvas = require("../../draw-canvas");
const { toMatchImageSnapshot } = require("jest-image-snapshot");

expect.extend({ toMatchImageSnapshot });

test("tokens", async () => {
  const tokens = [
    "A1T",
    "B1Tp",
    "C1Tc-Goblin1",
    "D1",
    "E1r",
    "F1y-Goblin1",
    "G1c-Goblin1",
    "H1r-Goblin1",
    "I1r-Goblin1",
    "J1p-Goblin1",
    "A2L",
    "C2Lb",
    "E2lg-Goblin1",
    "A4H",
    "D4Hp",
    "G4Hp-Goblin1",
    "A7G",
    "E7Gr-Goblin1",
  ];
  const canvas = await drawCanvas(`/${tokens.join("/")}`, {}, false);
  expect(canvas.toBuffer("image/png")).toMatchImageSnapshot();
});

test("overlays", async () => {
  const overlays = ["A1$T", "B1$P", "C1$p", "D1$S", "E1$F", "F1$O", "G1$o"];
  const canvas = await drawCanvas(`/${overlays.join("/")}`, {}, false);
  expect(canvas.toBuffer("image/png")).toMatchImageSnapshot();
});

test("walls", async () => {
  const walls =
    "_H2J2J7A7A1H1_E1E4-dD4A4_B1B2-oA2_H1H4-dG4E4_D4-bD5D7_D5-bE5F5F7_F5-dG5H5H7_H5I5-oJ5_I3I4H4";
  const canvas = await drawCanvas(`/${walls}`, {}, false);
  expect(canvas.toBuffer("image/png")).toMatchImageSnapshot();
});

test("effects", async () => {
  const effects = ["*s15cc1c5", "*c20rh3", "*l40,2ya6j6", "*t15f10f3"];
  const canvas = await drawCanvas(`/${effects.join("/")}`, {}, false);
  expect(canvas.toBuffer("image/png")).toMatchImageSnapshot();
});

test("background", async () => {
  const bg =
    "https://cdn.discordapp.com/attachments/687568111498821642/714239512741412974/battlemap-3.png";
  const canvas = await drawCanvas(`/24x17`, { bg }, false);
  expect(canvas.toBuffer("image/png")).toMatchImageSnapshot();
});

test("settings: dark mode", async () => {
  const canvas = await drawCanvas(`/@d`, {}, false);
  expect(canvas.toBuffer("image/png")).toMatchImageSnapshot();
});

test("settings: zoom: 2", async () => {
  const canvas = await drawCanvas(`/@2`, {}, false);
  expect(canvas.toBuffer("image/png")).toMatchImageSnapshot();
});

test("settings: zoom: 3", async () => {
  const canvas = await drawCanvas(`/@3`, {}, false);
  expect(canvas.toBuffer("image/png")).toMatchImageSnapshot();
});

test("settings: grid transparency: half", async () => {
  const canvas = await drawCanvas(`/@h`, {}, false);
  expect(canvas.toBuffer("image/png")).toMatchImageSnapshot();
});

test("settings: grid transparency: no grid", async () => {
  const canvas = await drawCanvas(`/@n`, {}, false);
  expect(canvas.toBuffer("image/png")).toMatchImageSnapshot();
});

test("complex: multiple features 1", async () => {
  const tokens = [
    "A1T",
    "B1Tp",
    "C1Tc-Goblin1",
    "D1",
    "E1r",
    "F1y-Goblin1",
    "G1c-Goblin1",
    "H1r-Goblin1",
    "I1g-Goblin1",
    "J1p-Goblin1",
    "A2L",
    "C2lb",
    "E2Lg-Goblin1",
    "A4H",
    "D4Hp",
    "G4Hp-Goblin1",
    "A7G",
    "E7Gr-Goblin1",
  ];
  const bg =
    "https://cdn.discordapp.com/attachments/687568111498821642/714239512741412974/battlemap-3.png";
  const settings = "@2dn";
  const canvas = await drawCanvas(`/${tokens.join("/")}/${settings}`, { bg }, false);
  expect(canvas.toBuffer("image/png")).toMatchImageSnapshot();
});

test("complex: multiple features 2", async () => {
  const tokens = [
    "A1T",
    "B1Tp",
    "C1Tc-Goblin1",
    "D1",
    "E1r",
    "F1y-Goblin1",
    "G1c-Goblin1",
    "H1r-Goblin1",
    "I1g-Goblin1",
    "J1p-Goblin1",
    "A2L",
    "C2lb",
    "E2lg-Goblin1",
    "A4H",
    "D4Hp",
    "G4Hp-Goblin1",
    "A7G",
    "E7Gr-Goblin1",
  ];
  const bg =
    "https://cdn.discordapp.com/attachments/687568111498821642/714239512741412974/battlemap-3.png";
  const settings = "@3h";
  const canvas = await drawCanvas(`/${tokens.join("/")}/${settings}`, { bg }, false);
  expect(canvas.toBuffer("image/png")).toMatchImageSnapshot();
});

test("dotted lines: top right -> right & bottom left -> left", async () => {
  const bg =
    "https://cdn.discordapp.com/attachments/687568111498821642/714239512741412974/battlemap-3.png";
  const canvas = await drawCanvas(`/`, { bg }, false);
  expect(canvas.toBuffer("image/png")).toMatchImageSnapshot();
});

test("dotted lines: top right -> right & bottom left -> left", async () => {
  const bg =
    "https://cdn.discordapp.com/attachments/687568111498821642/714239512741412974/battlemap-3.png";
    const canvas = await drawCanvas(`/`, { bg }, false);
  expect(canvas.toBuffer("image/png")).toMatchImageSnapshot();
});

test("dotted lines: top right -> up (pan) & bottom left -> left (pan)", async () => {
  const bg =
    "https://cdn.discordapp.com/attachments/687568111498821642/714239512741412974/battlemap-3.png";
  const canvas = await drawCanvas(`/o8:10x10`, { bg }, false);
  expect(canvas.toBuffer("image/png")).toMatchImageSnapshot();
});

test("dotted lines: pan x only", async () => {
  const bg =
    "https://cdn.discordapp.com/attachments/687568111498821642/714239512741412974/battlemap-3.png";
  const canvas = await drawCanvas(`/c1:10x10`, { bg }, false);
  expect(canvas.toBuffer("image/png")).toMatchImageSnapshot();
}, 10000);

test("dotted lines: pan x only - to the end", async () => {
  const bg =
    "https://cdn.discordapp.com/attachments/687568111498821642/714239512741412974/battlemap-3.png";
  const canvas = await drawCanvas(`/q1:10x10`, { bg }, false);
  expect(canvas.toBuffer("image/png")).toMatchImageSnapshot();
});

test("dotted lines: pan y only", async () => {
  const bg =
    "https://cdn.discordapp.com/attachments/687568111498821642/714239512741412974/battlemap-3.png";
  const canvas = await drawCanvas(`/a7:10x10`, { bg }, false);
  expect(canvas.toBuffer("image/png")).toMatchImageSnapshot();
});

test("edge case: border between z and aa", async () => {
  const canvas = await drawCanvas(`/x1:5x5/z1/aa1`, {}, false);
  expect(canvas.toBuffer("image/png")).toMatchImageSnapshot();
});

test("edge case: border between az and ba", async () => {
  const canvas = await drawCanvas(`/ax1:5x5/az1/ba1`, {}, false);
  expect(canvas.toBuffer("image/png")).toMatchImageSnapshot();
});

test("edge cases: overlays", async () => {
  const overlays = ["aa1$T", "ab1$P", "ac1$p", "ad1$S", "ae1$F", "af1$O", "ag1$o"];
  const canvas = await drawCanvas(`/x1:10x10/${overlays.join("/")}`, {}, false);
  expect(canvas.toBuffer("image/png")).toMatchImageSnapshot();
});

test("edge cases: walls", async () => {
  const walls =
    "_ah2aj2aj7aa7aa1ah1_ae1aE4-daD4aA4_aB1aB2-saA2_aH1aH4-daG4aE4_aD4-baD5aD7_aD5-baE5aF5aF7_aF5-daG5aH5aH7_aH5aI5-oaJ5_aI3aI4aH4";
  const canvas = await drawCanvas(`/aa1:10x10/${walls}`, {}, false);
  expect(canvas.toBuffer("image/png")).toMatchImageSnapshot();
});

test("edge cases: effects", async () => {
  const effects = ["*s15cc1ac5", "*c20rah3", "*l40,2ya6aj6", "*t15f10af3"];
  const canvas = await drawCanvas(`/aa1:10x10/${effects.join("/")}`, {}, false);
  expect(canvas.toBuffer("image/png")).toMatchImageSnapshot();
});

test("token image backgrounds", async () => {
  const tokens = [
    'a2-skelly~n242n',
    'a1b-broken~asd789ad',
    'a3y-skelly~n242n',
    'b1-skelly~n242n',
    'a4lw-skelly~n242n',
    'c1ho-skelly~n242n',
    'c4gr-skelly~n242n',
    'f1tb-skelly~n242n',
  ];
  const canvas = await drawCanvas(`/${tokens.join("/")}`, {}, false);
  expect(canvas.toBuffer("image/png")).toMatchImageSnapshot();
});