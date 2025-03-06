export enum CompanySortType {
    SORT_BY_NAME = "SORT_BY_NAME",
    SORT_BY_REVENUE = "SORT_BY_REVENUE",
    SORT_BY_INDUSTRY = "SORT_BY_INDUSTRY",
  }
  
  export type CompanySortAction = { type: CompanySortType };
  
  export function companiesReducer(companies: any[], action: CompanySortAction) {
    switch (action.type) {
      case CompanySortType.SORT_BY_NAME:
        return [...companies].sort((a, b) => a.name.localeCompare(b.name));
      case CompanySortType.SORT_BY_REVENUE:
        return [...companies].sort((a, b) => a.revenue - b.revenue);
      case CompanySortType.SORT_BY_INDUSTRY:
        return [...companies].sort((a, b) => a.industry.localeCompare(b.industry));
      default:
        return companies;
    }
  }
  