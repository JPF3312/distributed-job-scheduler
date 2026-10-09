const express = require('express');
const { videoProcessingQueue } = require('./queues/jobQueue');
require('./workers/jobWorker');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.post('/api/jobs', async (req, res) => {
  try {
    const { videoUrl, userId } = req.body;

    if (!videoUrl) {
      return res.status(400).json({ error: 'Se requiere el campo videoUrl' });
    }

    const job = await videoProcessingQueue.add('process-video', {
      videoUrl,
      userId,
    }, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: false, // <-- Cambiado a false para poder consultar su estado final
      removeOnFail: false,
    });

    return res.status(201).json({
      message: 'Trabajo encolado correctamente',
      jobId: job.id,
    });
  } catch (error) {
    console.error('Error al encolar trabajo:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/jobs/:id', async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await videoProcessingQueue.getJob(jobId);

    if (!job) {
      return res.status(404).json({ error: 'Trabajo no encontrado' });
    }

    const state = await job.getState();
    const progress = job.progress;

    return res.json({
      jobId: job.id,
      state,
      progress,
      data: job.data,
      failedReason: job.failedReason,
      returnvalue: job.returnvalue, // Muestra el resultado devuelto por el worker
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al consultar el trabajo' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor de scheduling ejecutándose en http://localhost:${PORT}`);
});
