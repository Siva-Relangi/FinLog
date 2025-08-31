import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  clearAll as clearAllStorage,
  loadCategories,
  loadExpenses,
  saveCategories,
  saveExpenses,
} from "../storage/storage";
import type { Category, Expense, Filters } from "../types";

const DEFAULT_CATEGORIES: Category[] = [
  { id: "food", name: "Food", iconName: "restaurant-outline" },
  { id: "transport", name: "Transport", iconName: "car-outline" },
  { id: "shopping", name: "Shopping", iconName: "cart-outline" },
  { id: "bills", name: "Bills", iconName: "card-outline" },
  {
    id: "other",
    name: "Other",
    iconName: "ellipsis-horizontal-circle-outline",
  },
];

type DataContextType = {
  expenses: Expense[];
  categories: Category[];
  filters: Filters;
  addExpense: (e: Omit<Expense, "id">) => Promise<void>;
  addCategory: (name: string, icon?: string) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
  setFilters: (f: Partial<Filters>) => void;
  clearAll: () => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFiltersState] = useState<Filters>({
    sortBy: "latest",
    search: "",
  });

  useEffect(() => {
    (async () => {
      const [e, c] = await Promise.all([loadExpenses(), loadCategories()]);
      if (!c || c.length === 0) {
        setCategories(DEFAULT_CATEGORIES);
        await saveCategories(DEFAULT_CATEGORIES);
      } else {
        // Migrate categories that lack iconName
        const migrated = c.map((cat) => ({
          ...cat,
          iconName: cat.iconName || "pricetag-outline",
        }));
        setCategories(migrated);
        if (JSON.stringify(migrated) !== JSON.stringify(c)) {
          await saveCategories(migrated);
        }
      }
      setExpenses(e || []);
    })();
  }, []);

  const persistExpenses = useCallback(async (next: Expense[]) => {
    setExpenses(next);
    await saveExpenses(next);
  }, []);

  const persistCategories = useCallback(async (next: Category[]) => {
    setCategories(next);
    await saveCategories(next);
  }, []);

  const addExpense = useCallback(
    async (e: Omit<Expense, "id">) => {
      const id = Math.random().toString(36).slice(2);
      const next = [{ id, ...e }, ...expenses];
      await persistExpenses(next);
    },
    [expenses, persistExpenses]
  );

  const addCategory = useCallback(
    async (name: string, iconName?: string) => {
      const id = name.trim().toLowerCase().replace(/\s+/g, "-");
      const exists = categories.some((c) => c.id === id);
      const cat: Category = {
        id: exists ? `${id}-${Date.now()}` : id,
        name: name.trim(),
        iconName: iconName || "pricetag-outline",
      };
      const next = [...categories, cat];
      await persistCategories(next);
      return cat;
    },
    [categories, persistCategories]
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      // Remove category and any associated expenses
      const nextCategories = categories.filter((cat) => cat.id !== id);
      const nextExpenses = expenses.filter((exp) => exp.categoryId !== id);
      await Promise.all([
        persistCategories(nextCategories),
        persistExpenses(nextExpenses),
      ]);
    },
    [categories, expenses, persistCategories, persistExpenses]
  );

  const setFilters = (f: Partial<Filters>) => {
    setFiltersState((prev) => ({ ...prev, ...f }));
  };

  const clearAll = useCallback(async () => {
    await clearAllStorage();
    setExpenses([]);
    setCategories(DEFAULT_CATEGORIES);
    await saveCategories(DEFAULT_CATEGORIES);
    setFiltersState({ sortBy: "latest", search: "" });
  }, []);

  const value = useMemo(
    () => ({
      expenses,
      categories,
      filters,
      addExpense,
      addCategory,
      deleteCategory,
      setFilters,
      clearAll,
    }),
    [expenses, categories, filters, addExpense, addCategory, deleteCategory, clearAll]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}