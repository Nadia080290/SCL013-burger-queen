import React from 'react'

const Variables = () => {

    const saludo = 'Hola desde constante'
    const imagen = 'https://edteam-media.s3.amazonaws.com/blogs/original/286e8422-97ad-4f6b-98c3-da96320cd66d.png'
    
    return (
        <div>
           <h2> Nuevo componente { saludo }</h2>
           <img src={imagen} alt=""/>
        </div>
    )
}

export default Variables
