import React, { Fragment } from 'react'
import { db } from '../firebase'
import NavbarOrders from './NavbarOrders'
import '../estilos/orders.css'
import moment from "moment";
import 'moment/locale/es';
import growl from 'growl-alert';
import 'growl-alert/dist/growl-alert.css';
const effect =
{
  fadeAway: true,
  fadeAwayTimeOut: 1000,
}

const Orders = () => {
    
    const [orderdone, setOrderDone] = React.useState([])
    const [delivery, setDelivery] = React.useState([]);
    
    React.useEffect(() => {
        const orderOrigin = db.collection('pedidos')
        orderOrigin.where('status', '==', 'done').orderBy('hourDone', 'desc').onSnapshot((snap => {
            const pedidos = snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }))
        setOrderDone(pedidos);
        })
        )
        db.collection('orders').where('status', '==', 'delivered').onSnapshot((snap => {
            const pedidos = snap.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setDelivery(pedidos);
        })
        )
    }, [])
    
    const delivered = (item, e) => {
        e.preventDefault()
        db.collection('pedidos').doc(item.id).update({
            status: 'delivered',
            hourDelivered: new Date().getTime()
          })
          .then(() => {
            setDelivery([...delivery, { ...item, status: 'delivered', hourDelivered:   new Date().getTime() }])
            growl.success({ text: 'Pedido Entregado', ...effect })
          })
        if (item.status === 'done') {
          const index = orderdone.findIndex((i) => i.id === item.id)
          orderdone.splice(index, 1);
        } 
    }

  return (
    <Fragment>
      <NavbarOrders/>
             <section className="container">
                <p className="caja">Pedidos por ser Entregados</p>
                  <div className="row row-cols-3">
                    {orderdone.map((item, i) => {
                      return (
                        <section className="section h5 font-italic" key={i}  >
                          {item.status === 'done' ?
                              <div className="row waitercheck">
                                <p className="text client-text"> Dia:  {moment(item.hourDone).format('L')}</p>
                                <p className="text client-text"> Hora: {moment(item.hourDone).format('LT')}</p>
                                <p className="text font-italic orders"> Cliente: {item.cliente}</p>
                                <p className="text font-italic orders"> Mesa: {item.numMesa}</p>
                              <div className="order-itens" key={item.id}>
                                <span className="menu-name h5">Pedido:</span>
                                {item.pedido.map((item,i ) => <span className="order-kitchen" key={i}>
                                    <ul>
                                        <li> {item.countProducto} {item.nombreProducto} </li>    
                                    </ul> 
                                </span>
                                )}
                              </div>
                              <button className="btn btn-dark" onClick={(e) => delivered(item, e)}>Entregar</button>
                            </div>

                            : null}
                        </section>
                      )
                    })}
                </div>
              </section>
              </Fragment>
    
    )
}
export default Orders
