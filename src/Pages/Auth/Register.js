import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Typography, message } from 'antd';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../Config/Config';
import { doc, setDoc } from 'firebase/firestore'; // Import firestore related functions
import'./Login.css'

const { Title } = Typography;

export default function Register() {
  const [state, setState] = useState({ fullName: '', email: '', password: '' }); // Added fullName field
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) => setState((s) => ({ ...s, [e.target.name]: e.target.value }));
  const handleRegister = async (e) => {
    e.preventDefault();
    const { fullName, email, password } = state;

    try {
      setIsProcessing(true);

      // Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user data to Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      const userData = {
        fullName,
        email,
password      };
      await setDoc(userDocRef, userData);
      message.success('User registered successfully');
      setIsProcessing(false);
    } catch (error) {
      message.error('Registration failed');
      setIsProcessing(false);
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
      <div className="container" style={{borderRadius:'20px', textAlign: 'center',padding:'30px 10px', width: '50%', margin: '40px auto',backgroundColor:"whitesmoke"}}>
              <div className="row">
          <div className="col">
            <div className="card login p-3 p-md-4">
              <Title level={2} className="m-0 text-center">
                Register Your Self
              </Title>

              <Form layout="vertical">
                <Form.Item label="Full Name">
                  {/* Add input for full name */}
                  <Input placeholder="Input your full name" name="fullName" onChange={handleChange} />
                </Form.Item>
                <Form.Item label="Email">
                  <Input placeholder="Input your email" name="email" onChange={handleChange} />
                </Form.Item>
                <Form.Item label="Password">
                  <Input.Password placeholder="Input your password" name="password" onChange={handleChange} />
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-100"
                  loading={isProcessing}
                  onClick={handleRegister}
                >
                  Register Now
                </Button> <br />
               <div style={{marginTop:"10px"}}>
                <a className="w-100" style={{ marginTop: '30px', padding: '10px' }} href="/auth/login">Login page</a>
              <p><b>All Rights Reserved.Muhammad Abdullah</b></p>
               </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
