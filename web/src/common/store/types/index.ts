import type { UserState } from './user'

export * from './user'

export interface StoreState {
  user: UserState | Record<string, never>
}
