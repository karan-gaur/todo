import React, { Component } from 'react';
import { Button, Row, Label } from 'reactstrap';
import '../App.css';
import { LocalForm, Errors, Control } from 'react-redux-form';


//For validation
const required = (val) => val && val.length;
const validEmail = (val) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val);

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            touched: {
                email: false
            }
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this);
    }

    onChangeInput = e => {
        e.preventDefault();
        this.setState({ email: e.target.value })
    }

    onSubmit(values) {
        // Save to local storage
        localStorage.setItem("email", values.email)
        this.props.history.push('/tasks');
    }

    handleBlur = (field) => (evt) => {
        this.setState({
            touched: { ...this.state.touched, [field]: true }
        });
    }

    render() {
        return (
            <div>
                <div className="App">
                    <div className="App-header">
                        <header className="App-header">
                            <h1><span className="fa fa-tasks fa-lg"></span>  To Do List</h1> <br /> <br />
                            <LocalForm onSubmit={(values) => this.onSubmit(values)}>
                                <Row className="form-group">
                                    <Label htmlFor="email">Email </Label>
                                    <Control.text model=".email" autoComplete="off" className="form-control"
                                        onChange={this.onChangeInput}
                                        validators={{
                                            required, validEmail
                                        }} />
                                    <Errors
                                        className="text-danger" model=".email" show="touched"
                                        messages={{
                                            required: '',
                                            validEmail: 'Invalid email'
                                        }}
                                    />
                                </Row>
                                <br />
                                <Button type="submit" color="primary">Login</Button>
                            </LocalForm>
                        </header>
                    </div>
                </div>
            </div>

        );
    }

}

export default Login;