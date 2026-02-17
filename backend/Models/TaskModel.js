const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    taskTitle:{
        type: String,
        required:true
    },
    taskDetails:{
        type: String,
        required:true
    },
    isDone:{
        type:Boolean,
        required:true
    }
});

const TaskModel = mongoose.model('todos', TaskSchema);
module.exports = TaskModel;