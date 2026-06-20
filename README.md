# Aplicación de Preguntas y Respuestas Compartida

## Descripción
Esta es una aplicación de preguntas y respuestas **compartida en tiempo real** entre todos los dispositivos conectados al servidor. 

- **Público**: Cualquiera puede enviar preguntas sin código
- **Privado**: Solo con el código correcto se pueden responder preguntas
- **Sincronizado**: Todos los dispositivos conectados ven los mismos datos

---

## Para iniciar el servidor

### Opción 1: Desde Windows (más fácil)
1. Abre la carpeta del proyecto (donde está `preguntas.html`)
2. Haz doble clic en **`start-server.bat`**
3. Se abrirá una ventana de comando
4. Verás las URLs disponibles:
   ```
   http://127.0.0.1:8000    (este dispositivo)
   http://192.168.1.7:8000  (desde otros dispositivos en la red)
   ```

### Opción 2: Desde PowerShell/Terminal
```powershell
cd "C:\Users\[tu-usuario]\OneDrive\Desktop\Proyectos Gabo"
node server.js
```

---

## Para acceder desde otros dispositivos

### Mismo dispositivo
- Abre tu navegador y ve a: **`http://localhost:8000`**

### Desde otro dispositivo en la MISMA red
- Usa la URL del servidor que se muestra al iniciar, por ejemplo:
  - **`http://192.168.1.7:8000`**
  - (Cambia `192.168.1.7` por la IP que aparezca en tu pantalla)

### Desde fuera de la red
- Necesitarías hacer port forwarding en tu router
- O usar un servicio como Ngrok

---

## Código de acceso

**Código por defecto**: `GABO2026`

Para cambiar el código:
1. Inicia sesión con el código actual
2. En la sección "Cambiar código de acceso", ingresa el nuevo código
3. Haz clic en "Guardar código"

---

## Datos compartidos

- Todas las preguntas y respuestas se guardan en el archivo:
  ```
  data/questions-store.json
  ```
- Este archivo se sincroniza automáticamente entre dispositivos

---

## Troubleshooting

### El servidor no inicia
- Asegúrate de que Node.js está instalado: `node --version`
- Si el puerto 8000 está ocupado, detén otros programas que lo usen

### No puedo acceder desde otro dispositivo
- Verifica que ambos dispositivos estén en la misma red WiFi
- Usa la IP local (192.168.x.x) no localhost
- Desactiva el firewall temporalmente para probar

### Los cambios no se sincronizan
- La app recarga datos automáticamente cada 5 segundos
- Si no ves cambios, recarga la página (F5)

---

## Características

✅ Preguntas y respuestas en tiempo real  
✅ Sincronización entre dispositivos  
✅ Protegidas por código de acceso  
✅ Sin requisitos de base de datos externa  
✅ Portable (funciona en cualquier computadora con Node.js)  

---

**Creado para compartir preguntas entre compañeros de forma segura y sencilla.**
