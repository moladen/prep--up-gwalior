"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  studentApi,
  clearStudentToken,
  getStudentToken,
  getStudentUser,
  setStudentToken,
  setStudentUser,
} from "@/lib/api";

const StudentAuthContext = createContext(null);

export function StudentAuthProvider({ children }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    const token = getStudentToken();
    if (!token) {
      setStudent(null);
      setLoading(false);
      return;
    }

    // Instant paint from cache while revalidating
    const cached = getStudentUser();
    if (cached) {
      setStudent((prev) => (prev?.id === cached.id ? prev : cached));
    }

    try {
      const data = await studentApi.getMe();
      setStudent((prev) =>
        prev?.id === data.student?.id ? prev : data.student
      );
      setStudentUser(data.student);
      if (data.token) setStudentToken(data.token);
    } catch (err) {
      const status = err?.status;
      // Only wipe session on real auth failures — not network blips
      if (status === 401 || status === 403 || !getStudentToken()) {
        clearStudentToken();
        setStudent(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const openLogin = useCallback(() => setLoginOpen(true), []);
  const closeLogin = useCallback(() => setLoginOpen(false), []);

  const login = async (identifier, password) => {
    const data = await studentApi.login({
      identifier,
      email: identifier,
      password,
    });
    if (data.token) setStudentToken(data.token);
    setStudentUser(data.student);
    setStudent(data.student);
    setLoading(false);
    setLoginOpen(false);
    // Full navigation avoids soft-router / HMR loops after login
    if (typeof window !== "undefined") {
      window.location.assign("/student/dashboard");
    } else {
      router.replace("/student/dashboard");
    }
    return data;
  };

  const register = async (body) => {
    const data = await studentApi.register(body);
    if (data.token) setStudentToken(data.token);
    setStudentUser(data.student);
    setStudent(data.student);
    setLoading(false);
    setLoginOpen(false);
    if (typeof window !== "undefined") {
      window.location.assign("/student/dashboard");
    } else {
      router.replace("/student/dashboard");
    }
    return data;
  };

  const logout = async () => {
    try {
      await studentApi.logout();
    } catch {
      /* ignore */
    }
    clearStudentToken();
    setStudent(null);
    router.replace("/");
  };

  return (
    <StudentAuthContext.Provider
      value={{
        student,
        loading,
        login,
        register,
        logout,
        checkAuth,
        loginOpen,
        openLogin,
        closeLogin,
      }}
    >
      {children}
    </StudentAuthContext.Provider>
  );
}

export function useStudentAuth() {
  const ctx = useContext(StudentAuthContext);
  if (!ctx) throw new Error("useStudentAuth must be used within StudentAuthProvider");
  return ctx;
}
