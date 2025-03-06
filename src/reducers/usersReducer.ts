export enum UserSortType {
    SORT_BY_NAME = "SORT_BY_NAME",
    SORT_BY_EMAIL = "SORT_BY_EMAIL",
  }
  
  export type UserSortAction = { type: UserSortType };
  
  export function usersReducer(users: any[], action: UserSortAction) {
    switch (action.type) {
      case UserSortType.SORT_BY_NAME:
        return [...users].sort((a, b) => a.name.localeCompare(b.name));
      case UserSortType.SORT_BY_EMAIL:
        return [...users].sort((a, b) => a.email.localeCompare(b.email));
      default:
        return users;
    }
  }
  