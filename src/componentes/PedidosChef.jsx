import React, { Fragment } from 'react'
import { db } from '../firebase'
import '../estilos/pedidoschef.css'
import moment from "moment";
import 'moment/locale/es';
import swal from 'sweetalert';
import growl from 'growl-alert';
import 'growl-alert/dist/growl-alert.css';
const effect =
{
  fadeAway: true,
  fadeAwayTimeOut: 1000,
}

const hmh = require('hmh');

const PedidosChef = () => {

    const [orders, getOrders] = React.useState([])
    const [orderdone, setOrderDone] = React.useState([])
    const [delivery, setDelivery] = React.useState([])


    React.useEffect(() => {
        const orderOrigin = db.collection('pedidos');
        orderOrigin.where('status', '==', 'pending').orderBy('hourSend', 'desc').onSnapshot({ includeMetadataChanges: true }, (snap => {
            const pedidos = snap.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            getOrders(pedidos);
        })
        )

        orderOrigin.where('status', '==', 'delivered').orderBy('hourDelivered', 'desc').onSnapshot((snap => {
            const pedidos = snap.docs.map((doc) => ({
              id: doc.id,
              ...doc.data()
            }))
            setDelivery(pedidos);
        })
        )
    }, [])
    
     const deleteOrder = async (id) => {
        swal({
            title: "¿Estas seguro que quieres eliminar este pedido?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
              swal("Pedido eliminado con exito!", {
                icon: "success",
              });
               db.collection('pedidos').doc(id).delete()
            }  else {
              swal("Your imaginary file is safe!");
            } 
          });
    }

    const orderDone = (item) => {
        db.collection('pedidos').doc(item.id).update({
            status: 'done',
            hourDone: new Date().getTime(),
        })
        .then(() => {
            growl.success({ text: 'Pedido Listo', ...effect })
            setOrderDone([...orderdone, { ...item, status: 'done', hourDone: new Date().getTime() }])
        })
        if (item.status === 'done') {
            const index = orders.findIndex((i) => i.id === item.id)
            orders.splice(index, 1);
        }
    }

    return (
        <Fragment> 
        <div className="container">
            <p className="caja">Pedidos a realizar</p>
            <div className="row row-cols-3 ">
                {orders.map((order, i) => { 
                return (
                    <div className="h5 font-italic" key={i}>
                        <section className="section" id={order.id}>
                            <div className="row columnLength">
                            <p className="text client-text"> Dia: {moment(order.hourSend).format('L')}</p>
                                <p className="text client-text"> Hora: {moment(order.hourSend).format('LT')}</p>
                                <p className="text client-text orders"> Cliente: {order.cliente}</p>
                                <p className="text client-text orders"> Mesas: {order.numMesa}</p>
                                <span className="menu-name text text-light">Pedido</span>
                                {order.pedido.map((item, i) => <span className="order-kitchen" key={i}>
                                    <ul>
                                        <li> {item.countProducto} {item.nombreProducto} </li>    
                                    </ul> 
                                </span>)} 
                                <div className="orders footer">
                                    <button  type="submit" className="btn btn-dark" onClick={() =>deleteOrder(order.id)}>Cancelar</button>
                                    <button className="btn btn-light ok" onClick={() => orderDone(order)}>Listo</button>
                               </div>
                            </div>
                        </section>
                    </div>
                )
                })}
            </div>
        </div>
        <div className="container">
          <p className="caja">Pedidos entregados</p>
          <div className="row row-cols-3 ">
              {delivery.map((item, index) => {
              const send = `${new Date(item.hourSend).getHours()}h ${new Date(item.hourSend).getMinutes()}m`;
              const hDelivered = `${new Date(item.hourDelivered).getHours()}h ${new Date(item.hourDelivered).getMinutes()}m`;
              const difftime = (hmh.diff(`${send}`, `${hDelivered}`).toString());
              return (
                <div className="h5" key={index} >
                    {item.status === 'delivered' ?
                    <section className="section font-italic">
                        <div className="row time">
                            <div className="menu-name">
                                <p className="text client-text "> Dia: {moment(item.hourDelivered).format('L')}</p>
                                <p className="text client-text"> Hora: {moment(item.hourDelivered).format('LT')}</p>
                                <p className="card-title orders"> Cliente: {item.cliente}</p>
                                <p className="card-title orders"> Mesa: {item.numMesa}</p>
                                <span className="menu-name text">Pedido</span>
                                {item.pedido.map((item, index) => <span className="order-kitchen" key={index}>
                                 <ul>
                                 <li> {item.countProducto} {item.nombreProducto} </li>    
                                </ul> 
                               </span>)}
                               <div className="fondoTime">
                                <span className="text-light">Tiempo de preparación: { difftime}</span>
                                </div>
                            </div>
                        </div>
                    </section>
                    : null}
                </div>                 
              )
              })}
            </div>
        </div>    
    </Fragment>
)
}

export default PedidosChef
