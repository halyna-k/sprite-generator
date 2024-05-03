const updateFileList = () => {
  const fileInput = document.getElementById('file-upload');
  const uploadedFiles = document.getElementById('uploaded-files');

  const files = Array.from(fileInput.files);

  uploadedFiles.innerHTML = files.length 
    ? `<ul>${files.map(file => `<li>${file.name}</li>`).join('')}</ul>` 
    : 'No files uploaded';
}

document.getElementById('file-upload').addEventListener('change', updateFileList);