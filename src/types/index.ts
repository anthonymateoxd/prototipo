// Core entity types
export interface Region {
  id: string;
  nombre: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Department {
  id: string;
  nombre: string;
  regionId: string;
  region?: Region;
  createdAt: Date;
  updatedAt: Date;
}

export interface Municipality {
  id: string;
  nombre: string;
  departmentId: string;
  department?: Department;
  createdAt: Date;
  updatedAt: Date;
}

export interface Owner {
  id: string;
  nombreCompleto: string;
  nit: string;
  telefono: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Business {
  id: string;
  nombre: string;
  ownerId: string;
  owner?: Owner;
  createdAt: Date;
  updatedAt: Date;
}

export interface Branch {
  id: string;
  direccion: string;
  businessId: string;
  business?: Business;
  municipalityId: string;
  municipality?: Municipality;
  createdAt: Date;
  updatedAt: Date;
}

export interface ComplaintCategory {
  id: string;
  nombre: string;
  descripcion?: string;
}

export interface Complaint {
  id: string;
  regionId: string;
  region?: Region;
  municipalityId: string;
  municipality?: Municipality;
  businessId: string;
  business?: Business;
  categoryId: string;
  category?: ComplaintCategory;
  descripcion: string;
  estado: "PENDIENTE" | "EN_PROCESO" | "RESUELTO" | "CERRADO";
  createdAt: Date;
  updatedAt: Date;
}

// Authentication and User Management
export interface Role {
  id: string;
  nombre: string;
  descripcion?: string;
  permisos: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  nombreCompleto: string;
  email: string;
  username: string;
  password?: string;
  roleId: string;
  role?: Role;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  user?: User;
  accion: string;
  recurso: string;
  detalles?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// DTOs for forms and API communication
export interface ComplaintFormDTO {
  regionId: string;
  municipalityId: string;
  businessId: string;
  categoryId: string;
  descripcion: string;
}

export interface ReportFilterDTO {
  regionId?: string;
  departmentId?: string;
  municipalityId?: string;
  businessId?: string;
  categoryId?: string;
  fechaInicio?: Date;
  fechaFin?: Date;
}

export interface ReportDataDTO {
  resultados: ComplaintSummaryDTO[];
  metadatos: {
    total: number;
    fechaGeneracion: Date;
    filtrosAplicados: string[];
  };
}

export interface ComplaintSummaryDTO {
  businessNombre: string;
  municipalityNombre: string;
  departmentNombre: string;
  regionNombre: string;
  categoryNombre: string;
  totalQuejas: number;
  fechaUltimaQueja: Date;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ValidationError[];
}

// Navigation and UI types
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
  requiresAuth?: boolean;
  roles?: string[];
}

export interface TableColumn<T = any> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
  total: number;
}

// Export utilities
export type ExportFormat = "PDF" | "EXCEL";

export interface ExportOptions {
  format: ExportFormat;
  filename?: string;
  includeFilters?: boolean;
}
