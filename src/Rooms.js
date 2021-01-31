import React, {useState, useEffect} from 'react'
import io from 'socket.io-client'
import { Route, Link } from 'react-router-dom'
import Room from './Room'
import SelectRoom from './SelectRoom'

const Rooms = () => {
    const token = window.localStorage.getItem('token')
    const socket = io('http://localhost:3001?token=' + token)
    const [rooms, setRoom] = useState([])
    const [msgs, setMsg] = useState({})
    const [roomId, setRoomId] = useState('') 
    const [aux, setAux] = useState('') 

    const willUpdateEffect = (update) =>{
        if(aux !== update){
            setAux(update)   
        }
    }
    useEffect(() => {
        // Run! Like go get some data from an API.

    
    
            //nova sala é adicionada
            socket.on('newRoom', room => {
                setRoom([...rooms, room])
            })
    
            // recebe a lista inicial de rooms
            socket.on('roomList', rooms => {
                setRoom(rooms)
            })
    
            socket.on('newMsg', msg => {
                if (! msgs[msg.room]) {
                    const newMsgs = { ...msgs }
                    newMsgs[msg.room] = [msg]
                    setMsg(newMsgs)
                } else {
                    const newMsgs = { ...msgs }
                    newMsgs[msg.room].push(msg)
                    setMsg(newMsgs)
                }
                //CAUTION
                if (msg.room !== roomId) {
                    const room = rooms.find(room => room._id === msg.room)
                    const ind = rooms.indexOf(room)
                    const numRooms = [...rooms]
                    if (!room.count) {
                        room.count = 0
                    }
                    room.count++
                    numRooms[ind] = room
                    setRoom(numRooms)
                }
            })
    
            socket.on('newAudio', msg => {
                if (! msgs[msg.room]) {
                    const newMsgs = { ...msgs }
                    newMsgs[msg.room] = [msg]
                    setMsg(newMsgs)
                } else {
                    const newMsgs = { ...msgs }
                    newMsgs[msg.room].push(msg)
                    setMsg(newMsgs)
                }
    
                if (msg.room !== roomId) {
                    const room = rooms.find(room => room._id === msg.room)
                    const ind = rooms.indexOf(room)
                    const numRooms = [...rooms]
                    if (!room.count) {
                        room.count = 0
                    }
                    room.count++
                    numRooms[ind] = room
                    setRoom(numRooms)
                }
            })
    
            socket.on('msgsList', msgs => {
                if (msgs.length > 0) {
                    const msgsTmp = { ...msgs }
                    msgsTmp[msgs[0].room] = msgs
                    setMsg(msgsTmp)
                }
            })
    
            /*this.socket = socket
            this.addNewRoom = this.addNewRoom.bind(this)
            this.setRoom = this.setRoom.bind(this)*/
        
        },[aux]);


    const addNewRoom = () => {
        const roomName = prompt('Informe o nome da sala')
        if (roomName) {
            this.socket.emit('addRoom', roomName)
        }
    }

    const setNewRoom = (e) => {
        setRoomId(e.target.name)
        const room = rooms.find(room => room._id === roomId)
        if (room) {
            const ind = rooms.indexOf(room)

            const newRooms = [...rooms]
            if (room.count) {
                room.count = 0
            }
            newRooms[ind] = room
            setRoom(newRooms)
        }
    }
    /*const teste = (e) =>{
        setRoomId(e.target.name)
        setNewRoom()
    }*/

        return (
            <div className="container w-container">
                <div className="rooms">
                    <h1 className="title-rooms">Salas Disponíveis</h1>
                    <ul className="room-list w-list-unstyled">
                        {
                            rooms.map(room => {
                                return (
                                    <li className="room-item" key={room._id} >
                                
                                        <Link to={`/rooms/${room._id}`} name={room._id} onClick={setNewRoom} >
                                    
                                            {room._id === roomId && ' >> '} {room.name} {!!room.count && <span>({room.count})</span>}
                                        </Link>
                                    </li>
                                )
                            })

                        }
                    </ul>
                    <div className="add-room" onClick={addNewRoom}>+</div>
                </div>

                <Route path='/rooms' exact component={SelectRoom} />
                <Route path='/rooms/:room' component={() => <Room socket={socket} msgs={msgs} roomId={roomId}  update={willUpdateEffect}/>} />
                {/*<Route path='/rooms/:room' render={(props) => <Room {...props} socket={socket} msgs={msgs} setNewRoom={setNewRoom} roomId={roomId} />} /> */}

            </div>
        )
    
}

export default Rooms