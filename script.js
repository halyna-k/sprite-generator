const updateFileList = () => {
  const fileInput = document.getElementById('file-upload');
  const uploadedFiles = document.getElementById('uploaded-files');

  const files = Array.from(fileInput.files);

  uploadedFiles.innerHTML = files.length 
    ? `<ul>${files.map(file => `<li>${file.name}</li>`).join('')}</ul>` 
    : 'No files uploaded';
}

document.getElementById('file-upload').addEventListener('change', updateFileList);

const getSVGSize = (svgElement) => {
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  return blob.size;
}

const createSVGSprite = (files, width, height, containerWidth) => {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");

  const iconsPerRow = Math.floor(containerWidth / width);
  const rows = Math.ceil(files.length / iconsPerRow);
  
  svg.setAttribute("width", containerWidth);
  svg.setAttribute("height", rows * height);

  Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
          const image = document.createElementNS(svgNS, "image");
          const x = (index % iconsPerRow) * width;
          const y = Math.floor(index / iconsPerRow) * height;
          
          image.setAttribute("x", x);
          image.setAttribute("y", y);
          image.setAttribute("width", width);
          image.setAttribute("height", height);
          image.setAttributeNS("http://www.w3.org/1999/xlink", "href", e.target.result);
          svg.appendChild(image);
      };
      reader.readAsDataURL(file);
  });

  return svg;
}

const downloadSVG = (svgElement, filename) => {
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

document.getElementById('generate-sprite').addEventListener('click', () => {
  const files = document.getElementById('file-upload').files;
  const width = parseInt(document.getElementById('img-width').value, 10);
  const height = parseInt(document.getElementById('img-height').value, 10);
  const prefix = document.getElementById('img-prefix').value;
  const spriteDisplay = document.getElementById('sprite-display');

  const containerWidth = spriteDisplay.clientWidth;
  
  if (files.length === 0) {
    alert("Please, upload at least one file.");
  } else {
    const svg = createSVGSprite(files, width, height, containerWidth);
  
    spriteDisplay.innerHTML = "";
    spriteDisplay.appendChild(svg);

    const spriteName = `${prefix ? prefix + `_sprite` : 'sprite'}.svg`;

    document.getElementById('sprite-name').innerHTML = `Name: <span class="highlight">${spriteName}</span>`;
    document.getElementById('sprite-size').innerHTML = `Size: <span class="highlight">${getSVGSize(svg)} bytes</span>`;

    const downloadButton = document.getElementById('download-sprite');
    downloadButton.disabled = false;
  
    downloadButton.addEventListener('click', () => {
        downloadSVG(svg, spriteName);
    }, { once: true });
  }
      
});
