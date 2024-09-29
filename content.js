const images = document.querySelectorAll('img');

// Obtener la preferencia del almacenamiento
chrome.storage.sync.get('showNoExif', function (data) {
  const showNoExif = data.showNoExif !== undefined ? data.showNoExif : true; // Por defecto, mostrar

  images.forEach(img => {
    EXIF.getData(img, function() {
      const hasExif = EXIF.pretty(this) !== "";
      const exifData = EXIF.getAllTags(this);

      // Solo mostrar el exifBox si hay datos EXIF o si el usuario quiere ver el cuadro sin datos EXIF
      if (hasExif || showNoExif) {
        // Crear el cuadro en la esquina superior izquierda
        const exifBox = document.createElement('div');
        exifBox.className = 'exifBox ' + (hasExif ? 'hasExif' : 'noExif'); // Aplicar clase según datos EXIF
        exifBox.textContent = hasExif ? 'EXIF Data' : 'No EXIF';

        // Crear el botón para copiar los datos EXIF
        const copyButton = document.createElement('button');
        copyButton.className = 'copyButton'; // Añadir la clase al botón
        copyButton.textContent = 'Copiar Datos EXIF';
        copyButton.style.display = hasExif ? 'block' : 'none'; // Solo mostrar si hay datos EXIF
        
        img.style.position = 'relative';
        img.parentNode.style.position = 'relative';
        img.parentNode.insertBefore(exifBox, img);
        
        // Aumentar la visibilidad al pasar el cursor sobre la imagen
        img.addEventListener('mouseenter', function() {
          exifBox.classList.add('hover'); // Añadir clase para cambiar fondo en hover
        });

        img.addEventListener('mouseleave', function() {
          exifBox.classList.remove('hover'); // Eliminar clase para restaurar fondo
        });

        // Mostrar los datos EXIF al pasar el cursor sobre el cuadro exifBox
        exifBox.addEventListener('mouseenter', function() {
            if (hasExif) {
            // Formatear los datos EXIF para mostrar en líneas separadas
            let formattedData = '';
            for (const [key, value] of Object.entries(exifData)) {
                if (typeof value === 'object') {
                // Manejar el caso de objetos (ejemplo: miniaturas)
                formattedData += `<strong>${key}:</strong> ${JSON.stringify(value)}<br>`;
                } else {
                formattedData += `<strong>${key}:</strong> ${value}<br>`;
                }
            }
            
            // Crear un contenedor para el botón y los datos EXIF
            const exifContainer = document.createElement('div');
            
            // Agregar el botón al contenedor
            exifContainer.appendChild(copyButton);
            
            // Añadir los datos EXIF al contenedor
            const dataDiv = document.createElement('div');
            dataDiv.innerHTML = formattedData; // Usar innerHTML para permitir HTML
            exifContainer.appendChild(dataDiv);
        
            exifBox.innerHTML = ''; // Limpiar el contenido anterior
            exifBox.appendChild(exifContainer); // Agregar el contenedor al exifBox
            exifBox.classList.add('showData'); // Añadir clase para mostrar datos
            } else {
            exifBox.textContent = 'No EXIF'; // Mostrar el texto de no EXIF
            }
        });
        
        // Restaura el contenido al salir del cuadro
        exifBox.addEventListener('mouseleave', function() {
            exifBox.textContent = hasExif ? 'EXIF Data' : 'No EXIF'; // Restaurar texto
            exifBox.classList.remove('showData'); // Eliminar clase para ocultar datos
        });
  

        // Función para copiar datos EXIF al portapapeles
        copyButton.addEventListener('click', function() {
            // Copiar solo las claves y valores formateados
            let formattedDataForClipboard = '';
            for (const [key, value] of Object.entries(exifData)) {
            formattedDataForClipboard += `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}\n`;
            }
        
            navigator.clipboard.writeText(formattedDataForClipboard).then(() => {
            // Hacer la transición de texto
            copyButton.classList.add('hidden'); // Ocultar el botón
            setTimeout(() => {
                copyButton.textContent = 'Datos EXIF guardados en el portapapeles'; // Cambiar texto del botón
                copyButton.classList.remove('hidden'); // Mostrar el botón nuevamente
            }, 300); // Esperar la duración de la transición antes de cambiar el texto
            setTimeout(() => {
                copyButton.classList.add('hidden'); // Ocultar el botón nuevamente
                setTimeout(() => {
                copyButton.textContent = 'Copiar Datos EXIF'; // Restaurar texto después de 2 segundos
                copyButton.classList.remove('hidden'); // Mostrar el botón nuevamente
                }, 300); // Esperar la duración de la transición antes de cambiar el texto
            }, 2000); // Mantener el texto nuevo durante 2 segundos
            }).catch(err => {
            console.error('Error al copiar al portapapeles: ', err);
            });
        });
  
      }
    });
  });
});
