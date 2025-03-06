export type ToDoState = {
    filter: "ALL" | "COMPLETED" | "PENDING";
    sort: "TITLE_ASC" | "TITLE_DESC";
  };
  
  export type ToDoAction =
    | { type: "FILTER_COMPLETED" }
    | { type: "FILTER_PENDING" }
    | { type: "FILTER_ALL" }
    | { type: "SORT_TITLE_ASC" }
    | { type: "SORT_TITLE_DESC" };
  
  export const toDoReducer = (state: ToDoState, action: ToDoAction): ToDoState => {
    switch (action.type) {
      case "FILTER_COMPLETED":
        return { ...state, filter: "COMPLETED" };
      case "FILTER_PENDING":
        return { ...state, filter: "PENDING" };
      case "FILTER_ALL":
        return { ...state, filter: "ALL" };
      case "SORT_TITLE_ASC":
        return { ...state, sort: "TITLE_ASC" };
      case "SORT_TITLE_DESC":
        return { ...state, sort: "TITLE_DESC" };
      default:
        return state;
    }
  };
  