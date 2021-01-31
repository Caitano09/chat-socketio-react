import React, {useState, useEffect, useRef} from 'react'
import io from 'socket.io-client'
import { Route, Link } from 'react-router-dom'
import Room from './Room'
import SelectRoom from './SelectRoom'

const Rooms = (props) => {
    const token = window.localStorage.getItem('token')
    const socket = io('http://localhost:3001?token=' + token)
    const [rooms, setRoom] = useState([])
    const [msgs, setMsg] = useState({})
    const roomId = useRef('') 
    const [aux, setAux] = useState('') 
    const refMsgs = useRef({})

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
                
                if (! refMsgs.current[msg.room]) {
                    console.log('if')
                    const newMsgs = { ...refMsgs.current }
                    newMsgs[msg.room] = [msg]
                    setMsg(newMsgs)
                    refMsgs.current = newMsgs
                } else {
                    console.log('else')
                    const newMsgs = { ...refMsgs.current }
                    newMsgs[msg.room].push(msg)
                    setMsg(newMsgs)
                    refMsgs.current = newMsgs
                }
                //CAUTION
                console.log('----------------')
                if (msg.room !== roomId.current) {
                    const room = rooms.find(room => room._id === msg.room)
                    const ind = rooms.indexOf(room)
                    const numRooms = [...rooms]
                    console.log(room)
                    if (!room.count) {
                        room.count = 0
                    }
                    room.count++
                    numRooms[ind] = room
                    setRoom(numRooms)
                }
            })
    
            socket.on('newAudio', msg => {
                if (! refMsgs.current[msg.room]) {
                    const newMsgs = { ...refMsgs.current }
                    newMsgs[msg.room] = [msg]
                    setMsg(newMsgs)
                    refMsgs.current = newMsgs
                } else {
                    const newMsgs = { ...refMsgs.current }
                    newMsgs[msg.room].push(msg)
                    setMsg(newMsgs)
                    refMsgs.current = newMsgs
                }
                console.log('----------------')
                if (msg.room !== roomId.current) {
                    const room = rooms.find(room => room._id === msg.room)
                    const ind = rooms.indexOf(room)
                    const numRooms = [...rooms]
                    console.log(room)
                    if (!room.count) {
                        room.count = 0
                    }
                    room.count++
                    numRooms[ind] = room
                    setRoom(numRooms)
                }
            })
    
            socket.on('msgsList', msgs1 => {
                //console.log('msgs', msgs[Object.keys(msgs)[Object.keys(msgs).length - 1]].messa)
                if (msgs1.length > 0) {
                    const msgsTmp = { ...msgs1 }
                    msgsTmp[msgs1[0].room] = msgs1
                    refMsgs.current = msgsTmp
                    setMsg(msgsTmp)

    
                }
            })
    
            /*this.socket = socket
            this.addNewRoom = this.addNewRoom.bind(this)
            this.setRoom = this.setRoom.bind(this)*/
        
        },[roomId.current]);


    const addNewRoom = () => {
        const roomName = prompt('Informe o nome da sala')
        if (roomName) {
            this.socket.emit('addRoom', roomName)
        }
    }

    const setNewRoom = (e) => {
        roomId.current = e.target.name
        const room = rooms.find(room => room._id === roomId.current)
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
    const teste = (newRoomId) =>{
        roomId.current = newRoomId
        const room = rooms.find(room => room._id === roomId.current)
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
                                    
                                            {room._id === roomId.current && ' >> '} {room.name} {!!room.count && <span>({room.count})</span>}
                                        </Link>
                                    </li>
                                )
                            })

                        }
                    </ul>
                    <div className="add-room" onClick={addNewRoom}>+</div>
                </div>

                <Route path='/rooms' exact component={SelectRoom} />
                {/*<Route path='/rooms/:room' component={() => <Room socket={socket} msgs={msgs} roomId={roomId}  update={willUpdateEffect}/>} />*/}
                <Route path='/rooms/:room' render={(props) => <Room {...props} socket={socket} msgs={msgs} setNewRoom={teste} roomId={roomId} />} /> 

            </div>
        )
    
}

export default Rooms