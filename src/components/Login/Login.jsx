
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useRef, useState } from 'react';
import Col from 'react-bootstrap/Col';
import './Login.css';
export const Login = () => {

    const emailForm = useRef();
    const passForm = useRef();
    const [validated, setValidated] = useState();
      
    const sendForm = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
          e.preventDefault();
          e.stopPropagation();
        }
        else{

            console.log(emailForm.current?.value)
        }
        setValidated(true);
    }

    return (
        <div className="App">
            <h2>Sign In</h2>
            <Form noValidate validated={validated} onSubmit={sendForm}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        ref={emailForm}
                        required
                        type="email"
                        placeholder="email"
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label className='red'>Password</Form.Label>
                    <Form.Control type="password" ref={passForm} placeholder="Password" required />
                </Form.Group>        
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>

    );
}
