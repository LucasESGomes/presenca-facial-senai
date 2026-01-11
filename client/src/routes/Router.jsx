import { BrowserRouter, Router, Routes, Route } from "react-router-dom";
import { ROUTES } from "./index.js";

import ProtectedRoute from "../components/auth/ProtectedRoute.jsx";

import LoginPage from "../pages/LoginPage.jsx";
import ClassesPage from "../pages/ClassesPage.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import CreatePage from "../pages/CreatePage.jsx";
import StudentsPage from "../pages/StudentsPage.jsx";
import StudentEditPage from "../pages/StudentEditPage.jsx";
import TeachersPage from "../pages/TeachersPage.jsx";
import TeacherEditPage from "../pages/TeacherEditPage.jsx";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.PUBLIC.LOGIN} element={<LoginPage />}></Route>
        <Route
          path={ROUTES.PRIVATE.DASHBOARD}
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path={ROUTES.PRIVATE.CLASSES.LIST}
          element={
            <ProtectedRoute>
              <ClassesPage />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path={ROUTES.PRIVATE.STUDENTS.LIST}
          element={
            <ProtectedRoute>
              <StudentsPage />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path={ROUTES.PRIVATE.STUDENTS.CREATE}
          element={
            <ProtectedRoute>
              <CreatePage />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path={ROUTES.PRIVATE.STUDENTS.EDIT}
          element={
            <ProtectedRoute>
              <StudentEditPage />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path={ROUTES.PRIVATE.TEACHERS.LIST}
          element={
            <ProtectedRoute>
              <TeachersPage />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path={ROUTES.PRIVATE.TEACHERS.EDIT}
          element={
            <ProtectedRoute>
              <TeacherEditPage />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path={ROUTES.PRIVATE.CLASSES.CREATE}
          element={
            <ProtectedRoute>
              <CreatePage />
            </ProtectedRoute>
          }
        ></Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
