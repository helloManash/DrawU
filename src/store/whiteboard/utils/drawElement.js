import getStroke from "perfect-freehand";
import { ToolTypes } from "../../../constants";
import { getSvgPathFromStroke } from "./getSvgPathFromStroke";

const drawPencilElement = (context, element) =>{
    const myStroke = getStroke(element.points, {
        size: 6
    });

    const pathData = getSvgPathFromStroke(myStroke);

    const myPath = new Path2D(pathData);
    context.fill( myPath);
}

const drawTextElement = (context, element) =>{
    context.textBaseline = "top";
    context.font = "24px sans-serif";
    context.fillText(element.text, element.x1, element.y1 )
}
export const drawElement = ({roughCanvas, context, element}) =>{
    switch (element.type){
        case ToolTypes.RECTANGLE:
        case ToolTypes.LINE:
            return roughCanvas.draw(element.roughElement);
        case ToolTypes.PENCIL:
             drawPencilElement(context, element);
             break;

        case ToolTypes.TEXT:
            drawTextElement(context, element);
            break;
        default:
            throw new Error("Something went wrong when drawing element");
    }
}