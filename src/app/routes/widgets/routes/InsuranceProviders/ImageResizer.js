const dataURItoBlob = (dataURI) => {
  const bytes =
    dataURI.split(",")[0].indexOf("base64") >= 0
      ? atob(dataURI.split(",")[1])
      : unescape(dataURI.split(",")[1]);

  const mime = dataURI
    .split(",")[0]
    .split(":")[1]
    .split(";")[0];

  const max = bytes.length;
  const ia = new Uint8Array(max);

  for (var i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i);

  return new Blob([ia], { type: mime });
};

const resizeImage = (file, maxHeight, maxWidth) => {
  const reader = new FileReader();
  const image = new Image();
  const canvas = document.createElement("canvas");

  const resize = () => {
    let width = image.width;
    let height = image.height;

    if (width > maxWidth) {
      height *= maxWidth / width;
      width = maxWidth;
    } else if (height > maxHeight) {
      width *= maxHeight / height;
      height = maxHeight;
    }

    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d").drawImage(image, 0, 0, width, height);
    let dataUrl = canvas.toDataURL("image/jpeg");
    return dataURItoBlob(dataUrl);
  };

  return new Promise((res, rej) => {
    if (!file.type.match(/image.*/)) {
      rej(new Error("Not an image"));
      return;
    }

    reader.onload = (readerEvent) => {
      image.onload = () => res(resize());
      image.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
  });
};

export default resizeImage;
