
const User = require('./model/User');
const Todo = require('./model/Todo');
const Category = require('./model/Category');
const ActivityLog = require('./model/ActivityLog');

console.log('Semua model berhasil dimuat!');
console.log('User:', User.modelName);
console.log('Todo:', Todo.modelName);
console.log('Category:', Category.modelName);
console.log('ActivityLog:', ActivityLog.modelName);
