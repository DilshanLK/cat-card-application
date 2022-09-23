const {writeFile} = require('fs');
const {join} = require('path');

//Import third-party libraries.
const axios = require('axios');
const blend = require('@mapbox/blend');
const argv = require('minimist')(process.argv.slice(2));

//Hardcoded params for get images from the API, If the user insert the values for params this hardcoded values will be overwritted.
const {
  greeting = 'Hello',
  who = 'You',
  width = 400,
  height = 500,
  color = 'Pink',
  size = 100,
} = argv;

//Reusable function for getting images from API service with dynamic params.
const fetchImageHandler = async (text, width, height, color, size) => {
  const res = await axios
    .get(`https://cataas.com/cat/says/${text}?width=${width}&height=${height}&color${color}&s=${size}`, {
      responseType: 'arraybuffer'
    });

  return res.data;
};

//Merge dynamic images to one frame with using blned package.
const imagesBlendHandler = async (firstBody, secondBody) => {
  return new Promise((resolve, reject) => {
    blend([
        {buffer: new Buffer.from(firstBody, 'binary'), x: 0, y: 0},
        {buffer: new Buffer.from(secondBody, 'binary'), x: width, y: 0}
      ],
      {width: width * 2, height: height, format: 'jpeg',},
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
};

//Save merged image to the file system with dynamic file name.
const saveBlendedImageToFile = (data, fileName) => {
  return new Promise((resolve, reject) => {
    const fileOut = join(process.cwd(), `/${fileName}.jpg`);
    writeFile(fileOut, data, 'binary', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

//Main function of the program.
const main = async () => {
  try {
    console.log('Loading..');
    const [image1, image2] = await Promise.all([
      fetchImageHandler(greeting, width, height, color, size),
      fetchImageHandler(who, width, height, color, size)
    ])

    const blendedImage = await imagesBlendHandler(image1, image2)
    await saveBlendedImageToFile(blendedImage, `${greeting}-${who}`)
    console.log('The file was saved!');
  } catch (e) {
    console.log('Something went wrong!', e);
  }
};

//Main function calling..
main();
