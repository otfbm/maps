import tap from "tap";
import installImageSnapshot from "tap-image-snapshot";
import drawCanvas from "../../draw-canvas.js";

installImageSnapshot(tap)

tap.test("tokens", async (t) => {
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
  t.matchImageSnapshot(canvas.toBuffer("image/png"));
});

tap.test("overlays", async (t) => {
  const overlays = ["A1$tr", "B1$pr", "C1$ps", "D1$ss", "E1$fi", "F1$po", "G1$pc"];
  const canvas = await drawCanvas(`/${overlays.join("/")}`, {}, false);
  t.matchImageSnapshot(canvas.toBuffer("image/png"));
});

tap.test("overlays: sizes", async (t) => {
  const overlays = ["A1b2$tr", "c1e3$pr", "f1i4$ps", "a5e10$ss"];
  const canvas = await drawCanvas(`/${overlays.join("/")}`, {}, false);
  t.matchImageSnapshot(canvas.toBuffer("image/png"));
});

tap.test("overlays: rotations", async (t) => {
  const overlays = ["a5b1$tr", "c1d5$ss", "i2e1$tr"];
  const canvas = await drawCanvas(`/${overlays.join("/")}`, {}, false);
  t.matchImageSnapshot(canvas.toBuffer("image/png"));
});

tap.test("overlays: colors", async (t) => {
  const overlays = ["A1b$tr", "B1r$pr", "C1y$ps", "D1~3366ff$ss", "F1o$po", "G1bn$pc"];
  const canvas = await drawCanvas(`/${overlays.join("/")}`, {}, false);
  t.matchImageSnapshot(canvas.toBuffer("image/png"));
});

tap.test("walls", async (t) => {
  const walls =
    "_H2J2J7A7A1H1_E1E4-dD4A4_B1B2-oA2_H1H4-dG4E4_D4-bD5D7_D5-bE5F5F7_F5-dG5H5H7_H5I5-oJ5_I3I4H4";
  const canvas = await drawCanvas(`/${walls}`, {}, false);
  t.matchImageSnapshot(canvas.toBuffer("image/png"));
});

tap.test("effects", async (t) => {
  const effects = ["*s15cc1c5", "*c20rh3", "*l40,2ya6j6", "*t15f10f3", "*ct15,12oa5"];
  const canvas = await drawCanvas(`/${effects.join("/")}`, {}, false);
  t.matchImageSnapshot(canvas.toBuffer("image/png"));
});

tap.test("arrow effects", async (t) => {
  const effects = ["*mrd7b2", "*mya4f4", "*aob2h4"];
  const canvas = await drawCanvas(`/${effects.join("/")}`, {}, false);
  t.matchImageSnapshot(canvas.toBuffer("image/png"));
});

tap.test("background", async (t) => {
  const bg =
    "https://cdn.discordapp.com/attachments/687568111498821642/714239512741412974/battlemap-3.png";
  const canvas = await drawCanvas(`/24x17`, { bg }, false);
  t.matchImageSnapshot(canvas.toBuffer("image/png"));
});

tap.test("settings: dark mode", async (t) => {
  const canvas = await drawCanvas(`/@d`, {}, false);
  t.matchImageSnapshot(canvas.toBuffer("image/png"));
});

tap.test("settings: zoom: 2", async (t) => {
  const canvas = await drawCanvas(`/@2`, {}, false);
  t.matchImageSnapshot(canvas.toBuffer("image/png"));
});

tap.test("settings: zoom: 3", async (t) => {
  const canvas = await drawCanvas(`/@3`, {}, false);
  t.matchImageSnapshot(canvas.toBuffer("image/png"));
});

tap.test("settings: grid transparency: half", async (t) => {
  const canvas = await drawCanvas(`/@h`, {}, false);
  t.matchImageSnapshot(canvas.toBuffer("image/png"));
});

tap.test("settings: grid transparency: no grid", async (t) => {
  const canvas = await drawCanvas(`/@n`, {}, false);
  t.matchImageSnapshot(canvas.toBuffer("image/png"));
});

tap.test("complex: multiple features 1", async (t) => {
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
  t.matchImageSnapshot(canvas.toBuffer("image/png"));
});

tap.test("complex: multiple features 2", async (t) => {
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
  t.matchImageSnapshot(canvas.toBuffer("image/png"));
});

tap.test("dotted lines: top right -> right & bottom left -> left", async (t) => {
  const bg =
    "https://cdn.discordapp.com/attachments/687568111498821642/714239512741412974/battlemap-3.png";
  const canvas = await drawCanvas(`/`, { bg }, false);
  t.matchImageSnapshot(canvas.toBuffer("image/png"));
});

tap.test("dotted lines: top right -> right & bottom left -> left", async (t) => {
  const bg =
    "https://cdn.discordapp.com/attachments/687568111498821642/714239512741412974/battlemap-3.png";
    const canvas = await drawCanvas(`/`, { bg }, false);
  t.matchImageSnapshot(canvas.toBuffer("image/png"));
});

tap.test("dotted lines: top right -> up (pan) & bottom left -> left (pan)", async (t) => {
  const bg =
    "https://cdn.discordapp.com/attachments/687568111498821642/714239512741412974/battlemap-3.png";
  const canvas = await drawCanvas(`/o8:10x10`, { bg }, false);
  t.matchImageSnapshot(canvas.toBuffer("image/png"));
});

tap.test("dotted lines: pan x only", async (t) => {
  const bg =
    "https://cdn.discordapp.com/attachments/687568111498821642/714239512741412974/battlemap-3.png";
  const canvas = await drawCanvas(`/c1:10x10`, { bg }, false);
  t.matchImageSnapshot(canvas.toBuffer("image/png"));
});

tap.test("dotted lines: pan x only - to the end", async (t) => {
  const bg =
    "https://cdn.discordapp.com/attachments/687568111498821642/714239512741412974/battlemap-3.png";
  const canvas = await drawCanvas(`/q1:10x10`, { bg }, false);
  t.matchImageSnapshot(canvas.toBuffer("image/png"));
});

tap.test("dotted lines: pan y only", async (t) => {
  const bg =
    "https://cdn.discordapp.com/attachments/687568111498821642/714239512741412974/battlemap-3.png";
  const canvas = await drawCanvas(`/a7:10x10`, { bg }, false);
  t.matchImageSnapshot(canvas.toBuffer("image/png"));
});

tap.test("edge case: border between z and aa", async (t) => {
  const canvas = await drawCanvas(`/x1:5x5/z1/aa1`, {}, false);
  t.matchImageSnapshot(canvas.toBuffer("image/png"));
});

tap.test("edge case: border between az and ba", async (t) => {
  const canvas = await drawCanvas(`/ax1:5x5/az1/ba1`, {}, false);
  t.matchImageSnapshot(canvas.toBuffer("image/png"));
});

tap.test("edge cases: overlays", async (t) => {
  const overlays = [
    "x1$tr",
    "z1$ps",
    "ab1$pr",
    "ad1$ss",
    "z4$fi",
    "af1$po",
    "x4$pc",
    "x2y3$tr",
    "z2aa3$ps",
    "ab2ac3$pr",
    "ad2ae3$ss",
    "z5aa6$fi",
    "af2ag3$po",
    "x5y6$pc",
  ];
  const canvas = await drawCanvas(`/x1:10x10/${overlays.join("/")}`, {}, false);
  t.matchImageSnapshot(canvas.toBuffer("image/png"));
});

tap.test("edge cases: walls", async (t) => {
  const walls =
    "_ah2aj2aj7aa7aa1ah1_ae1aE4-daD4aA4_aB1aB2-saA2_aH1aH4-daG4aE4_aD4-baD5aD7_aD5-baE5aF5aF7_aF5-daG5aH5aH7_aH5aI5-oaJ5_aI3aI4aH4";
  const canvas = await drawCanvas(`/aa1:10x10/${walls}`, {}, false);
  t.matchImageSnapshot(canvas.toBuffer("image/png"));
});

tap.test("edge cases: effects", async (t) => {
  const effects = ["*s15cc1ac5", "*c20rah3", "*l40,2ya6aj6", "*t15f10af3"];
  const canvas = await drawCanvas(`/aa1:10x10/${effects.join("/")}`, {}, false);
  t.matchImageSnapshot(canvas.toBuffer("image/png"));
});

tap.test("token image backgrounds", async (t) => {
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
  t.matchImageSnapshot(canvas.toBuffer("image/png"));
});

tap.test("FoW - basic - light mode", async (t) => {
  const bg = 'https://cdn.discordapp.com/attachments/712795723623694376/768158019535896616/Preview-Resized250percent.jpg';
  const segments = [
    'k9:v16',
    '@c64',
    '*c10rl10',
    '*l100yj17t14',
    '*fl10r15',
    '*fq8t9',
    '*fs10u13',
  ];
  const canvas = await drawCanvas(`/${segments.join("/")}`, { bg }, false);
  t.matchImageSnapshot(canvas.toBuffer("image/png"));
});

tap.test("FoW - basic - dark mode", async (t) => {
  const bg = 'https://cdn.discordapp.com/attachments/712795723623694376/768158019535896616/Preview-Resized250percent.jpg';
  const segments = [
    'k9:v16',
    '@c64d',
    '*c10rl10',
    '*l100yj17t14',
    '*fl10r15',
    '*fq8t9',
    '*fs10u13',
  ];
  const canvas = await drawCanvas(`/${segments.join("/")}`, { bg }, false);
  t.matchImageSnapshot(canvas.toBuffer("image/png"));
});
