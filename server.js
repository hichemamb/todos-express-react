const express = require('express');
const app = express();
const fs = require('fs');



// Route
app.get('/api/TodoList', (request, response) => {
    fs.readFile('todos.json', 'utf8', (err, list) => {
        if (err) throw err;
        response.send(list);
    });
});

app.post('/api/TodoList', (request, response) => {

    let buffer = [];
    request
        .on('data', (dataChunk) => buffer += dataChunk)
        .on('end', () => {
            if (buffer === '') {
                response.send('No message')
            } else {
                // Parcourir la liste des todos
                // Pour chaque todo, l'ajouter à l'objet sous la forme { [uuid]: {name: [name]} }

                const todoListObject = buffer.reduce(
                    (accumulator, value) => ({...accumulator, [value.uuid]: value }), {} );

                console.log(todoListObject);

                fs.writeFile('todos.json', todoListObject, (err) => {
                    if (err) throw err;
                    response.send(todoListObject);
                });
            }
        });
});

app.delete('/api/TodoList', (request, response) => {

    let buffer = [];

    request.on('data', (dataChunk) => {
        buffer += dataChunk;
    });
    request.on('end', () => {
        if (buffer === '') {
            response.send('No message')
        } else {
            fs.writeFile('todos.json', buffer, (err) => {
                if (err) throw err;
                response.send(buffer);
            });
        }
    });
});


app.put('/api/TodoList', function (request, response) {

    let buffer = [];

    request.on('data', (dataChunk) => {
        buffer += dataChunk;
    });
    request.on('end', () => {
        if (buffer === '') {
            response.send('No message')
        } else {
            fs.writeFile('todos.json', buffer, function (err) {
                if (err) throw err;
                response.send(buffer);
            });
        }
    });
});


/*    if (request.body.items === ''){
        response.send('Aucun message')
    }

    else {
        console.log(request.body)
    }
}); */

app.listen(5000);
