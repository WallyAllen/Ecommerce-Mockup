const { Jimp } = require("jimp");

async function removeBackground() {
  const inputPath = "C:/Users/fjbor/.gemini/antigravity/brain/61cbceec-b869-4de4-ad23-603b8a1f6860/.user_uploaded/media_1787078718766.png";
  const outputPath = "./public/images/logo-transparent.png";

  try {
    const image = await Jimp.read(inputPath);
    
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      
      // If the pixel is very dark (close to black), make it transparent
      if (red < 40 && green < 40 && blue < 40) {
        this.bitmap.data[idx + 3] = 0; // Set alpha to 0
      }
    });

    await image.write(outputPath);
    console.log("Background removed successfully!");
  } catch (err) {
    console.error("Error processing image:", err);
  }
}

removeBackground();
