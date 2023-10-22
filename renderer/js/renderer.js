// const { ipcRenderer } = require("electron");

// Some JavaScript to load the image and show the form. There is no actual backend functionality. This is just the UI
const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');
const selectImg = document.querySelector('#selectImg');
const imageText = document.querySelector('#imgText');

// console.log(versions.node());
function loadImage(e) {
  const file = e.target.files[0];
  // set the selectImg to the image uploaded
  selectImg.src = URL.createObjectURL(file);

  // set width and height
  selectImg.style.width = '100px';
  selectImg.style.height = '100px';
  imageText.style.display = 'none';

  // check if file is an image
  if (!isFileImage(file)) {
        alertError('Please select an image file');
        return;
  } else {
    alertSuccess('Image loaded successfully');
  }

  const image = new Image();
  image.src = URL.createObjectURL(file);
  
  image.onload = () => {
    const { width, height } = image;
    heightInput.value = height;
    widthInput.value = width;
  };

  form.style.display = 'block';  
  outputPath.innerHTML = path.join(os.homedir(), 'SnapScaleImages'); 

  document.querySelector(
    '#filename'
  ).innerHTML = file.name;
}

// send image data to main
function sendImage(e) {
  e.preventDefault();

  if(!img.files[0]) {
    alertError('Please select an image file');
    return;
  }

  const width = widthInput.value;
  const height = heightInput.value;

  if(width === '' || height === '') {
    alertError('Please enter a width and height');
    return;
  }

  const imgPath = img.files[0].path;

  // send to main using ipcRenderer
  ipcRenderer.send('image:resize', {
    imgPath,
    width,
    height,
  });

  ipcRenderer.on('image:done', (e, message) => {
    alertSuccess(`Image resized successfully. To width: ${width}, height: ${height}`);
  });

}

function isFileImage(file) {
    const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    return file && acceptedImageTypes.includes(file['type'])
}

function alertError(message) {
    Toastify.toast({
        text: message,
        duration: 2000,
        close:false,
        style: {
            background: "red",
            color:"white",
            textAlign: "center",
        }
    });
}

function alertSuccess(message) {
    Toastify.toast({
      text: message,
      duration: 2000,
      close:false,
      style: {
          background: "green",
          color:"white",
          textAlign: "center",
      }
  });
}

document.querySelector('#img').addEventListener('change', loadImage);
form.addEventListener('submit', (e) => sendImage(e));