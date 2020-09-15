import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action';
import Axios from 'axios';
import { withRouter } from 'react-router-dom';

function RegisterPage(props) {
    const dispatch = useDispatch();
    //서버에 보내고자 하는 값들을 state에서 가지고 있다.
    const [Email, setEmail] = useState("")
    const [Name, setName] = useState("")
    const [Password, setPassword] = useState("")
    const [ConfirmPW, setConfirmPW] = useState("")

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }

    const onNameHandler = (event) => {
        setName(event.currentTarget.value)
    }

    const onPWHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onConfirmPWHandler = (event) => {
        setConfirmPW(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();

        if(Password !== ConfirmPW){
            return alert('비밀번호가 일치하지 않습니다')
        }

        let body = {
            email: Email,
            password: Password,
            name: Name
        }
        dispatch(registerUser(body))
            .then(response => {
                if (response.payload.success) {
                    props.history.push("/login")
                } else {
                    alert("Failed to sign up")
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
            
            <label>Name</label>
            <input type='text' value={Name} onChange={onNameHandler}/>
            
            <label>Password</label>
            <input type='password' value={Password} onChange={onPWHandler}/>

            <label>Confirm Password</label>
            <input type='password' value={ConfirmPW} onChange={onConfirmPWHandler}/>
            
            <br />
            <button>Sign Up</button>
        </form>
        </div>
    )
}

export default withRouter(RegisterPage)