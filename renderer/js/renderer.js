// Some JavaScript to load the image and show the form. There is no actual backend functionality. This is just the UI

const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');
const imgPath = img.files[0].path;

// console.log(versions.node());
function loadImage(e) {
  const file = e.target.files[0];

  if (!isFileImage(file)) {
        alertError('Please select an image file');
        return;
  }else {
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

  if(width === '' || height === '') {
    alertError('Please enter a width and height');
    return;
  }

  // send to main using ipcRenderer
  ipcRenderer.send('image:resize', {
    imgPath,
    width: parseInt(widthInput.value),
    height: parseInt(heightInput.value),
    filename: filename.value
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
