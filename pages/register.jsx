'use client'
import React, {useRef, useState} from 'react'
import Link from 'next/link'
import { useStateContext } from '../context/StateContext'
import styles from '../styles/login.module.css'
import buttonStyles from '../styles/buttons.module.css'
import { toast } from 'react-hot-toast'
import PasswordInput from '../components/PasswordInput'

const Register = () => {
  const registerForm = useRef(null)
  const {registerUser} = useStateContext()

  const [invalidEmail, setInvalidEmail] = useState('')
  const [invalidPassword, setInvalidPassword] = useState('')

  const validateEmail = (email) => {
    // Basic email validation regex
    const emailRegex = /^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/;
    console.log("validateEmail");
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Password must be at least 8 characters, contain at least one number and one special character
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    console.log("validatePassword");
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setInvalidEmail('')
    setInvalidPassword('')

    const name = registerForm.current.name.value
    const email = registerForm.current.email.value
    const password1 = registerForm.current.password1.value
    const password2 = registerForm.current.password2.value

    if (!validateEmail(email) && !validatePassword(password1)) {
      setInvalidEmail('Invalid email format');
      setInvalidPassword('Password must be at least 8 characters, contain at least one number and one special character');
      return;
    } else if (!validatePassword(password1)) {
      console.log("invalid password")
      setInvalidPassword('Password must be at least 8 characters, contain at least one number and one special character');
      return;
    } else if (!validateEmail(email)) {
      setInvalidEmail('Invalid email format');
      return;
    }

    if(password1 !== password2){
        console.log('Passwords do not match')
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

            {invalidEmail && <p className={styles.error}>{invalidEmail}</p>}
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

            {invalidPassword && <p className={styles.error}>{invalidPassword}</p>}

            <PasswordInput name="password1" label="Password: " autoComplete="password1" />
            <PasswordInput name="password2" label="Confirm Password: " autoComplete="password2" />

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