import '../Styles/Login.css'
import Logo from '../assets/image2.png'

const Login = () => {
    return (
        <div className='body'>
            <div className="left">
                <div className="logo">
                    <img src={Logo} alt="logo" />
                    <h1>Pyace</h1>
                </div>
                <div className="text">
                    <h1>Welcome to Pyace</h1>
                    <p>Login to your account</p>
                </div>
                <div className="form">
                    <input type="text" placeholder="Username" />
                    <input type="password" placeholder="Password" />
                    <button>Login</button>
                </div>
            </div>
            <div className="right">

            </div>
        </div>
    )
}

export default Login