# Usa una imagen oficial de Python como base
FROM python:3.9

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo de dependencias primero para mejorar la caché de Docker
COPY requirements.txt ./

# Instala las dependencias dentro del contenedor
RUN pip install --no-cache-dir -r requirements.txt

# Copiar archivos de configuración
COPY config.py ./
COPY init_db.py ./
COPY server.py ./
COPY .env ./

# Copiar carpetas del servicio
COPY app/__init__.py ./app/__init__.py
COPY app/models/ ./app/models/
COPY app/routes/ ./app/routes/

# Copiar migraciones y configuraciones locales (si son necesarias)
COPY migrations/ ./migrations/
COPY instance/ ./instance/

# Exponer el puerto en el que corre Flask
EXPOSE 5000

# Comando para ejecutar el servicio Flask
CMD ["python", "server.py"]
