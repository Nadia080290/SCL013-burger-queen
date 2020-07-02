import React, { useState } from 'react';
import firebase from '../firebase/firebase-config';
import erro from '../firebase/firebase-config';
import { Redirect } from 'react-router';

const Registro = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [occupation, setOccupation] = useState('');
  const [page, setPage] = useState('');

  const createUser = () => {

    if (name === '' || password === '' || email === '' || occupation === '') {
      alert('Por favor, completa todos los campos');
    } else {
      firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
        const fireUser = firebase.firestore().collection('User')
        const user = {
          name: name,
          email: email,
          password: password,
          occupation: occupation,
          user_uid: firebase.auth().currentUser.uid,
        }
        fireUser.add(user)
        setPage(occupation)

      }).catch((error) => { erro(error) });
    }
  }

  return (
    <div >
      <h1 >Registro</h1>
      <input type="text" placeholder="Nombre" onChange={e => setName(e.currentTarget.value)} />
      <input type="email" placeholder="E-mail" onChange={e => setEmail(e.currentTarget.value)} />
      <input type="password" placeholder="Contraseña" onChange={e => setPassword(e.currentTarget.value)} />
      <select name="function" onChange={e => setOccupation(e.currentTarget.value)}>
        <option value=''>Selecione su Rol</option>
        <option value="Cocinero">Cocinero</option>
        <option value="Mesero">Mesero</option>
      </select>

      <button onClick={createUser}>Registrar</button>
      <button onClick={() => setPage('login')}>Login</button>

      {page === 'Cocinero' ? <Redirect to="/chef" /> : null}
      {page === 'Mesero' ? <Redirect to="/mesero" /> : null}
      {page === 'login' ? <Redirect to="/" /> : null}

    </div>
  );
}

export default Registro;