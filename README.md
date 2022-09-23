# cat-card-application
This application helps users to get two different cat images with a dynamic greeting on images and merge these two images into one frame in a proper way.
_____________________________________

## Configuration

Users can separately provide the different param values for the images. such as,

* greeting
* who  
* width
* height
* color
* size

There is a special syntax to provide those value, 

After the main command with space in the end "node index.js " insert two dash symbols "--" and type param key without any space in the beginning "--greeting". Insert the value of the key with space in the beginning "--greeting Hello". You can insert all param values with this pattern, "node index.js --greeting test --who user --width 400 --height 500 --color pink --size 100"

As an example,

```bash 
node index.js --greeting test --who user --width 400 --height 500 --color pink --size 100 
```

## Run

Run the command in root

```bash
node index.js --greeting test --who user --width 400 --height 500 --color pink --size 100
```

After running this command, the final image will be automatically downloaded to your project folder.
