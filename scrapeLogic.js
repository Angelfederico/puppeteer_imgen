const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async (res) => {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  try {
    const page = await browser.newPage();

   // Configura la búsqueda en Google Images
  await page.goto(`https://www.google.com/search?q=${encodeURIComponent(searchTerm)}&tbm=isch&tbs=isz:ex,iszw:${imageWidth},iszh:${imageHeight}`);
  
  // Espera a que se carguen las miniaturas de las imágenes
  await page.waitForSelector('.rg_i');

  // Hace clic en la primera miniatura de imagen
  await page.click('.rg_i', { delay: 200 });

  // Espera a que se cargue la imagen en tamaño completo
  await page.waitForSelector('.n3VNCb.KAlXId');

  // Obtiene la URL de la imagen
  const imageUrl = await page.evaluate(() => {
    const img = document.querySelector('.n3VNCb.KAlXId');
    return img ? img.getAttribute('src') : null;
  });
    res.send(imageUrl);
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeLogic };
