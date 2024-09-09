'use client';
import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useStateContext } from '../context/StateContext'
import { useRouter } from 'next/router'
import styles from '../styles/login.module.css'


const Login = () => {
  const {user, loginUser} = useStateContext()
  const router = useRouter()

  const loginForm = useRef(null)

  // Redirect to home page if user is already logged in and they try to access the login page
  // the dependency array???
  useEffect(() => {
    if (user){
        router.push('/');
    }
  }, [user, router])

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

            <div className={styles.formFieldWrapper}>
                <label>Password:</label>
                <input 
                  className={styles.formField}
                  type="password" 
                  name="password"
                  placeholder="Enter password..."
                  autoComplete="password"
                  />
            </div>


            <div className={`${styles.formFieldWrapper} ${styles.submitButton}`}>
    
                <input 
                  type="submit" 
                  value="Login"
                  className={styles.btn}
                  />

            </div>

          </form>

          <p>Don't have an account? <Link href="/register"><a className={styles.link}>Register</a></Link></p>

        </div>
    </div>
  )
}

export default Login