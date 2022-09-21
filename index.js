const {writeFile} = require('fs');
const {join} = require('path');
const request = require('request');
const axios = require('axios');
const blend = require('@mapbox/blend');
const argv = require('minimist')(process.argv.slice(2));

const {
  greeting = 'Hello',
  who = 'You',
  width = 400,
  height = 500,
  color = 'Pink',
  size = 100,
} = argv;

const getImages = async (text, width, height, color, size) => {
  const result = await axios
    .get(`https://cataas.com/cat/says/${text}?width=${width}&height=${height}&color${color}&s=${size}`, {
      responseType: 'arraybuffer'
    })

  return result.data
}

const blendImages = async (firstBody, secondBody) => {
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

const saveToFile = (data, fileName) => {
  return new Promise((resolve, reject) => {
    const fileOut = join(process.cwd(), `/${fileName}.jpg`);

    writeFile(fileOut, data, 'binary', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  })
}

const main = async () => {
  try {
    console.log('Loading..')

    const [image1, image2] = await Promise.all([
      getImages(greeting, width, height, color, size),
      getImages(who, width, height, color, size)
    ])

    const blendedImage = await blendImages(image1, image2)

    await saveToFile(blendedImage, `${greeting}-${who}`)

    console.log('The file was saved!')
  } catch (e) {
    console.log('Something went wrong!', e)
  }
}

main()
