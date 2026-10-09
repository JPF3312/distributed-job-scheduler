const { Worker } = require('bullmq');
const { connection } = require('../queues/jobQueue');

const worker = new Worker(
  'video-processing-queue',
  async (job) => {
    console.log(`[Worker] Procesando trabajo ID: ${job.id} con datos:`, job.data);

    // Simulamos una tarea pesada (ej: procesamiento de video o datos)
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Simulamos un fallo aleatorio del 20% para probar los reintentos automáticos
    if (Math.random() < 0.2) {
      throw new Error('Fallo simulado en el procesamiento del trabajo');
    }

    console.log(`[Worker] Trabajo ID: ${job.id} completado con éxito.`);
    return { status: 'success', processedAt: new Date().toISOString() };
  },
  {
    connection,
    concurrency: 2, // Procesa hasta 2 trabajos en paralelo
  }
);

worker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} finalizado correctamente.`);
});

worker.on('failed', (job, err) => {
  console.log(`❌ Job ${job.id} falló con error: ${err.message}`);
});

console.log('[Worker] Escuchando nuevos trabajos en la cola...');
