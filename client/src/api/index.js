import axios from "axios";

const instance = axios.create({
  baseURL: "/backend/api",
});

export const login = (credentials) => {
  return instance.post("/auth/login", credentials);
};

export const register = (credentials) => {
  return instance.post("/auth/register", credentials);
};

export const logout = () => {
  return instance.get("/auth/logout");
};

export const check = () => {
  return instance.get("/auth/check");
};

export const getDoctorSchedules = (id) => {
  return instance.get(`/doctors/${id}/schedules`);
};

export const createAppointment = (scheduleId) => {
  return instance.post(`/appointments`, { scheduleId });
};
