import React, {useState} from 'react'
import './login.css'

const Signin = () => {
    const [isActive, setIsActive] = useState(false);
    return (
        <div className='flex-center h-[100vh]'>
            <div className={`container ${isActive ? 'active' : ''}`} id='container'>
                <div className='form-container sign-up'> {/* Right side  */}
                    <form>
                        <h1>Create Account</h1>
                        <div className="social-icons">
                            <a href='#' className='icons'><i className="fa-brands fa-google-plus-g"></i></a>
                            <a href='#' className='icons'><i className="fa-brands fa-facebook"></i></a>
                            <a href='#' className='icons'><i className="fa-brands fa-x"></i></a>
                            <a href='#' className='icons'><i className="fa-brands fa-instagram"></i></a>
                        </div>
                        <span> or use your email for registration</span>
                        <input type="text" placeholder='Name' />
                        <input type="email" placeholder='email' />
                        <input type="password" placeholder='password' />
                        <button onClick={() => {onLoginClick(); onClose();}}>Sign up</button>
                    </form>
                </div>
                <div className='form-container sign-in'>  {/* Left side  */}
                    <form>
                        <h1>Sign in</h1>
                        <div className="social-icons">
                            <a href='#' className='icons'><i className="fa-brands fa-google-plus-g"></i></a>
                            <a href='#' className='icons'><i className="fa-brands fa-facebook"></i></a>
                            <a href='#' className='icons'><i className="fa-brands fa-x"></i></a>
                            <a href='#' className='icons'><i className="fa-brands fa-instagram"></i></a>
                        </div>
                        <span> or use your email password to sign in</span>
                        <input type="email" placeholder='email' />
                        <input type="password" placeholder='password' />
                        <a href="#">Forgot your password?</a>
                        <button onClick={() => {onLoginClick(); onClose();}}>Log in</button>
                    </form>
                </div>
                <div className='toggle-container'>
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>Welcome Back!</h1>
                            <p>Enter your personal details to use all of site features</p>
                            <button onClick={() => { setIsActive(false) }} id="login">Sign In</button>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h1>Hello, Friend!</h1>
                            <p>If you haven't created an accound, sign up now to benefit from recyclying</p>
                            <button onClick={() => { setIsActive(true) }} id="register">Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signin