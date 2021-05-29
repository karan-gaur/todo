import React, { Component } from 'react';
import {
    Jumbotron, Input, Label, Button, Row,
    Col, Navbar, NavbarBrand
} from 'reactstrap';
import { Control, LocalForm, Errors } from 'react-redux-form';

//For validations
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
    };

    // For todoText (textbox entry)
    onChangeInput = e => {
        this.setState({ todoText: e.target.value });
    }

    //For Adding the task
    onSubmitTodo = () => {
        fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.email,
                tasks: this.state.todoText,
            })
        })
            .then((response) => {
                if (response.ok) {
                    return this.setState(({ tasks }) => ({
                        tasks: [...tasks, { id: tasks.length, name: this.state.todoText, done: false }],
                        todoText: ""
                    }));
                }
                return Promise.reject(response);
            })
            .catch(function (error) {
                console.warn('Something went wrong', error)
            })
    };


    //For using tasks as done or not done
    onChangeBox = item => {
        this.setState(({ tasks }) => ({
            tasks: tasks.map(el =>
                el.id === item.id ? { ...el, selected: !el.selected } : el)
        }))
    };


    //For deleting multiple tasks
    multiDel = () => {
        let selectedTask = [];
        this.state.tasks.forEach((value) => {
            if (value.selected) {
                selectedTask.push(value.id)
            }
        })
        fetch('http://localhost:3000/tasks', {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.email,
                tasks: selectedTask
            })
        })
            .then((response) => {
                if (response.ok) {
                    this.componentDidMount();
                }
            })
    }

    componentDidMount() {
        fetch('http://localhost:3000/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.email
            })
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
        const List = ({ list, onChangeBox }) => (
            <ul className='ul'>
                {
                    list.map((item) => (         //List view for todo list
                        < li key={item.id} className="list" style={{ textDecoration: item.selected ? "line-through" : "" }}>
                            <Input type="checkbox" onClick={() => onChangeBox(item)} defaultChecked={item.done} style={{ marginRight: 20, backgroundColor: item.selected ? "coral" : null }} />
                            {item.name}
                        </li>
                    ))
                }
            </ul>
        );

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
                        <LocalForm onSubmit={this.onSubmitTodo}>
                            <Row className="form-group">
                                <Label htmlFor="todoText" md={1}><h4>Task</h4></Label>
                                <Col md={3}>
                                    <Control.text model=".todoText" autoComplete="off" value={this.state.todoText}
                                        onChange={this.onChangeInput}
                                        validators={{
                                            required, minLength: minLength(1)
                                        }}
                                        className="form-control col-md-3" />
                                    <Errors className="text-danger"
                                        model=".todoText"
                                        show="touched"
                                        messages={{
                                            required: '',
                                            minLength: "Seems like you haven't entered any task"
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
                        {this.state.tasks.length ? <List list={this.state.tasks} onChangeBox={this.onChangeBox} handleDel={this.handleDel} /> : <div className="notask">You don't have any pending tasks...Yay!!!</div>}
                        <Button className="biliboard" onClick={this.multiDel} style={{ border: 0 }}  >Delete Selected tasks</Button>
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