import React, { Component } from 'react';
import { Button, FormGroup, Input, Label, Form, FormFeedback } from 'reactstrap';
import '../App.css';

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

    onSubmit() {
        // Save to local storage
        localStorage.setItem("email", this.state.email)
        this.props.history.push('/tasks');
    }

    handleBlur = (field) => (evt) => {
        this.setState({
            touched: { ...this.state.touched, [field]: true }
        });
    }

    validate(email) {
        const errors = {
            email: ''
        };
        if (this.state.touched.email && email.split('').filter(x => x === '@').length !== 1)
            errors.email = 'Enter valid email';

        return errors;
    }


    render() {
        const errors = this.validate(this.props.email)
        return (
            <div>
                <div className="App">
                    <div className="App-header">
                        <header className="App-header">
                            <h1><span className="fa fa-tasks fa-lg"></span>  To Do List</h1> <br /> <br />
                            <Form onSubmit={this.onSubmit}>
                                <FormGroup className="row">
                                    <Label htmlFor="email">Email </Label>
                                    <Input type="text" id="email" name="email" autoComplete="off"
                                        value={this.props.email}
                                        valid={errors.email === ''}
                                        invalid={errors.email !== ''}
                                        //handleBlur={this.handleBlur("email")}
                                        onChange={this.onChangeInput} />
                                    <FormFeedback>{errors.email}</FormFeedback>
                                </FormGroup>
                                <br />
                                <Button type="submit" value="submit" color="primary">Login</Button>
                            </Form>
                        </header>
                    </div>
                </div>
            </div>

        );
    }

}

export default Login;