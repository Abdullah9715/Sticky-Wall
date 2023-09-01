import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Divider, Form, Input, Typography, message, Modal } from 'antd';
import { useAuthContext } from '../contexts/AuthContext';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../Config/Config';
import './Login.css';

const { Title } = Typography;

export default function Login() {
  const { dispatch } = useAuthContext();
  const [state, setState] = useState({ email: '', password: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetProcessing, setResetProcessing] = useState(false);

  const handleChange = (e) =>
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleLogin = (e) => {
    e.preventDefault();
    const { email, password } = state;
    setIsProcessing(true);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log('user login Successfully');
        message.success('User login Successfully');
        console.log(userCredential);
        console.log(userCredential.user);

        dispatch({ type: 'SET_LOGGED_IN', payload: { user } });
        setIsProcessing(false);
      })
      .catch((error) => {
        message.error('Invalid email or password.');
        const errorCode = error.code;
        const errorMessage = error.message;
        setIsProcessing(false);
      });
  };

  const handleResetPassword = async () => {
    try {
      setResetProcessing(true);
      await sendPasswordResetEmail(auth, resetEmail);
      message.success('Password reset email sent. Please check your inbox.');
      setResetModalVisible(false);
      setResetProcessing(false);
    } catch (error) {
      message.error('Failed to send password reset email.');
      setResetProcessing(false);
    }
  };



  useEffect(() => {
    // Add the 'slide-in' class after a brief delay to trigger the animation
    const cardElement = document.querySelector('.login');
    if (cardElement) {
      setTimeout(() => {
        cardElement.classList.add('slide-in');
      }, 100);
    }
  }, []);

  return (
    <main className="auth">
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="card  login p-3 p-md-4">
              <Title level={2} className="m-0 text-center">
                Login
              </Title>
              <Divider />

              <Form layout="vertical">
                <Form.Item label="Email">
                  <Input placeholder="Input your email" name="email" onChange={handleChange} />
                </Form.Item>
                <Form.Item label="Password">
                  <Input.Password
                    placeholder="Input your password"
                    name="password"
                    onChange={handleChange}
                  />
                </Form.Item>
                <Form.Item>
                <Button
                 
                  type="primary"
                  htmlType="submit"
                  className="w-100"
                  loading={isProcessing}
                  onClick={handleLogin}
                >
                  Click to Login Now
                </Button>
               <br /> 
              <div>
                <div className="row">
                  <p>Don't Have Any Account?</p>
                  <div className="col-lg-6 col-md-6 col-sm-12">
                <a className="w-100" style={{ padding: '10px' }} href="/register">Resgister Now</a>

                  </div> 
                  <div className="col-lg-6 col-md-6 col-sm-12">
                <a style={{paddingTop:'10px',marginTop:'40px'}} onClick={() => setResetModalVisible(true)}>Forgot Password?</a>
                    
                  </div>
              <p>All Right Reserved.Muhammad Abdullah</p>
                </div>
              </div>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="Forgot Password"
        visible={resetModalVisible}
        onCancel={() => setResetModalVisible(false)}
        onOk={handleResetPassword}
        confirmLoading={resetProcessing}
      >
        <p>
          Please enter your email address. We will send you an email with instructions on how to reset
          your password.
        </p>
        <Input
          placeholder="Email"
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
        />
      </Modal>
    </main>
  );
}
