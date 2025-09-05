import { configureStore } from '@reduxjs/toolkit';
// import { logger } from 'redux-logger';
import usersReducer from './users';

export const store = configureStore({
    reducer: {
       usersStore: usersReducer,
    },
    //TODO Remover isto para retirar os logs do redux.
    //FIXME: Temos de dar fix nisto
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([logger]),
});

export type State = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
