'use client'
import React, {useRef} from 'react'
import Link from 'next/link'
import { useStateContext } from '../context/StateContext'
import styles from '../styles/login.module.css'
import buttonStyles from '../styles/buttons.module.css'
import { toast } from 'react-hot-toast'

const Register = () => {
  const registerForm = useRef(null)
  const {registerUser} = useStateContext()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const name = registerForm.current.name.value
    const email = registerForm.current.email.value
    const password1 = registerForm.current.password1.value
    const password2 = registerForm.current.password2.value

    if(password1 !== password2){
        toast.error('Passwords do not match')
        return 
    }
    
    const userInfo = {name, email, password1, password2}

    await registerUser(userInfo)
}
return (
    <div className={styles.container}>
        <div className={styles.loginRegisterContainer}>
          <form onSubmit={handleSubmit} ref={registerForm}> 
            <div className={styles.formFieldWrapper}>
                <label>Name:</label>
                <input 
                    className={styles.formField}
                    required
                    type="text" 
                    name="name"
                    placeholder="Enter name..."
                    />
            </div>
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
                  name="password1"
                  placeholder="Enter password..."
                  autoComplete="password1"
                  />
            </div>

            <div className={styles.formFieldWrapper}>
              <label>Confirm Password:</label>
              <input 
                className={styles.formField}
                type="password"
                name="password2" 
                placeholder="Confirm password..."
                autoComplete="password2"
                />
            </div>

            <div className={`${styles.formFieldWrapper} ${styles.submitButton}`}>
    
                <input 
                  type="submit" 
                  value="Register"
                  className={buttonStyles.btn}
                  />

            </div>

          </form>

          <p>Already have an account? <Link href="/login"><a className={styles.link}>Login</a></Link></p>

        </div>
    </div>
  )
}

export default Register