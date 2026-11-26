const Todo = require('./model/Todo');

console.log('Relasi Todo ke User:', Todo.schema.path('user').options.ref);
console.log('Relasi Todo ke Category:', Todo.schema.path('category').options.ref);