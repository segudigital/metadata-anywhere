document.addEventListener('DOMContentLoaded', function () {
    const showNoExifCheckbox = document.getElementById('showNoExif');
  
    // Cargar la preferencia del almacenamiento
    chrome.storage.sync.get('showNoExif', function (data) {
      showNoExifCheckbox.checked = data.showNoExif !== undefined ? data.showNoExif : true; // Por defecto, mostrar
    });
  
    // Guardar la preferencia cuando se cambie el checkbox
    showNoExifCheckbox.addEventListener('change', function () {
      chrome.storage.sync.set({ showNoExif: showNoExifCheckbox.checked });
    });
  });
  