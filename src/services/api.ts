import {
  ApiResponse,
  Region,
  Department,
  Municipality,
  Owner,
  Business,
  Branch,
  ComplaintCategory,
  Complaint,
  ComplaintFormDTO,
  User,
  Role,
  AuditLog,
  ReportFilterDTO,
  ReportDataDTO,
  ComplaintSummaryDTO,
} from "@/types";
import {
  mockRegions,
  mockDepartments,
  mockMunicipalities,
  mockOwners,
  mockBusinesses,
  mockBranches,
  mockComplaintCategories,
  mockComplaints,
  mockUsers,
  mockRoles,
  mockAuditLogs,
  getDepartmentsByRegion,
  getMunicipalitiesByDepartment,
  getRegionById,
  getDepartmentById,
  getMunicipalityById,
  getBusinessById,
  getCategoryById,
  getOwnerById,
  getRoleById,
  getUserById,
} from "./mockData";

// Simulate API delay
const delay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock authentication
let currentUser: User | null = null;

// Authentication API
export const authAPI = {
  async login(username: string, password: string): Promise<ApiResponse<User>> {
    await delay();

    const user = mockUsers.find((u) => u.username === username);
    if (!user || password !== "password123") {
      return {
        success: false,
        message: "Credenciales inválidas",
      };
    }

    currentUser = { ...user, role: getRoleById(user.roleId) };
    return {
      success: true,
      message: "Inicio de sesión exitoso",
      data: currentUser,
    };
  },

  async logout(): Promise<ApiResponse> {
    await delay();
    currentUser = null;
    return {
      success: true,
      message: "Sesión cerrada exitosamente",
    };
  },

  getCurrentUser(): User | null {
    return currentUser;
  },
};

// Geography API
export const geographyAPI = {
  async getRegions(): Promise<ApiResponse<Region[]>> {
    await delay();
    return {
      success: true,
      message: "Regiones obtenidas exitosamente",
      data: mockRegions,
    };
  },

  async getDepartments(regionId?: string): Promise<ApiResponse<Department[]>> {
    await delay();
    const departments = regionId
      ? getDepartmentsByRegion(regionId)
      : mockDepartments.map((d) => ({
          ...d,
          region: getRegionById(d.regionId),
        }));

    return {
      success: true,
      message: "Departamentos obtenidos exitosamente",
      data: departments,
    };
  },

  async getMunicipalities(
    departmentId?: string,
  ): Promise<ApiResponse<Municipality[]>> {
    await delay();
    const municipalities = departmentId
      ? getMunicipalitiesByDepartment(departmentId)
      : mockMunicipalities.map((m) => ({
          ...m,
          department: getDepartmentById(m.departmentId),
        }));

    return {
      success: true,
      message: "Municipios obtenidos exitosamente",
      data: municipalities,
    };
  },

  async createRegion(data: Partial<Region>): Promise<ApiResponse<Region>> {
    await delay();
    const newRegion: Region = {
      id: Date.now().toString(),
      nombre: data.nombre!,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockRegions.push(newRegion);
    return {
      success: true,
      message: "Región creada exitosamente",
      data: newRegion,
    };
  },

  async updateRegion(
    id: string,
    data: Partial<Region>,
  ): Promise<ApiResponse<Region>> {
    await delay();
    const index = mockRegions.findIndex((r) => r.id === id);
    if (index === -1) {
      return { success: false, message: "Región no encontrada" };
    }

    mockRegions[index] = {
      ...mockRegions[index],
      ...data,
      updatedAt: new Date(),
    };
    return {
      success: true,
      message: "Región actualizada exitosamente",
      data: mockRegions[index],
    };
  },

  async deleteRegion(id: string): Promise<ApiResponse> {
    await delay();
    const index = mockRegions.findIndex((r) => r.id === id);
    if (index === -1) {
      return { success: false, message: "Región no encontrada" };
    }

    mockRegions.splice(index, 1);
    return {
      success: true,
      message: "Región eliminada exitosamente",
    };
  },
};

// Business API
export const businessAPI = {
  async getBusinesses(): Promise<ApiResponse<Business[]>> {
    await delay();
    const businesses = mockBusinesses.map((b) => ({
      ...b,
      owner: getOwnerById(b.ownerId),
    }));
    return {
      success: true,
      message: "Comercios obtenidos exitosamente",
      data: businesses,
    };
  },

  async createBusiness(
    data: Partial<Business>,
  ): Promise<ApiResponse<Business>> {
    await delay();
    const newBusiness: Business = {
      id: Date.now().toString(),
      nombre: data.nombre!,
      ownerId: data.ownerId!,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockBusinesses.push(newBusiness);
    return {
      success: true,
      message: "Comercio creado exitosamente",
      data: { ...newBusiness, owner: getOwnerById(newBusiness.ownerId) },
    };
  },

  async updateBusiness(
    id: string,
    data: Partial<Business>,
  ): Promise<ApiResponse<Business>> {
    await delay();
    const index = mockBusinesses.findIndex((b) => b.id === id);
    if (index === -1) {
      return { success: false, message: "Comercio no encontrado" };
    }

    mockBusinesses[index] = {
      ...mockBusinesses[index],
      ...data,
      updatedAt: new Date(),
    };
    return {
      success: true,
      message: "Comercio actualizado exitosamente",
      data: {
        ...mockBusinesses[index],
        owner: getOwnerById(mockBusinesses[index].ownerId),
      },
    };
  },

  async deleteBusiness(id: string): Promise<ApiResponse> {
    await delay();
    const index = mockBusinesses.findIndex((b) => b.id === id);
    if (index === -1) {
      return { success: false, message: "Comercio no encontrado" };
    }

    mockBusinesses.splice(index, 1);
    return {
      success: true,
      message: "Comercio eliminado exitosamente",
    };
  },
};

// Owner API
export const ownerAPI = {
  async getOwners(): Promise<ApiResponse<Owner[]>> {
    await delay();
    return {
      success: true,
      message: "Propietarios obtenidos exitosamente",
      data: mockOwners,
    };
  },

  async createOwner(data: Partial<Owner>): Promise<ApiResponse<Owner>> {
    await delay();
    const newOwner: Owner = {
      id: Date.now().toString(),
      nombreCompleto: data.nombreCompleto!,
      nit: data.nit!,
      telefono: data.telefono!,
      email: data.email!,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockOwners.push(newOwner);
    return {
      success: true,
      message: "Propietario creado exitosamente",
      data: newOwner,
    };
  },

  async updateOwner(
    id: string,
    data: Partial<Owner>,
  ): Promise<ApiResponse<Owner>> {
    await delay();
    const index = mockOwners.findIndex((o) => o.id === id);
    if (index === -1) {
      return { success: false, message: "Propietario no encontrado" };
    }

    mockOwners[index] = {
      ...mockOwners[index],
      ...data,
      updatedAt: new Date(),
    };
    return {
      success: true,
      message: "Propietario actualizado exitosamente",
      data: mockOwners[index],
    };
  },

  async deleteOwner(id: string): Promise<ApiResponse> {
    await delay();
    const index = mockOwners.findIndex((o) => o.id === id);
    if (index === -1) {
      return { success: false, message: "Propietario no encontrado" };
    }

    mockOwners.splice(index, 1);
    return {
      success: true,
      message: "Propietario eliminado exitosamente",
    };
  },
};

// Complaint API
export const complaintAPI = {
  async getCategories(): Promise<ApiResponse<ComplaintCategory[]>> {
    await delay();
    return {
      success: true,
      message: "Categorías obtenidas exitosamente",
      data: mockComplaintCategories,
    };
  },

  async submitComplaint(
    data: ComplaintFormDTO,
  ): Promise<ApiResponse<{ id: string }>> {
    await delay();

    // Validation
    if (
      !data.regionId ||
      !data.municipalityId ||
      !data.businessId ||
      !data.categoryId ||
      !data.descripcion.trim()
    ) {
      return {
        success: false,
        message: "Todos los campos son obligatorios",
        errors: [
          {
            field: "general",
            message: "Debe completar todos los campos requeridos",
          },
        ],
      };
    }

    const newComplaint: Complaint = {
      id: Date.now().toString(),
      regionId: data.regionId,
      municipalityId: data.municipalityId,
      businessId: data.businessId,
      categoryId: data.categoryId,
      descripcion: data.descripcion,
      estado: "PENDIENTE",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockComplaints.push(newComplaint);

    return {
      success: true,
      message: "Queja registrada exitosamente",
      data: { id: newComplaint.id },
    };
  },

  async getComplaints(): Promise<ApiResponse<Complaint[]>> {
    await delay();
    const complaints = mockComplaints.map((c) => ({
      ...c,
      region: getRegionById(c.regionId),
      municipality: getMunicipalityById(c.municipalityId),
      business: getBusinessById(c.businessId),
      category: getCategoryById(c.categoryId),
    }));

    return {
      success: true,
      message: "Quejas obtenidas exitosamente",
      data: complaints,
    };
  },
};

// Reports API
export const reportsAPI = {
  async generateReport(
    filters: ReportFilterDTO,
  ): Promise<ApiResponse<ReportDataDTO>> {
    await delay(1000); // Simulate longer processing time

    let filteredComplaints = [...mockComplaints];

    // Apply filters
    if (filters.regionId) {
      filteredComplaints = filteredComplaints.filter(
        (c) => c.regionId === filters.regionId,
      );
    }
    if (filters.municipalityId) {
      filteredComplaints = filteredComplaints.filter(
        (c) => c.municipalityId === filters.municipalityId,
      );
    }
    if (filters.businessId) {
      filteredComplaints = filteredComplaints.filter(
        (c) => c.businessId === filters.businessId,
      );
    }
    if (filters.categoryId) {
      filteredComplaints = filteredComplaints.filter(
        (c) => c.categoryId === filters.categoryId,
      );
    }
    if (filters.fechaInicio) {
      filteredComplaints = filteredComplaints.filter(
        (c) => c.createdAt >= filters.fechaInicio!,
      );
    }
    if (filters.fechaFin) {
      filteredComplaints = filteredComplaints.filter(
        (c) => c.createdAt <= filters.fechaFin!,
      );
    }

    // Group by business and municipality
    const groupedData = new Map<string, ComplaintSummaryDTO>();

    filteredComplaints.forEach((complaint) => {
      const business = getBusinessById(complaint.businessId);
      const municipality = getMunicipalityById(complaint.municipalityId);
      const department = municipality
        ? getDepartmentById(municipality.departmentId)
        : undefined;
      const region = department
        ? getRegionById(department.regionId)
        : undefined;
      const category = getCategoryById(complaint.categoryId);

      const key = `${complaint.businessId}-${complaint.municipalityId}`;

      if (!groupedData.has(key)) {
        groupedData.set(key, {
          businessNombre: business?.nombre || "Desconocido",
          municipalityNombre: municipality?.nombre || "Desconocido",
          departmentNombre: department?.nombre || "Desconocido",
          regionNombre: region?.nombre || "Desconocido",
          categoryNombre: category?.nombre || "Desconocido",
          totalQuejas: 0,
          fechaUltimaQueja: complaint.createdAt,
        });
      }

      const summary = groupedData.get(key)!;
      summary.totalQuejas++;
      if (complaint.createdAt > summary.fechaUltimaQueja) {
        summary.fechaUltimaQueja = complaint.createdAt;
      }
    });

    const resultados = Array.from(groupedData.values()).sort(
      (a, b) => b.totalQuejas - a.totalQuejas,
    );

    const appliedFilters: string[] = [];
    if (filters.regionId) appliedFilters.push("Región");
    if (filters.departmentId) appliedFilters.push("Departamento");
    if (filters.municipalityId) appliedFilters.push("Municipio");
    if (filters.businessId) appliedFilters.push("Comercio");
    if (filters.categoryId) appliedFilters.push("Categoría");
    if (filters.fechaInicio || filters.fechaFin)
      appliedFilters.push("Rango de fechas");

    return {
      success: true,
      message: "Reporte generado exitosamente",
      data: {
        resultados,
        metadatos: {
          total: filteredComplaints.length,
          fechaGeneracion: new Date(),
          filtrosAplicados: appliedFilters,
        },
      },
    };
  },

  async exportReport(
    format: "PDF" | "EXCEL",
    data: ReportDataDTO,
  ): Promise<ApiResponse<{ url: string }>> {
    await delay(2000); // Simulate export processing time

    // Mock export - in real app, this would generate actual files
    const filename = `reporte_quejas_${Date.now()}.${format.toLowerCase()}`;
    const mockUrl = `https://mock-storage.com/exports/${filename}`;

    return {
      success: true,
      message: `Reporte exportado a ${format} exitosamente`,
      data: { url: mockUrl },
    };
  },
};

// User management API
export const userAPI = {
  async getUsers(): Promise<ApiResponse<User[]>> {
    await delay();
    const users = mockUsers.map((u) => ({
      ...u,
      role: getRoleById(u.roleId),
      password: undefined, // Never return passwords
    }));

    return {
      success: true,
      message: "Usuarios obtenidos exitosamente",
      data: users,
    };
  },

  async getRoles(): Promise<ApiResponse<Role[]>> {
    await delay();
    return {
      success: true,
      message: "Roles obtenidos exitosamente",
      data: mockRoles,
    };
  },

  async getAuditLogs(): Promise<ApiResponse<AuditLog[]>> {
    await delay();
    const logs = mockAuditLogs.map((log) => ({
      ...log,
      user: getUserById(log.userId),
    }));

    return {
      success: true,
      message: "Registros de auditoría obtenidos exitosamente",
      data: logs,
    };
  },

  async createUser(data: Partial<User>): Promise<ApiResponse<User>> {
    await delay();
    const newUser: User = {
      id: Date.now().toString(),
      nombreCompleto: data.nombreCompleto!,
      email: data.email!,
      username: data.username!,
      roleId: data.roleId!,
      activo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockUsers.push(newUser);
    return {
      success: true,
      message: "Usuario creado exitosamente",
      data: {
        ...newUser,
        role: getRoleById(newUser.roleId),
        password: undefined,
      },
    };
  },

  async updateUser(
    id: string,
    data: Partial<User>,
  ): Promise<ApiResponse<User>> {
    await delay();
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) {
      return { success: false, message: "Usuario no encontrado" };
    }

    mockUsers[index] = { ...mockUsers[index], ...data, updatedAt: new Date() };
    return {
      success: true,
      message: "Usuario actualizado exitosamente",
      data: {
        ...mockUsers[index],
        role: getRoleById(mockUsers[index].roleId),
        password: undefined,
      },
    };
  },

  async deleteUser(id: string): Promise<ApiResponse> {
    await delay();
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) {
      return { success: false, message: "Usuario no encontrado" };
    }

    mockUsers.splice(index, 1);
    return {
      success: true,
      message: "Usuario eliminado exitosamente",
    };
  },
};
