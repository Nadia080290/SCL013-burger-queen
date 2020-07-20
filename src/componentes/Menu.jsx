import React, {useState} from 'react'
import '../estilos/menu.css'
import  info from '../data.json'
import ResumenPedido from './ResumenPedido';

const Menu = () => {

  const  data = info.Menu;
  const [type, setType] = useState('breakfast');
  const [resumen, setResumen] = useState([]) 
 
  const addProducto = item => {
    const precioProducto = parseInt(item.price);
    const nombreProducto = item.name;
    const idProducto = item.id;
    const countProducto = item.count; 
    resumen.push({idProducto, nombreProducto, precioProducto, countProducto})
    setResumen([
      ...resumen,
    ]) 
  }

  const limpiarPedido = () => {
    if(resumen.length){
      setResumen([])
    }
  }

    return ( 
      <div className="container ctnMenuResumen mt-2">  
        <div className="row">
          <section className="col-sm-6"> 
            <div className="btn-group-lg font-italic">
              <button type="button" className="text-white btn btn-dark m-1" onClick={() => setType('breakfast')}>
                Desayuno
              </button>
              <button type="button" className="text-white btn btn-dark m-1" onClick={() => setType('lunch')}>
                Almuerzo
              </button>
              <button type="button" className="text-white btn btn-dark m-1" onClick={() => setType('drinks')}>
                Bebidas
              </button>
              <button type="button" className="text-white btn btn-dark m-1" onClick={() => setType('additional')}>
                Adicional
              </button>
            </div>
            <div className="btn-group-lg font-italic">
              {data.filter(item => item.type === type ).map((item, i) => (
                <button onClick={() => addProducto(item)} value={item.price} name={item.name}
                  id={item.id}
                  type="button" className="btn color m-1" key={i}>{item.name} ${item.price}</button>
              ))}
            </div>
          </section>
          <ResumenPedido  resumen={resumen} limpiarPedido={limpiarPedido} />
        </div>
      </div>      
    )
}
export default Menu