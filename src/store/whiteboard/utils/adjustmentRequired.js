import { ToolTypes } from "../../../constants";

export const adjustmentRequired = (type) => [ToolTypes.RECTANGLE, ToolTypes.LINE].includes(type);