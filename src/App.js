import { useEffect } from "react";
import Whiteboard from "./whiteboard/whiteboard";
import { connectWithSocketServer } from "./socketConn/socketConn";


function App(){
    useEffect(() =>{
        connectWithSocketServer();
    },[])
    return <div>
        <Whiteboard/>
    </div>
}


export default App;