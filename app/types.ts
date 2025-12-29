export enum UserRole {
  ADMIN = 'ADMIN',
  TECH = 'TECH'
}

export enum OrderStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Company {
  id: string;
  name: string;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: UserRole;
  companyId: string;
  createdAt: Date;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  companyId: string;
  createdAt: Date;
}

export interface WorkOrder {
  id: string;
  title: string;
  description?: string;
  status: OrderStatus;
  clientId: string;
  client?: Client;
  companyId: string;
  createdAt: Date;
  totalTimeMinutes?: number;
}

export interface ServiceReport {
  id: string;
  workOrderId: string;
  notes: string;
  equipment?: string;
  completedAt: Date;
  photos?: string[]; // Base64 strings
  partsCost: number;
  serviceCost: number;
}

export interface WorkTimeEntry {
  id: string;
  workOrderId: string;
  durationMin: number;
  date: Date;
}

// Global augmentation for process.env to avoid TS errors in the browser environment
// This avoids "Cannot redeclare block-scoped variable 'process'" when @types/node is present.
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_KEY: string;
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}