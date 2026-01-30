export function downloadDataURLForiOSSafari(filename, data, targetWindow) {
  const blob = dataURLtoBlob(data);
  const url = URL.createObjectURL(blob);

  if (targetWindow && !targetWindow.closed && targetWindow.location) {
    targetWindow.location.replace(url);
  } else {
    window.location.href = url;
  }

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 60000);
}

export function downloadDataURL(filename, data) {
  const element = document.createElement('a');
  element.setAttribute('href', data);
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();


  document.body.removeChild(element);
}

export function downloadText(filename, text) {
  downloadDataURL(
    filename,
    `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`,
  );
}

function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}
