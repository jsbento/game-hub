import React, { useEffect, useState, useCallback } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

const Chat: React.FC = () => {
    const [ message, setMessage ] = useState<string>("");
    const [ messageHistory, setMessageHistory ] = useState<string[]>([]);

    const { sendMessage, lastMessage, readyState } = useWebSocket("ws://localhost:8080/ws-chat");

    useEffect(() => {
        if( lastMessage !== null ) {
            setMessageHistory( history => [...history, lastMessage.data] );
        }
    }, [ lastMessage, setMessageHistory ]);

    useEffect(() => {
        console.log( message )
    }, [ message ])

    const handleSendMessage = useCallback(() => sendMessage( message ), [ message ]);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    } [ readyState ];

    return (
        <>
            <div>
                <h1>WebSocket Chat</h1>
                <p>Connection Status: { connectionStatus }</p>
            </div>
            <div>
                <h2>Message History</h2>
                <ul>
                    { messageHistory.map(( message, index ) => <li key={ index }>{ message }</li> ) }
                </ul>
            </div>
            <div>
                <button onClick={ handleSendMessage } disabled={ readyState !== ReadyState.OPEN }>Send message</button>
                <input type="text" size={ 64 } autoFocus={ true } onChange={ e => setMessage( e.target.value )}/>
            </div>
        </>
    );
}

export default Chat;