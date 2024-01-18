import { createSlice } from "@reduxjs/toolkit";

export const whiteboardSlice = createSlice({
    name: 'whiteboard',
    initialState: {
        tool: null,
        elements: [],
    },
    reducers:{
        setToolType: (state,action)=>{
            state.tool = action.payload;
        },
        updateElement: (state, action) =>{
        
            const {id} = action.payload;

            const index = state.elements.findIndex((element) => element.id === id);
            if(index === -1){
                state.elements.push(action.payload);
            }else{
               
                state.elements[index] = action.payload;
                // if index is found, update element in our array of elements
            }
        },
        setElements: (state, action) =>{
            state.elements = action.payload;
        }


    }
})

export const {setToolType, updateElement, setElements} = whiteboardSlice.actions;