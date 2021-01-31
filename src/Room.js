import React, {useEffect} from 'react'

const Room = (props) => {
    let mediaRecorder
    useEffect(() => {
        // Run! Like go get some data from an API.
        //const socket = props.socket
        //const roomIdProps = props.roomId  
        //let roomId = roomIdProps    
        //props.setNewRoom(roomId) 
        props.socket.emit('join', props.roomId)

            //let audioPermission = false       
            navigator
              .mediaDevices
              .getUserMedia({audio: true})
              .then(stream => {
                //audioPermission = true
                mediaRecorder = new MediaRecorder(stream)
                let chunks = []
                mediaRecorder.ondataavailable = data =>{
                  // data received
                  chunks.push(data.data)
                }
                mediaRecorder.onstop = () =>{
                  //data stopped
      
                  const reader = new window.FileReader()
                  const blob = new Blob(chunks, {type: 'audio/ogg; codec=opus'})
                  reader.readAsDataURL(blob)
                  reader.onloadend = () =>{
                    props.socket.emit('sendAudio', {
                      data: reader.result,
                      room: props.roomId
                    })
                  }
      
                 chunks = []
                }
              }, err => {
                //audioPermission = false
                mediaRecorder = null
              })
              props.update(''+new Date())
        /*this.handleKey = this.handleKey.bind(this)
        this.renderMessage = this.renderMessage.bind(this)
        this.mouseUp = this.mouseUp.bind(this)
        this.mouseDown = this.mouseDown.bind(this)*/
    }, [props.roomId]);

    const mouseUp =() =>{
        mediaRecorder.stop()
    }
    const mouseDown = () =>{
        mediaRecorder.start()
    }

    const handleKey = (event) => {
       // console.log(props.a)
     
        //console.log(event.target.value)
        if (event.keyCode === 13) {
            //enviar a mensagem <enter>
            props.socket.emit('sendMsg', {
                msg: event.target.value,
                room: props.roomId
            })
            //this.msg.value = ''
        }
    }

    const renderContent = (msg) =>{
        if (msg.msgType === 'text') {
            return msg.message
        } else {
            return <audio src={msg.message} controls></audio>
        }
    }

    const renderMessage =(msg) => {
        return (
            <div className="message" key={msg._id}>
                <span className="author">{msg.author}</span>
                <br />
                <span className="msg-body">{renderContent(msg)} </span>
            </div>
        )
    }

        const room = props.roomId
        const msgs = props.msgs[room]
        return (
            <div className="room">
                <div className="messages">
                    {
                        msgs && msgs.map(renderMessage)
                    }
                </div>
                <div className="new-message-form w-form">
                    <form className="form">
                    {JSON.stringify(props.setNewRoom)}
                        <textarea id="field" className="field msg w-input" maxLength="5000" placeholder="Digite sua mensagem e pressione &lt;Enter&gt;" autoFocus onKeyUp={handleKey} /*ref={(ref) => this.msg = ref}*/></textarea>
                        <button type="button" className="send-audio w-button" onMouseDown={mouseDown} onMouseUp={mouseUp}>Enviar<br />Áudio</button>
                    </form>
                </div>
            </div>
        )
    
}

export default Room