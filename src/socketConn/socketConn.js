import {io} from "socket.io-client";
import { store } from "../store/store";
import { setElements, updateElement } from "../store/whiteboard/whiteboard-slice";

let socket;


export const connectWithSocketServer = () =>{
    socket = io("http://localhost:3005");
    socket.on("connect", () =>{
        console.log("connected to socket.io server");
    })

    socket.on('whiteboard-state', (elements) =>{
        store.dispatch(setElements(elements));
    });

    socket.on('element-update', (elementData)=>{
        store.dispatch(updateElement(elementData));
    })
    socket.on('whiteboard-clear', () =>{
        store.dispatch(setElements([]));
    })
}

export const emitElementUpdate = (elementData) =>{
    socket.emit("element-update", elementData);
};

export const emitClearWhiteboard = () =>{
    socket.emit("whiteboard-clear");
}

