import { createStore } from "framework7/lite";
import { f7 } from "framework7-react";

import * as api from "../api";

export const loadingState = {
  idle: "idle",
  loading: "loading",
  success: "success",
  error: "error",
};

const store = createStore({
  state: {
    user: null,
    schedules: [],
    schedulesLoadingState: loadingState.idle,
    appointments: [],
  },
  getters: {
    user({ state }) {
      return state.user;
    },
    schedules({ state }) {
      return state.schedules;
    },
    availableSchedules({ state }) {
      return state.schedules.filter((schedule) => !schedule.isBooked);
    },
    schedulesLoadingState({ state }) {
      return state.schedulesLoadingState;
    },
  },
  actions: {
    login({ state }, credentials) {
      api
        .login(credentials)
        .then(({ data }) => {
          state.user = data.user;
          f7.views.main.router.navigate("/");
        })
        .catch((error) => {
          f7.notification
            .create({
              title: "Ошибка входа",
              subtitle: error.response.data.message,
              closeOnClick: true,
              closeTimeout: 1500,
            })
            .open();
        });
    },
    register({ state }, credentials) {
      api
        .register(credentials)
        .then(({ data }) => {
          f7.notification
            .create({
              title: "Вы успешно зарегистрировались",
              subtitle: "Теперь вы можете записаться на прием",
              closeOnClick: true,
              closeTimeout: 1500,
            })
            .open();
          state.user = data.user
          f7.views.main.router.navigate("/");
        })
        .catch((error) => {
          f7.notification
            .create({
              title: "Ошибка регистрации",
              subtitle: error.response.data.message,
              closeOnClick: true,
              closeTimeout: 1500,
            })
            .open();
        });
    },
    loadDoctorSchedules({ state, dispatch }) {
      // По заданию доктор только один, поэтому загружаем расписание только для первого доктора(из сидов)
      // В дальнейшем константу можно заменить на аргумент и загружать расписание для дюбого доктора
      const doctorId = 1;
      state.schedulesLoadingState = loadingState.loading
      api
        .getDoctorSchedules(doctorId)
        .then(({ data }) => {
          state.schedules = data;
          state.schedulesLoadingState = loadingState.success
        })
        .catch((error) => {
          state.schedules = [];
          state.schedulesLoadingState = loadingState.error
          f7.notification
            .create({
              title: "Ошибка загрузки расписания",
              subtitle: error.response.data.message,
              closeOnClick: true,
              closeTimeout: 1500,
            })
            .open();
        });
    },
    addAppointment({ state }, appointment) {
      state.appointments.push(appointment);
      // Помечаем слот в расписании как забронированный
      state.schedules = state.schedules.map((schedule) => {
        if (schedule.id === appointment.scheduleId) {
          return { ...schedule, isBooked: true };
        }
        return schedule;
      })
    },
  },
});
export default store;
