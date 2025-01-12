# Usa la imagen oficial de Node.js versión 18
FROM node:18

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar solo los archivos esenciales primero
COPY package.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos necesarios
COPY src/ ./src/
COPY server.js ./
COPY .env ./

# Exponer el puerto en el que corre el servicio
EXPOSE 4000

# Comando para iniciar el servicio
CMD ["node", "server.js"]
