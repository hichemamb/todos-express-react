import React, {Component} from 'react';
import './TodoList.css';

class TodoList extends Component {
    uuid4 = require('uuid/v4');

    constructor(props) {
        super(props);
        this.state = {
            userInput: '',
            todos: {},
            edit : false,
            editInput: '',
            currentValue: '',
        };
    }

    componentDidMount() {
        fetch('/api/TodoList')
            .then(response => response.json())
            .then(list => this.setState({todos: list}));

        console.log(this.state.todos);
    }

    onChange(event) {
        this.setState({
            userInput: event.target.value
        });
    }

    addTodo(event) {
        event.preventDefault();

        fetch('/api/TodoList', {
            method: 'POST',
            body: JSON.stringify([...this.state.todos, {"uuid": this.uuid4(), "name":this.state.userInput}])
        })
            .then(res => res.json())
            .then(response =>
                this.setState({
                    todos: response,
                    userInput: ''
                }));
    }

    removeTodo(event) {
        event.preventDefault();
        const array = this.state.todos;
        array.splice(array.indexOf(event.target.value), 1);
        this.setState({
            todos: array
        });

        fetch('/api/TodoList', {
            method: 'DELETE',
            body: JSON.stringify(this.state.todos)
        }).then(response => console.log(response))
    }

    displayEditTodo(event) {
        this.setState({
            edit: true,
            currentValue: event.target.value
        });
        console.log(this.state.currentValue)
    }

    onEditTodo(event) {
        this.setState({
            editInput: event.target.value,
        });
    }

    editTodo(event){
        event.preventDefault();
        const array = this.state.todos;
        array.splice(array.indexOf(this.state.currentValue), 1, this.state.editInput);
        this.setState({
            edit: false
        });

        fetch('/api/TodoList', {
            method: 'PUT',
            body: JSON.stringify(this.state.todos)
        }).then(response => console.log(response))
    }

    renderTodos() {

        return Object.keys(this.state.todos).map((todoUuid) => {
            console.log(todoUuid, this.state.todos);
            return (
                <div key={todoUuid}>
                    <div className="item-container">
                        <div className="item-leftOptions">
                            <button type="submit" value={this.state.todos[todoUuid].name} >✓</button>
                            <p className="item-name">{this.state.todos[todoUuid].name}</p>
                        </div>
                        <div className="item-rightOptions">
                            <button type='submit' value={this.state.todos[todoUuid].name} onClick={this.displayEditTodo.bind(this)}>Modifier</button>
                            <button className="item-button" type='submit' value={this.state.todos[todoUuid]} onClick={this.removeTodo.bind(this)}>X</button>
                        </div>
                    </div>
                </div>
            );
        });
    };

    render() {
        return (
            <div className="container">
                <h1>Todo List </h1>
                <form className="form" method="POST">
                    <div>
                        <input
                            value={this.state.userInput}
                            type="text"
                            placeholder="Ajouter une todo"
                            onChange={this.onChange.bind(this)}
                        />
                        <button className="form-button" type='submit' onClick={this.addTodo.bind(this)}>Ajouter</button>
                    </div>
                    { this.state.edit &&
                    <div>
                        <input
                            type="text"
                            placeholder="Modifier todo"
                            onChange={this.onEditTodo.bind(this)}
                        />
                        <button type='submit' onClick={this.editTodo.bind(this)}>Modifier</button>
                    </div>
                    }
                </form>
                <div className="list">
                    {this.renderTodos()}
                </div>
            </div>
        )
    }
}

export default TodoList;