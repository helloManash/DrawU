import React from 'react';
import rectangleIcon from '../resources/icons/rectangle.svg';
import lineIcon from '../resources/icons/line.svg';
import rubberIcon from '../resources/icons/rubber.svg';
import pencilIcon from '../resources/icons/pencil.svg';
import textIcon from'../resources/icons/text.svg';
import selectIcon from '../resources/icons/selection.svg';
import { ToolTypes } from '../constants';
import { useDispatch, useSelector } from 'react-redux';
import { setElements, setToolType } from '../store/whiteboard/whiteboard-slice';
import { emitClearWhiteboard } from '../socketConn/socketConn';

const IconButton = ({src, type, isRubber}) =>{ 

    const dispatch = useDispatch();

    const handleToolChange = () =>{
        dispatch(setToolType(type));
    }
    const handleClearCanvas = () =>{
        dispatch(setElements([]));

        emitClearWhiteboard();

    }

    const selectedToolType = useSelector((state) =>state.whiteboard.tool);
    return <button onClick={isRubber ? handleClearCanvas: handleToolChange} className={selectedToolType === type ? "menu-button-active":"menu-button"}>
        <img width='80%' height='80%' src={src}/>

    </button>
}



const Menu = () =>{
    return (
        <div className='menu-container'>
            <IconButton src={rectangleIcon} type={ToolTypes.RECTANGLE}/>
            <IconButton src={lineIcon} type={ToolTypes.LINE}/> 
            <IconButton src={rubberIcon} isRubber/>
            <IconButton src={pencilIcon} type={ToolTypes.PENCIL}/>
            <IconButton src={textIcon} type={ToolTypes.TEXT}/>
            <IconButton src={selectIcon} type={ToolTypes.SELECTION}/>
        </div>
    );
}

export default Menu;