'use client';
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useStateContext } from '../context/StateContext'
import { useRouter } from 'next/router'
import styles from '../styles/login.module.css'
import {toast} from 'react-hot-toast'
import buttonStyles from '../styles/buttons.module.css'
import PasswordInput from '../components/PasswordInput';


const Login = () => {
  const {user, loginUser} = useStateContext()
  const router = useRouter()

  const loginForm = useRef(null)

  // Redirect to home page if user is already logged in and they try to access the login page
  // the dependency array???
  useEffect(() => {
    if (user){
        console.log("User is logged in")
        router.push('/');
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const email = loginForm.current.email.value
    const password = loginForm.current.password.value
    
    const userInfo = {email, password}

    await loginUser(userInfo)
  }

  return (
    <div className={styles.container}>
        <div className={styles.loginRegisterContainer}>
          <form onSubmit={handleSubmit} ref={loginForm}> 
            <div className={styles.formFieldWrapper}>
                <label>Email:</label>
                <input 
                  className={styles.formField}
                  required
                  type="email" 
                  name="email"
                  placeholder="Enter email..."
                  />
            </div>

            <PasswordInput name="password" label="Password: " autoComplete="password" />

            <div className={`${styles.formFieldWrapper} ${styles.submitButton}`}>
    
                <input 
                  type="submit" 
                  value="Login"
                  className={buttonStyles.btn}
                  />

            </div>

          </form>

          <p>Don't have an account? <Link href="/register"><a className={styles.link}>Register</a></Link></p>

        </div>
    </div>
  )
}

export default Login