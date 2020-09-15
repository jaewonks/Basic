import React, { useState } from 'react'
import Axios from 'axios'
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';
import { withRouter } from 'react-router-dom';
function LoginPage(props) {
    const dispatch = useDispatch();
    //서버에 보내고자 하는 값들을 state에서 가지고 있다.
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }

    const onPWHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();

        let body = {
            email: Email,
            password: Password
        }
        dispatch(loginUser(body))
            .then(response => {
                if (response.payload.loginSuccess) {
                    props.history.push('/')
                } else {
                    alert('Error')
                }
            })
}


    return (
        <div style={{
            display:'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>
        <form style={{ display:'flex', flexDirection:'column' }}
            onSubmit={onSubmitHandler}
        >
            <label>Email</label>
            <input type='email' value={Email} onChange={onEmailHandler}/>
            <label>Password</label>
            <input type='password' value={Password} onChange={onPWHandler}/>
            <br />
            <button>Login</button>
        </form>
        </div>
    )
}

export default withRouter(LoginPage)