import {
  Region,
  Department,
  Municipality,
  Owner,
  Business,
  Branch,
  ComplaintCategory,
  Complaint,
  Role,
  User,
  AuditLog,
} from "@/types";

// Mock data for regions
export const mockRegions: Region[] = [
  {
    id: "1",
    nombre: "Región Central",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    nombre: "Región Norte",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    nombre: "Región Sur",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

// Mock data for departments
export const mockDepartments: Department[] = [
  {
    id: "1",
    nombre: "Guatemala",
    regionId: "1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    nombre: "Sacatepéquez",
    regionId: "1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    nombre: "Huehuetenango",
    regionId: "2",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "4",
    nombre: "Escuintla",
    regionId: "3",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

// Mock data for municipalities
export const mockMunicipalities: Municipality[] = [
  {
    id: "1",
    nombre: "Guatemala",
    departmentId: "1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    nombre: "Mixco",
    departmentId: "1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    nombre: "Villa Nueva",
    departmentId: "1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "4",
    nombre: "Antigua Guatemala",
    departmentId: "2",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "5",
    nombre: "Huehuetenango",
    departmentId: "3",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "6",
    nombre: "Escuintla",
    departmentId: "4",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

// Mock data for owners
export const mockOwners: Owner[] = [
  {
    id: "1",
    nombreCompleto: "Juan Carlos Pérez",
    nit: "12345678-9",
    telefono: "2234-5678",
    email: "juan.perez@email.com",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    nombreCompleto: "María Elena González",
    nit: "87654321-0",
    telefono: "2345-6789",
    email: "maria.gonzalez@email.com",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    nombreCompleto: "Roberto Silva Martínez",
    nit: "11223344-5",
    telefono: "2456-7890",
    email: "roberto.silva@email.com",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

// Mock data for businesses
export const mockBusinesses: Business[] = [
  {
    id: "1",
    nombre: "Restaurante El Buen Sabor",
    ownerId: "1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    nombre: "Supermercado La Canasta",
    ownerId: "2",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    nombre: "Farmacia San Juan",
    ownerId: "3",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "4",
    nombre: "Tienda de Ropa Fashion",
    ownerId: "1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

// Mock data for branches
export const mockBranches: Branch[] = [
  {
    id: "1",
    direccion: "5ta Avenida 12-34, Zona 1",
    businessId: "1",
    municipalityId: "1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    direccion: "Centro Comercial Plaza Norte, Local 201",
    businessId: "1",
    municipalityId: "2",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    direccion: "Avenida Las Américas 45-67",
    businessId: "2",
    municipalityId: "1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "4",
    direccion: "Calle Real 8-90, Antigua",
    businessId: "3",
    municipalityId: "4",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

// Mock data for complaint categories
export const mockComplaintCategories: ComplaintCategory[] = [
  {
    id: "1",
    nombre: "Servicio al Cliente",
    descripcion: "Quejas relacionadas con la atención y servicio al cliente",
  },
  {
    id: "2",
    nombre: "Calidad del Producto",
    descripcion: "Quejas sobre la calidad de productos ofrecidos",
  },
  {
    id: "3",
    nombre: "Precios",
    descripcion: "Quejas relacionadas con precios y facturación",
  },
  {
    id: "4",
    nombre: "Instalaciones",
    descripcion: "Quejas sobre el estado de las instalaciones",
  },
  {
    id: "5",
    nombre: "Tiempo de Espera",
    descripcion: "Quejas sobre tiempos de espera excesivos",
  },
];

// Mock data for complaints
export const mockComplaints: Complaint[] = [
  {
    id: "1",
    regionId: "1",
    municipalityId: "1",
    businessId: "1",
    categoryId: "1",
    descripcion: "El mesero fue muy grosero y la comida llegó fría",
    estado: "PENDIENTE",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    regionId: "1",
    municipalityId: "2",
    businessId: "2",
    categoryId: "2",
    descripcion: "Compré leche caducada, no revisaron la fecha",
    estado: "EN_PROCESO",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-22"),
  },
  {
    id: "3",
    regionId: "1",
    municipalityId: "4",
    businessId: "3",
    categoryId: "3",
    descripcion: "Me cobraron de más por un medicamento",
    estado: "RESUELTO",
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-28"),
  },
];

// Mock data for roles
export const mockRoles: Role[] = [
  {
    id: "1",
    nombre: "Administrador",
    descripcion: "Acceso completo al sistema",
    permisos: ["read", "write", "delete", "admin"],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    nombre: "Analista",
    descripcion: "Puede ver reportes y gestionar quejas",
    permisos: ["read", "write"],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    nombre: "Supervisor",
    descripcion: "Supervisión de operaciones",
    permisos: ["read", "write"],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

// Mock data for users
export const mockUsers: User[] = [
  {
    id: "1",
    nombreCompleto: "Administrador Sistema",
    email: "admin@sistema.com",
    username: "admin",
    roleId: "1",
    activo: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    nombreCompleto: "Ana María López",
    email: "ana.lopez@sistema.com",
    username: "ana.lopez",
    roleId: "2",
    activo: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    nombreCompleto: "Carlos Mendoza",
    email: "carlos.mendoza@sistema.com",
    username: "carlos.mendoza",
    roleId: "3",
    activo: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

// Mock data for audit logs
export const mockAuditLogs: AuditLog[] = [
  {
    id: "1",
    userId: "1",
    accion: "LOGIN",
    recurso: "Sistema",
    detalles: "Inicio de sesión exitoso",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0...",
    createdAt: new Date("2024-01-15T08:00:00"),
  },
  {
    id: "2",
    userId: "2",
    accion: "CREATE",
    recurso: "Queja",
    detalles: "Nueva queja registrada: ID 1",
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0...",
    createdAt: new Date("2024-01-15T10:30:00"),
  },
  {
    id: "3",
    userId: "1",
    accion: "UPDATE",
    recurso: "Comercio",
    detalles: "Comercio actualizado: Restaurante El Buen Sabor",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0...",
    createdAt: new Date("2024-01-16T14:15:00"),
  },
];

// Helper functions to get related data
export const getRegionById = (id: string): Region | undefined =>
  mockRegions.find((r) => r.id === id);

export const getDepartmentById = (id: string): Department | undefined =>
  mockDepartments.find((d) => d.id === id);

export const getMunicipalityById = (id: string): Municipality | undefined =>
  mockMunicipalities.find((m) => m.id === id);

export const getOwnerById = (id: string): Owner | undefined =>
  mockOwners.find((o) => o.id === id);

export const getBusinessById = (id: string): Business | undefined =>
  mockBusinesses.find((b) => b.id === id);

export const getCategoryById = (id: string): ComplaintCategory | undefined =>
  mockComplaintCategories.find((c) => c.id === id);

export const getRoleById = (id: string): Role | undefined =>
  mockRoles.find((r) => r.id === id);

export const getUserById = (id: string): User | undefined =>
  mockUsers.find((u) => u.id === id);

// Helper functions for filtering
export const getDepartmentsByRegion = (regionId: string): Department[] =>
  mockDepartments.filter((d) => d.regionId === regionId);

export const getMunicipalitiesByDepartment = (
  departmentId: string,
): Municipality[] =>
  mockMunicipalities.filter((m) => m.departmentId === departmentId);

export const getBranchesByBusiness = (businessId: string): Branch[] =>
  mockBranches.filter((b) => b.businessId === businessId);

export const getBusinessesByOwner = (ownerId: string): Business[] =>
  mockBusinesses.filter((b) => b.ownerId === ownerId);
