import React, { useState } from 'react';
import 'firebase/auth';
import erro from '../firebase/erro';
import { useFirebaseApp } from 'reactfire'
import { Redirect } from 'react-router';


export default (props) => {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [occupation, setOccupation] = useState('');
    const [page, setPage] = useState('');

    const firebase = useFirebaseApp();

    const submit = ()=>{
        firebase.auth().signInWithEmailAndPassword(email, password, occupation)
        .then((credencial) => {
            console.log('entraste')
        
        })
        .catch((error) => { erro(error) });
    }
    
     return(
        <div>
            <div>
            <label htmlFor="email">Correo Electronico</label>
            <input type="email" id="email" onChange={e => setEmail(e.currentTarget.value)}/>
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" onChange={e => setPassword(e.currentTarget.value)}/>
            <select name="function" onChange={e => setOccupation(e.currentTarget.value)}>
             <option value=''>Selecione tu funcion</option>
             <option value="kitchen">Cocinero</option>
             <option value="waiter">Mesero</option>
            </select>
            <button onClick={submit}>ingresar</button>
            <button onClick={() => setPage('register')}>Registre-se</button>

            </div>
            {page === 'register' ? <Redirect to="/registro" /> : null}
        </div>
    )
}
/* import React, { useState } from 'react';
import firebase from '../firebase/firebase-config';
import erro from './Utils/translateError';
import { Redirect } from 'react-router';

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('');
  const [page, setPage] = useState('');

  const loginUser = () => {
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then().catch((error) => { erro(error) });
  }

  return (
    <div>
      <h1 >Bem vindo ao Burguer Queen</h1>
      <input  type="email" placeholder="E-mail" onChange={e => setEmail(e.currentTarget.value)} />
      <input type="password" placeholder="Contraseña" onChange={e => setPassword(e.currentTarget.value)} />
      <select onChange={e => setRol(e.currentTarget.value)}>
        <option value=''>Selecione a su rol</option>
        <option value="Cocinero">Cocinero</option>
        <option value="Mesero">Mesero</option>
      </select>
      <button onClick={loginUser}>Login</button>
      <button onClick={() => setPage('register')}>Registre-se</button>

      {page === 'register' ? <Redirect to="/register" /> : null}
    </div>
  );
}

export default Login; */
