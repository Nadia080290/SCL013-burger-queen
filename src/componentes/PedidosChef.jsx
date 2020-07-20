import React, { Fragment } from 'react'
import { db } from '../firebase'
import '../estilos/pedidoschef.css'
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import 'moment/locale/es';


const hmh = require('hmh');



const PedidosChef = () => {

    const [orders, getOrders] = React.useState([])
    const [orderdone, setOrderDone] = React.useState([])
    const [delivery, setDelivery] = React.useState([])
    const [isOpen, setIsOpen] = React.useState(false)

    React.useEffect(() => {
        const citiesRef = db.collection('pedidos');
        citiesRef.where('status', '==', 'pending').orderBy('hourSend','desc').onSnapshot({ includeMetadataChanges: true }, (snap => {
            const pedidos = snap.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            getOrders(pedidos);
        })
        )
        db.collection('pedidos').where('status', '==', 'delivered').onSnapshot((snap => {
            const pedidos = snap.docs.map((doc) => ({
              id: doc.id,
              ...doc.data()
            }))
            setDelivery(pedidos);
        })
        )
    }, [])
    
    const showModal = (id) => {
     console.log(id,'soy el id que pasa el 1 boton') 
     setIsOpen(true);

    };
    const hideModal = () => {
      setIsOpen(false);
    };
    /* const modalLoaded = () => {
        setDeleteOrder();
        console.log(id,'soy el id dentro del modal') 
      };
 */

    /* const deleteOrder =  => {
      db.collection("pedidos").doc(order.id).delete()
      console.log(order.id);
     }; */

     const deleteOrder = async (id) => {
        try {
          await db.collection('pedidos').doc(id).delete()
          console.log(id) 
        } catch (error) {
          console.log(error)
        }
    }


    const orderDone = (item) => {
        db.collection('pedidos').doc(item.id).update({
            status: 'done',
            hourDone: new Date().getTime(),
        })
        .then(() => {
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
            <h2 className="font-italic">Pedidos a realizar</h2>
            <div className="row row-cols-3 ">
                {orders.map((order) => { 
                return (
                    <div className="h5 font-italic">
                        <section className="section" id={order.id}>
                            <div className="row columnLength">
                            <p className="text client-text"> Dia:{moment(order.hourSend).format('MMMM Do YYYY, h:mm:ss a')}</p>
                                <p className="text client-text"> Hora:{moment(order.hourSend).format('LTS')}</p>
                                <p className="text client-text orders"> Cliente: {order.cliente}</p>
                                <p className="text client-text orders"> Mesas: {order.numMesa}</p>
                                <span className="menu-name text text-light">Pedido</span>
                                {order.pedido.map(item => <span className="order-kitchen" key={item.id}>
                                    <ul>
                                        <li> {item.countProducto} {item.nombreProducto} </li>    
                                    </ul> 
                                </span>)} 
                                <div className="orders footer">
                                    <button className="btn btn-dark" onClick={() => showModal(order.id)}>Cancelar</button>
                                    <button className="btn btn-light ok" onClick={() => orderDone(order)}>Listo</button>
                               </div>
                            </div>
                        </section>
                        <>
                        <Modal  onExit={order.id} show={isOpen} onHide={hideModal} onEntered={deleteOrder}>
                        <Modal.Header>
                        <Modal.Title></Modal.Title>  
                        </Modal.Header>
                        <Modal.Body>¿ Estas seguro que quieres cancelar este pedido ?</Modal.Body>
                        <Modal.Footer onExit={order.id}>
                        <button onClick={hideModal}>Cancel</button>
                        <button  type="submit" class="btn btn-warning" onClick={deleteOrder}>Aceptar</button>
                        </Modal.Footer>
                        </Modal>
                        </>
                          </div>
                )
                })}
            </div>
        </div>
        <div className="container">
          <h2 className="font-italic">Pedidos entregados</h2>
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
                                <p className="text client-text "> Dia: {moment(item.orhourDone).subtract(10, 'days').calendar()}</p>
                                <p className="text client-text"> Hora: {moment(item.orhourDone).format('LTS')}</p>
                                <p className="card-title orders"> Cliente: {item.cliente}</p>
                                <p className="card-title orders"> Mesa: {item.numMesa}</p>
                                <span className="menu-name text text-light">Pedido</span>
                                {item.pedido.map((item, index) => <span className="order-kitchen" key={index}>
                                 <ul>
                                 <li> {item.countProducto} {item.nombreProducto} </li>    
                                </ul> 
                               </span>)}
                                <span className="bg-dark text-light">Tiempo de preparacion:{difftime}</span>
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
