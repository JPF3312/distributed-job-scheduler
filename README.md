# ⚙️ Distributed Job Scheduler (Node.js & BullMQ)

Motor de procesamiento de trabajos distribuidos y asíncronos en segundo plano, diseñado para manejar tareas pesadas de manera eficiente sin bloquear el hilo principal de la aplicación.

## 🛠️ Stack Tecnológico
* **Node.js & Express:** API REST para control y encolado.
* **BullMQ & Redis:** Motor avanzado de colas de mensajes y persistencia en memoria.
* **Docker:** Contenedorización del broker de mensajes (Redis).

## 🚀 Endpoints Principales
* `POST /api/jobs` — Encola una nueva tarea asíncrona.
* `GET /api/jobs/:id` — Consulta el estado, progreso y resultado del trabajo.
