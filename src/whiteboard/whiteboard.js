import React, { useLayoutEffect, useRef, useState } from 'react';
import Menu from './menu';
import rough from 'roughjs';
import { useSelector, useDispatch } from 'react-redux';
import { ToolTypes,actions, cursorPositions } from '../constants';
import { adjustElementCoordinates, adjustmentRequired, createElement, drawElement, getCursorForPosition, getElementAtPosition, updateElement } from '../store/whiteboard/utils';
import {v4 as uuid} from 'uuid';
import { updateElement as updatedElementInStore } from '../store/whiteboard/whiteboard-slice';

// let selectedElement;

// const setSelectedElement = (el) =>{
//     selectedElement = el;
// }

const Whiteboard = () =>{

    const dispatch = useDispatch();
    const canvasRef = useRef();
    const textAreaRef = useRef();
    const toolType = useSelector((state) => state.whiteboard.tool);
    const elements = useSelector((state) => state.whiteboard.elements);
    const [action, setAction] = useState(null);
    const [selectedElement, setSelectedElement] = useState(null);
    useLayoutEffect(() =>{
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const roughCanvas = rough.canvas(canvas);
        elements.forEach(element => {
            drawElement({roughCanvas, context: ctx, element});
        });
    }, [elements]);

    const handleMouseUp = () =>{

        const selectedElementIndex = elements.findIndex(el => el.id === selectedElement?.id);

        if(selectedElementIndex !== -1){
            if(action === actions.DRAWING){
                if(adjustmentRequired(elements[selectedElementIndex].type)){
                    const {x1, y1, x2, y2}= adjustElementCoordinates(elements[selectedElementIndex]);

                    updateElement({
                        id: selectedElement.id,
                        index: selectedElementIndex,
                        x1,
                        x2,
                        y1,
                        y2,
                        type: elements[selectedElementIndex].type
                    }, elements)
                }
            }
        }
        setAction(null);
        setSelectedElement(null);
    };

    const handleMouseMove = (event) =>{
        const { clientX, clientY} = event;

        if(action === actions.DRAWING){
            // find index of the selected elements
            const index = elements.findIndex(el => el.id === selectedElement.id);

            if(index !== -1){
                updateElement({
                    index,
                    id: elements[index].id,
                    x1: elements[index].x1,
                    y1: elements[index].y1,
                    x2: clientX,
                    y2: clientY,
                    type: elements[index].type,

                }, 
                elements
                );
            }
        }

        if(toolType === ToolTypes.SELECTION){
              const element = getElementAtPosition(clientX,clientY, elements);
              event.target.style.cursor = element? getCursorForPosition(element.position):"default";
              
        }
        if(toolType === ToolTypes.SELECTION && action === actions.MOVING && selectedElement){
            const { id, x1, x2, y1, y2, type, offsetX, offsetY} = selectedElement;

            const width = x2 - x1;
            const height = y2 - y1;

            const newX1 = clientX - offsetX;
            const newY1 = clientY - offsetY;

            const index = elements.findIndex(el => el.id === selectedElement.id);
            if(index !== -1){
                updateElement({id, x1: newX1, y1: newY1, x2: newX1 + width, y2 : newY1 + height, type, index }, elements)
            }
        }
        if(toolType === ToolTypes.SELECTION && action === actions.MOVING && selectedElement){
            const { id, x1, x2, y1, y2, type, offsetX, offsetY} = selectedElement;
        }
    };

    const handleMouseDown = (event) =>{
        const {clientX, clientY} = event;
        
        if(selectedElement && action === actions.WRITING){
            return ;
        }
        

        switch(toolType){
            case ToolTypes.RECTANGLE:
            case ToolTypes.LINE:
            case ToolTypes.PENCIL:
                {setAction(actions.DRAWING);
                    const element = createElement({
                        x1: clientX,
                        y1: clientY,
                        x2: clientX,
                        y2: clientY,
                        tooltype: toolType,
                        id: uuid(),
                    });
                    setSelectedElement(element);
        dispatch(updatedElementInStore(element));
                break;}
            case ToolTypes.TEXT:
                {
                    const element = createElement({
                        x1: clientX,
                        y1: clientY,
                        x2: clientX,
                        y2: clientY,
                        tooltype: toolType,
                        id: uuid(),
                    });
                setAction(actions.WRITING);
                setSelectedElement(element);
        dispatch(updatedElementInStore(element));
                break;
            }
            case ToolTypes.SELECTION:{
                const element = getElementAtPosition(clientX, clientY, elements);
                if(element && element.type === ToolTypes.RECTANGLE){
                    setAction(element.position === cursorPositions.INSIDE?actions.MOVING: actions.RESIZING);
                    const offsetX = clientX - element.x1;
                    const offsetY = clientY - element.y1;

                    setSelectedElement({...element, offsetX, offsetY});
                }
                break;
            }
        }
         
    };

    
    const handleTextAreaBlur = (event) =>{
        const {id, x1, y1, type} = selectedElement;
        const index = elements.findIndex(el => el.id === selectedElement.id);

        if(index !== -1){
            updateElement({
                id, x1, y1, type, text: event.target.value, index
            }, elements);
            setAction(null);
            setSelectedElement(null);
        }
    }

    return (
        <>
            <Menu/>
            {action === actions.WRITING ? <textarea ref={textAreaRef} onBlur={handleTextAreaBlur} style={{
                position: 'absolute',
                top: selectedElement.y1 - 3,
                left: selectedElement.x1,
                front: '24px sans-serif',
                margin: 0,
                padding: 0,
                border: 0,
                outline: 0,
                resize: 'auto',
                overflow: 'hidden',
                whiteSpace: 'pre',
                background: 'transparent',

            }}/> : null}
            <canvas
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            ref={canvasRef}
            width={window.innerWidth}
            height={window.innerHeight}
            id="canvas"
            />
        </>
    );
}

export default Whiteboard;