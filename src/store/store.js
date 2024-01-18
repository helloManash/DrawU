import { configureStore } from "@reduxjs/toolkit";
import { whiteboardSlice } from "./whiteboard/whiteboard-slice";


export const store = configureStore({
    reducer: {
        whiteboard: whiteboardSlice.reducer,        
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        serializableCheck: {
            ignoreActions: ['whiteboard/setElements'],
            ignoredPaths: ['whiteboard.elements'],
        }
    }),
});