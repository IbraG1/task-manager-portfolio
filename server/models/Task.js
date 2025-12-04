const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true // Obligatorio tener título
    },
    category: {
        type: String,
        enum: ['Trabajo', 'Personal', 'Estudio', 'Otro'],
        default: 'Personal'
    },
    done: {
        type: Boolean,
        default: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Task', TaskSchema);