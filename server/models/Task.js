const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true // Obligatorio tener título
    },
    done: {
        type: Boolean,
        default: false // Por defecto, la tarea no está terminada
    }
});

module.exports = mongoose.model('Task', TaskSchema);