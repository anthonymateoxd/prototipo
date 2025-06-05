import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Complaint pages
import ComplaintForm from "./pages/complaints/ComplaintForm";
import ComplaintConfirmation from "./pages/complaints/ComplaintConfirmation";

// Business pages
import BusinessList from "./pages/businesses/BusinessList";
import BusinessForm from "./pages/businesses/BusinessForm";
import BranchList from "./pages/businesses/BranchList";
import BranchForm from "./pages/businesses/BranchForm";

// Owner pages
import OwnerList from "./pages/owners/OwnerList";
import OwnerForm from "./pages/owners/OwnerForm";

// Geography pages
import RegionList from "./pages/geography/RegionList";
import RegionForm from "./pages/geography/RegionForm";
import DepartmentList from "./pages/geography/DepartmentList";
import DepartmentForm from "./pages/geography/DepartmentForm";
import MunicipalityList from "./pages/geography/MunicipalityList";
import MunicipalityForm from "./pages/geography/MunicipalityForm";

// Report pages
import ReportFilters from "./pages/reports/ReportFilters";
import ReportResults from "./pages/reports/ReportResults";

// Auth pages
import Login from "./pages/auth/Login";
import UserList from "./pages/users/UserList";
import UserForm from "./pages/users/UserForm";
import RoleList from "./pages/roles/RoleList";
import RoleForm from "./pages/roles/RoleForm";
import AuditList from "./pages/audit/AuditList";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />

              {/* Complaint routes */}
              <Route path="complaint" element={<ComplaintForm />} />
              <Route
                path="complaint/confirmation"
                element={<ComplaintConfirmation />}
              />

              {/* Business routes */}
              <Route path="businesses" element={<BusinessList />} />
              <Route path="businesses/new" element={<BusinessForm />} />
              <Route path="businesses/:id/edit" element={<BusinessForm />} />
              <Route path="businesses/:id/branches" element={<BranchList />} />
              <Route
                path="businesses/:businessId/branches/new"
                element={<BranchForm />}
              />
              <Route
                path="businesses/:businessId/branches/:id/edit"
                element={<BranchForm />}
              />

              {/* Owner routes */}
              <Route path="owners" element={<OwnerList />} />
              <Route path="owners/new" element={<OwnerForm />} />
              <Route path="owners/:id/edit" element={<OwnerForm />} />

              {/* Geography routes */}
              <Route path="geography" element={<RegionList />} />
              <Route path="geography/regions" element={<RegionList />} />
              <Route path="geography/regions/new" element={<RegionForm />} />
              <Route
                path="geography/regions/:id/edit"
                element={<RegionForm />}
              />
              <Route
                path="geography/departments"
                element={<DepartmentList />}
              />
              <Route
                path="geography/departments/new"
                element={<DepartmentForm />}
              />
              <Route
                path="geography/departments/:id/edit"
                element={<DepartmentForm />}
              />
              <Route
                path="geography/municipalities"
                element={<MunicipalityList />}
              />
              <Route
                path="geography/municipalities/new"
                element={<MunicipalityForm />}
              />
              <Route
                path="geography/municipalities/:id/edit"
                element={<MunicipalityForm />}
              />

              {/* Report routes */}
              <Route path="reports" element={<ReportFilters />} />
              <Route path="reports/results" element={<ReportResults />} />

              {/* User management routes */}
              <Route path="users" element={<UserList />} />
              <Route path="users/new" element={<UserForm />} />
              <Route path="users/:id/edit" element={<UserForm />} />
              <Route path="roles" element={<RoleList />} />
              <Route path="roles/new" element={<RoleForm />} />
              <Route path="roles/:id/edit" element={<RoleForm />} />
              <Route path="audit" element={<AuditList />} />
            </Route>

            {/* Auth routes (outside layout) */}
            <Route path="login" element={<Login />} />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
