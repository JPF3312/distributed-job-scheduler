const { Queue } = require('bullmq');

// Configuración de la conexión a Redis (apunta al contenedor Docker local)
const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
};

// Creamos la cola de tareas pesadas llamada 'video-processing-queue'
const videoProcessingQueue = new Queue('video-processing-queue', { connection });

module.exports = {
  videoProcessingQueue,
  connection,
};
