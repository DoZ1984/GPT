# Too Type Too Furious

Aplicación web de carreras de mecanografía. Permite registro de usuarios y jugar en modo individual o multijugador con un ranking de mejores tiempos.

## Requisitos

- Node.js

## Uso

Instalar dependencias y ejecutar el servidor:

```bash
npm install
npm start
```

Abrir `http://localhost:3000` en el navegador.

La clasificación de mejores tiempos está disponible en `/scores` con filtros
`?mode=single` o `?mode=multi`.

El texto de cada partida individual se obtiene desde `/text`.

Ejecutar pruebas:

```bash
npm test
```
