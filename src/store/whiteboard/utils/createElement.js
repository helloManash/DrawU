import { ToolTypes } from "../../../constants";
import rough from 'roughjs';

const generator = rough.generator();

const generateRectangle = ({x1, y1, x2, y2}) =>{
    return generator.rectangle(x1, y1, x2 - x1, y2 - y1);
};

const generateLine = ({x1, y1, x2, y2}) =>{
    return generator.line(x1, y1, x2, y2);
}

export const createElement = ({x1, y1, x2, y2, tooltype, id, text}) =>{
    let roughElement;
    // console.log(tooltype)
    switch (tooltype){
        case ToolTypes.RECTANGLE:
            roughElement = generateRectangle({x1, y1, x2, y2});
            return {
                id: id,
                roughElement,
                type: tooltype,
                x1, 
                y1,
                x2,
                y2,
            };
        case ToolTypes.LINE:
            roughElement = generateLine({x1, y1, x2, y2});
            return {
                id: id,
                roughElement,
                type: tooltype,
                x1, 
                y1,
                x2,
                y2,
            };
        case ToolTypes.PENCIL:
            return {
                id,
                type: tooltype,
                points: [{x: x1, y: y1}],
            }
        case ToolTypes.TEXT:
            return {id, type: tooltype, x1, y1, text: text || ""}
        default:
            throw new Error('Something went wrong when creating element');
    }
}