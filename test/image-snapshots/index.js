import puppeteer from "puppeteer";
import tap from 'tap';
import createServer from "../../server.js";

(async () => {
  const server = createServer();
  const address = await server.listen();
  const browser = await puppeteer.launch();

  await tap.test('tokens', async () => {
    const page = await browser.newPage();
    const tokens = [
        'A1T',
        'B1Tp',
        'C1Tc-Goblin1',
        'D1',
        'E1r',
        'F1y-Goblin1',
        'G1c-Goblin1',
        'H1r-Goblin1',
        'I1g-Goblin1',
        'J1p-Goblin1',
        'A2L',
        'C2Lb',
        'E2lg-Goblin1',
        'A4H',
        'D4Hp',
        'G4Hp-Goblin1',
        'A7G',
        'E7Gr-Goblin1',
    ];
    await page.goto(`${address}/${tokens.join('/')}`);
    await page.screenshot({ path: "./test/image-snapshots/tokens.png" });
  });

  await tap.test('overlays', async () => {
    const page = await browser.newPage();
    const overlays = [
        'A1$T',
        'B1$P',
        'C1$p',
        'D1$S',
        'E1$F',
        'F1$O',
        'G1$o',
    ];
    await page.goto(`${address}/${overlays.join('/')}`);
    await page.screenshot({ path: "./test/image-snapshots/overlays.png" });
  });

  await tap.test('walls', async () => {
    const page = await browser.newPage();
    const walls = '_H2J2J7A7A1H1_E1E4]D4A4_B1B2$A2_H1H4[G4E4_D4]D5D7_D5]E5F5F7_F5]G5H5H7_H5I5-J5_I3I4H4';
    await page.goto(`${address}/${walls}`);
    await page.screenshot({ path: "./test/image-snapshots/walls.png" });
  });

  await tap.test('effects', async () => {
    const page = await browser.newPage();
    const effects = [
      '*s15cc1c5',
      '*c20rh3',
      '*l40,2ya6j6',
      '*t15f10f3',
    ];
    await page.goto(`${address}/${effects.join('/')}`);
    await page.screenshot({ path: "./test/image-snapshots/effects.png" });
  });

  await tap.test('background', async () => {
    const page = await browser.newPage();
    const bg = 'https://cdn.discordapp.com/attachments/687568111498821642/714239512741412974/battlemap-3.png';
    await page.goto(`${address}/24x17/?bg=${bg}`);
    await page.screenshot({ path: "./test/image-snapshots/background.png" });
  });

  await tap.test('settings: dark mode', async () => {
    const page = await browser.newPage();
    await page.goto(`${address}/@d`);
    await page.screenshot({ path: "./test/image-snapshots/dark-mode.png" });
  });

  await tap.test('settings: zoom: 2', async () => {
    const page = await browser.newPage();
    await page.goto(`${address}/@2`);
    await page.screenshot({ path: "./test/image-snapshots/zoom-2.png" });
  });

  await tap.test('settings: zoom: 3', async () => {
    const page = await browser.newPage();
    await page.goto(`${address}/@3`);
    await page.screenshot({ path: "./test/image-snapshots/zoom-3.png" });
  });

  await tap.test('settings: grid transparency: half', async () => {
    const page = await browser.newPage();
    await page.goto(`${address}/@h`);
    await page.screenshot({ path: "./test/image-snapshots/transparency-half.png" });
  });

  await tap.test('settings: grid transparency: no grid', async () => {
    const page = await browser.newPage();
    await page.goto(`${address}/@n`);
    await page.screenshot({ path: "./test/image-snapshots/no-grid.png" });
  });

  await tap.test('complex: multiple features 1', async () => {
    const page = await browser.newPage();
    const tokens = [
        'A1T',
        'B1Tp',
        'C1Tc-Goblin1',
        'D1',
        'E1r',
        'F1y-Goblin1',
        'G1c-Goblin1',
        'H1r-Goblin1',
        'I1g-Goblin1',
        'J1p-Goblin1',
        'A2L',
        'C2lb',
        'E2Lg-Goblin1',
        'A4H',
        'D4Hp',
        'G4Hp-Goblin1',
        'A7G',
        'E7Gr-Goblin1',
    ];
    const bg = 'https://cdn.discordapp.com/attachments/687568111498821642/714239512741412974/battlemap-3.png';
    const settings = '@2dn'
    await page.goto(`${address}/${tokens.join('/')}/${settings}/?bg=${bg}`);
    await page.screenshot({ path: "./test/image-snapshots/complex-1.png" });
  });

  await tap.test('complex: multiple features 2', async () => {
    const page = await browser.newPage();
    const tokens = [
        'A1T',
        'B1Tp',
        'C1Tc-Goblin1',
        'D1',
        'E1r',
        'F1y-Goblin1',
        'G1c-Goblin1',
        'H1r-Goblin1',
        'I1g-Goblin1',
        'J1p-Goblin1',
        'A2L',
        'C2lb',
        'E2lg-Goblin1',
        'A4H',
        'D4Hp',
        'G4Hp-Goblin1',
        'A7G',
        'E7Gr-Goblin1',
    ];
    const bg = 'https://cdn.discordapp.com/attachments/687568111498821642/714239512741412974/battlemap-3.png';
    const settings = '@3h'
    await page.goto(`${address}/${tokens.join('/')}/${settings}/?bg=${bg}`);
    await page.screenshot({ path: "./test/image-snapshots/complex-2.png" });
  });

  await browser.close();
  await server.close();
})();