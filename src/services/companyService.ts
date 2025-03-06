import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { Company } from "../types/company";

const COMPANIES_API = `${API_BASE_URL}/companies`;

const saveToLocalStorage = (companies: Company[]) => {
  localStorage.setItem("companies", JSON.stringify(companies));
};

const getFromLocalStorage = (): Company[] => {
  const data = localStorage.getItem("companies");
  return data ? JSON.parse(data) : [];
};

// Fetch Companies and Save to Local Storage
const fetchCompanies = async (): Promise<Company[]> => {
  const response = await axios.get(COMPANIES_API);
  const companies = response.data;
  saveToLocalStorage(companies);
  return companies;
};

export const useCompanies = () => {
  return useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const localData = getFromLocalStorage();
      return localData.length > 0 ? localData : fetchCompanies();
    },
  });
};

// Create Company and Save to Local Storage
export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (company: Omit<Company, "id">) => {
      const newCompany = { ...company, id: Date.now() }; // Fake ID for local storage
      const updatedCompanies = [...getFromLocalStorage(), newCompany];
      saveToLocalStorage(updatedCompanies);
      return newCompany;
    },
    onSuccess: (newCompany) => {
      queryClient.setQueryData(["companies"], (oldCompanies: Company[] = []) => [...oldCompanies, newCompany]);
    },
  });
};

// Update Company in Local Storage
export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedCompany: Company) => {
      const updatedCompanies = getFromLocalStorage().map((company) =>
        company.id === updatedCompany.id ? updatedCompany : company
      );
      saveToLocalStorage(updatedCompanies);
      return updatedCompany;
    },
    onSuccess: (updatedCompany) => {
      queryClient.setQueryData(["companies"], (oldCompanies: Company[] = []) =>
        oldCompanies.map((company) => (company.id === updatedCompany.id ? updatedCompany : company))
      );
    },
  });
};

// Delete Company from Local Storage
export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (companyId: number) => {
      const updatedCompanies = getFromLocalStorage().filter((company) => company.id !== companyId);
      saveToLocalStorage(updatedCompanies);
      return companyId;
    },
    onSuccess: (deletedCompanyId) => {
      queryClient.setQueryData(["companies"], (oldCompanies: Company[] = []) =>
        oldCompanies.filter((company) => company.id !== deletedCompanyId)
      );
    },
  });
};
