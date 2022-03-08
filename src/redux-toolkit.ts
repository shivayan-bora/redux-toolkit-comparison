import { createSlice, PayloadAction, configureStore } from '@reduxjs/toolkit'
import { Todo } from './type';
import { v1 as uuid } from "uuid";
import logger from 'redux-logger';

// Initial State
const todosInitialState: Todo[] = [
  {
    id: uuid(),
    desc: "Learn React",
    isComplete: true
  },
  {
    id: uuid(),
    desc: "Learn Redux",
    isComplete: true
  },
  {
    id: uuid(),
    desc: "Learn Redux-ToolKit",
    isComplete: false
  }
];

// Create Slices
// Automatically creates action creators and action types for the given reducer and state
const todosSlice = createSlice({
    name: 'todos',
    // Non-primitive state
    initialState: todosInitialState, // Mandatory parameter
    reducers: {
        // Action creators
        // Usually action creators consist of two things:
        // 1. key which is used to identify the action
        // 2. a function to update the state
        // Since we need to call uuid() to create ID, and the reducer is supposed to be a pure function, we need to write create in the following manner:
        // Action Type: todos/create
        create: { 
            reducer: (state, action: PayloadAction<{id: string; desc: string; isComplete: boolean}>) => {
                state.push(action.payload);
            },
            // Prepares our action in a way that the reducer can use it
            prepare: ({ desc }: { desc: string }) => ({
                payload: {
                    id: uuid(),
                    desc,
                    isComplete: false,
                }
            }),
        },
        // state: Current State
        // action: Action
        // When we use createSlice, we need to have a payload in the action›
        // To specify the payload, we use the PayloadAction type
        // Action Type: todos/edit
        edit: (state, {payload}: PayloadAction<{id: string, desc: string,}>) => {
            // Using immer, we can mutate the state value directly
            const todoToEdit = state.find(todo => todo.id === payload.id);
            if(todoToEdit) {
                todoToEdit.desc = payload.desc;
            }
        },
        // Action Type: todos/toggle
        toggle: (state, {payload}: PayloadAction<{id: string, isComplete: boolean,}>) => {
            const todoToToggle = state.find(todo => todo.id === payload.id);
            if(todoToToggle) {
                todoToToggle.isComplete = payload.isComplete;
            }
        },
        // Action Type: todos/delete
        remove: (state, {payload}: PayloadAction<{id: string,}>) => {
            const index = state.findIndex(todo => todo.id === payload.id)
            if(index !== -1) {
                state.splice(index, 1);
            }
        }
    }
});

const selecetedTodoSlice = createSlice({
    name: 'selectedTodo',
    // Primitive type of state
    initialState: null as string | null,
    reducers: {
        // In case of primitive state, just return the state as mutating the state won't work in redux-toolkit as taht's taken care by immer library
        // Action Type: selectedTodo/select
        select: (state, {payload}: PayloadAction<{id: string}>) => payload.id
    }
})

// We need to update the counter on any action on the todosSlice
const counterSlice = createSlice({
    name: 'counter',
    // Primitive State
    initialState: 0,
    // It doesn't have it's own reducer
    reducers: {},
    // It will update the state on any action on the todosSlice
    extraReducers: {
        [todosSlice.actions.create.type]: (state) => state + 1,
        [todosSlice.actions.edit.type]: (state) => state + 1,
        [todosSlice.actions.remove.type]: (state) => state + 1,
        [todosSlice.actions.toggle.type]: (state) => state + 1,
    }
})

// Export the actions
export const { 
    create: createTodoActionCreator,
    edit: editTodoActionCreator,
    toggle: toggleTodoActionCreator,
    remove: deleteTodoActionCreator,
} = todosSlice.actions;

export const { select: selectTodoActionCreator } = selecetedTodoSlice.actions;

// Combine all the reducers
const reducers = {
    // For each slice,take their reducers
    todos: todosSlice.reducer,
    selectedTodo: selecetedTodoSlice.reducer,
    counter: counterSlice.reducer
}

// Create the store
export default configureStore({
    // Automatically combines reducers
    reducer: reducers,
    // Automatically connects some of the default middlewares like Thunk
    // We can also add our own middlewares but we need to add the default middlewares first
    // To remove default middleware, add an empty array []
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    // Dev Tools is turned on by default, make sure to turn it off in production
    devTools: process.env.NODE_ENV !== 'production'
})