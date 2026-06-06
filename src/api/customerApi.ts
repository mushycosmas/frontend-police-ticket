import api from "./axios";

// Get all customers
export const getCustomers = () => api.get("/tickets/customers/");

// Get single customer by id
export const getCustomer = (id: number) => api.get(`/tickets/customers/${id}/`);

// Get tickets by customer
export const getCustomerTickets = (customerId: number) => 
  api.get(`/tickets/customers/${customerId}/tickets/`);

// Search customers
export const searchCustomers = (query: string) => 
  api.get(`/tickets/customers/?search=${query}`);

// Update customer
export const updateCustomer = (id: number, data: any) => 
  api.patch(`/tickets/customers/${id}/`, data);