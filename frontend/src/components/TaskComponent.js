import React, { Component } from 'react';
import {
    Jumbotron, Input, Label, Button, Row,
    Col, Navbar, NavbarBrand
} from 'reactstrap';
import { Control, LocalForm, Errors } from 'react-redux-form';

//for validations
const required = (val) => val && val.length;
const minLength = (len) => (val) => val && (val.length >= len);

class Task extends Component {
    constructor(props) {
        super(props);
        let email = localStorage.getItem("email")
        if (!email) {
            this.props.history.push("/login")
        }
        this.state = {
            email: email,
            tasks: [],
            todoText: "",
        };
        console.log("HOME PAGE", this.state.email)
    };

    // For todoText (textbox entry)
    onChangeInput = e => {
        this.setState({ todoText: e.target.value });
    }

    //for Adding the task
    onSubmitTodo = (values) => {
        const payload = {
            email: this.state.email
        }
        const todoText = this.state.todoText
        fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: payload.email,
                tasks: todoText,
            })
        })
            .then((response) => {
                if (response.ok) {
                    return this.setState(({ tasks }) => ({
                        tasks: [...tasks, { id: tasks.length, name: values.todoText, done: false }],
                        todoText: ""
                    }));
                }
                return Promise.reject(response);
            })
            .catch(function (error) {
                console.warn('Something went wrong', error)
            })


    };


    //for using tasks as done or not done
    onChangeBox = item => {
        console.log(item, "item")
        this.setState(({ tasks }) => ({
            tasks: tasks.map(el =>
                el.id === item.id ? { ...el, done: !el.done } : el)
        }));
    };

    //for deleting selected tasks
    handleDel = item => {
        const payload = {
            email: this.state.email
        }
        fetch('http://localhost:3000/tasks', {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: payload.email,
                tasks: [item.id]
            })
        })

            .then((response) => {
                if (response.ok) {
                    return this.setState(({ tasks }) => ({
                        tasks: tasks.filter(el => el.id !== item.id)
                    }));
                }
            })


    };


    componentDidMount() {
        const payload = {
            email: this.state.email
        }
        fetch('http://localhost:3000/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then((data) => {
                let tasks = []
                data.tasks.map((item, index) => {
                    tasks.push({ id: index, name: item, done: false })
                })
                this.setState({ tasks: tasks })
            })
    }

    render() {
        const List = ({ list, onChangeBox, handleDel }) => (
            <ul className='ul'>
                {
                    list.map((item, index) => (         //list view for todo list
                        < li key={item.id} className="list" style={{ textDecoration: item.done ? "line-through" : null }}>
                            <Input type="checkbox" onClick={() => onChangeBox(item)} defaultChecked={item.done} /> &nbsp;&nbsp;
                            {item.name} &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;
                            <span type="button" onClick={() => handleDel(item)} className="fa fa-trash-o fa-lg"></span>
                        </li>
                    ))
                }
            </ul>
        );

        const { tasks, todoText } = this.state;
        console.log(tasks, "HEllo")
        return (
            <>
                <Navbar dark color='dark'>
                    <div className="container">
                        <span className="fa fa-tasks fa-lg"></span>
                        <NavbarBrand href="/" > To Do
                        <br /> keep your tasks in check </NavbarBrand>
                    </div>
                </Navbar>
                <Jumbotron>
                    <div className="container">
                        <LocalForm onSubmit={(values) => this.onSubmitTodo(values)}>
                            <Row className="form-group">
                                <Label htmlFor="todoText" md={1}><h4>Task</h4></Label>
                                <Col md={3}>
                                    <Control.text model=".todoText" autoComplete="off" value={todoText}
                                        onChange={this.onChangeInput}
                                        validators={{
                                            required, minLength: minLength(1)
                                        }}
                                        className="form-control col-md-3" />
                                    <Errors className="text-danger"
                                        model=".todoText"
                                        show="touched"
                                        messages={{
                                            required: 'required',
                                            minLength: 'Must be Greater than or equal to 1 characters'
                                        }}
                                    />
                                </Col>
                                <Col md={2}>
                                    <Button type="submit" color="success" >
                                        ADD TASK
                                    </Button>
                                </Col>
                            </Row>
                        </LocalForm> <br />
                        {tasks.length ? <List list={tasks} onChangeBox={this.onChangeBox} handleDel={this.handleDel} /> : <div className="heading">You don't have any pending tasks...Yay!!!</div>}
                    </div>
                    <div className="footer">
                        <h3 className="row justify-content-center">wanna buy us a coffee,pizza or a beer ? </h3>
                        <div className="row justify-content-center">
                            <div className="col-auto">
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                         <span className="fa fa-cc-amex fa-lg"></span> &nbsp;
                        <span className="fa fa-cc-mastercard fa-lg"></span>&nbsp;
                        <span className="fa fa-cc-paypal fa-lg"></span>&nbsp;
                        <span className="fa fa-cc-visa fa-lg"></span>
                                <p>© Copyright 2021 N & K LTD.</p>
                            </div>
                        </div>
                    </div>
                </Jumbotron>
            </>
        );
    }
}


export default Task;