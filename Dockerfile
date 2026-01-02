# Usamos la imagen oficial de Bun como base
FROM oven/bun:latest

# Establecemos la carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiamos todos los archivos de tu proyecto
COPY . .

# Instalamos las dependencias (como dotenv)
RUN bun install

# Le decimos a la nube que nuestra API escucha en el puerto 3000
EXPOSE 3000

# El comando para iniciar tu API
CMD ["bun", "run", "start"]