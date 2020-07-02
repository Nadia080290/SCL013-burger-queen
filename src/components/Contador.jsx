import React from 'react'

const Contador = () => {

    const [contador, setContador] = React.useState(0)

/*const aumentar = () =>{
    console.log('clic')
    setContador(contador + 1)
}*/
    return (
        <div>
           <h2>Contador</h2> 
    <h3>nuestro numero aumentado: {contador}</h3>
    <h4>
        {
            contador > 2 ? 'Es mayor a dos' : 'Es menor a dos'
        }
    </h4>
    <button onClick={() => setContador(contador + 1)}>Aumentar</button>
        </div>
    )
}

export default Contador
