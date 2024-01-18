import { ToolTypes } from "../../../constants";
import { createElement } from "./createElement";
import { store } from "../../store";
import { setElements } from "../whiteboard-slice";
import { emitElementUpdate } from "../../../socketConn/socketConn";

export const updateElement = ({id, x1, x2, y1, y2, type, text,index}, elements) =>{
    const elementsCopy = [...elements];

    switch(type){
        case ToolTypes.LINE:
        case ToolTypes.RECTANGLE:
            const updateElement = createElement({
                id,
                x1,
                x2,
                y1,
                y2,
                tooltype: type
            });
            elementsCopy[index] = updateElement;
            store.dispatch(setElements(elementsCopy));
            
            emitElementUpdate(updateElement);
            break;

        case ToolTypes.PENCIL:
            elementsCopy[index] = {
                ...elementsCopy[index],
                points: [
                    ...elementsCopy[index].points,
                    {
                        x: x2,
                        y: y2 
                    }
                ]
            }
            const updatedPencilElement = elementsCopy[index]

            store.dispatch(setElements(elementsCopy));

            emitElementUpdate(updatedPencilElement);
            break;
        case ToolTypes.TEXT:
            const textWidth = document.getElementById('canvas').getContext('2d').measureText(text).width;
            const textHeight = 24;
            elementsCopy[index] ={
                ...createElement({
                    id,
                    x1,
                    y1,
                    x2: x1 + textWidth,
                    y2: y1 +  textHeight, 
                    tooltype: type,
                    text
                })
            }
            const updatedTextElement =  elementsCopy[index]
            store.dispatch(setElements(elementsCopy))
            emitElementUpdate(updatedTextElement)
            break;
            default:
                throw new Error("something went wrong when updating elements");
    }
};