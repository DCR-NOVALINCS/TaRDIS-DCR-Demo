import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { State, AppDispatch } from '.'
import type { State as UsersState } from './users'


export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<State> = useSelector

export const useUserSelector: TypedUseSelectorHook<UsersState> = 
<T>(f: (state: UsersState) => T) => useAppSelector((state: State) => f(state.usersStore))