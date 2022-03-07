import { Todo } from "./type";
import { v1 as uuid } from "uuid";
import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";

// Action Constants:
const CREATE_TODO = 'CREATE_TODO';
const DELETE_TODO = 'DELETE_TODO';
const EDIT_TODO = 'EDIT_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const SELECT_TODO = 'SELECT_TODO';

// Actions and Action Types
// CREATE_TODO
interface CreateTodoAction {
    type: typeof CREATE_TODO;
    payload: Todo
}

export const createTodoActionCreator = ({desc}: {
    desc: string,
}): CreateTodoAction => {
    return {
        type: CREATE_TODO,
        payload: {
            id: uuid(),
            desc,
            isComplete: false,
        }
    }
}

// EDIT_TODO
interface EditTodoAction {
    type: typeof EDIT_TODO;
    payload: {
        id: string,
        desc: string,
    }
}

export const editTodoActionCreator = ({id, desc}: {
    id: string,
    desc: string,
}): EditTodoAction => {
    return {
        type: EDIT_TODO,
        payload: {
            id,
            desc,
        }
    }
}

//TOGGLE_TODO
interface ToggleTodoAction {
    type: typeof TOGGLE_TODO;
    payload: {
        id: string,
        isComplete: boolean,
    }
}

export const toggleTodoActionCreator = ({id, isComplete}: {
    id: string,
    isComplete: boolean,
}): ToggleTodoAction => {
    return {
        type: TOGGLE_TODO,
        payload: {
            id,
            isComplete,
        }
    }
}

// DELETE_TODO
interface DeleteTodoAction {
    type: typeof DELETE_TODO;
    payload: {
        id: string,
    }
}

export const deleteTodoActionCreator = ({id}: {
    id: string,
}): DeleteTodoAction => {
    return {
        type: DELETE_TODO,
        payload: {
            id,
        }
    }
}

// SELECT_TODO
interface SelectTodoAction {
    type: typeof SELECT_TODO;
    payload: { id: string }
}

export const selectTodoActionCreator = ({id}: {
    id: string,
}): SelectTodoAction => {
    return {
        type: SELECT_TODO,
        payload: {
            id,
        }
    }
}

// Reducers
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

type TodoActionTypes = CreateTodoAction | EditTodoAction | ToggleTodoAction | DeleteTodoAction;

const todosReducer = (state: Todo[] = todosInitialState, action: TodoActionTypes) => {
    switch (action.type) {
        // We can't mutate the state directly, so we create a new one
        case CREATE_TODO: {
            const { payload } = action;
            return [...state, payload];
        }
        case EDIT_TODO: {
            const { payload } = action;
            return state.map(todo => {
                if (todo.id === payload.id) {
                    return {
                        ...todo,
                        desc: payload.desc,
                    }
                }
                return todo;
            });
        }
        case TOGGLE_TODO: {
            const { payload } = action;
            return state.map(todo => {
                if (todo.id === payload.id) {
                    return {
                        ...todo,
                        isComplete: payload.isComplete,
                    }
                }
                return todo;
            });
        }
        case DELETE_TODO: {
            const { payload } = action;
            return state.filter(todo => todo.id !== payload.id);
        }
        default:
            return state;
    }
}

type SelectedTodoActionTypes = SelectTodoAction;
const selectedTodoReducer = (state: string | null = null, action: SelectedTodoActionTypes) => {
    switch (action.type) {
        case SELECT_TODO: {
            const { payload } = action;
            return payload.id;
        }
        default:
            return state;
    }
}

const counterReducer = (state: number = 0, action: TodoActionTypes) => {
    switch (action.type) {
        case CREATE_TODO:
            return state + 1;
        case EDIT_TODO:
            return state + 1;
        case DELETE_TODO:
            return state + 1;
        case TOGGLE_TODO:
            return state + 1;
        default:
            return state;
    }
}

// Combining Reducers
const reducers = combineReducers({
    todos: todosReducer,
    selectedTodo: selectedTodoReducer,
    counter: counterReducer,
})

// Create Store
export default createStore(
    reducers,
    composeWithDevTools(
        applyMiddleware(thunk, logger),
    )
);