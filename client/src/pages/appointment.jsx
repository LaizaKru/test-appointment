import React, { useEffect, useRef, useState } from "react";
import {
  f7,
  View,
  Page,
  Navbar,
  NavTitle,
  NavRight,
  Link,
  Block,
  List,
  ListInput,
  Button,
  useStore,
  Preloader,
  ListButton,
  Popup,
} from "framework7-react"
import moment from 'moment';

import * as api from "../api";
import store, { loadingState } from "../js/store";

const AppointmentPage = () => {
  useEffect(() => {
    store.dispatch("loadDoctorSchedules")
  }, []);

  const schedules = useStore("availableSchedules");
  const schedulesLoadingState = useStore("schedulesLoadingState");

  const [calendarValue, setCalendarValue] = useState(null);
  // calendarValue это массив дат, но нам нужна только одна
  const selectedDate = calendarValue?.[0]
  const schedulesBySelectedDate = selectedDate
    ? schedules.filter(
      ({ date }) => moment(date).isSame(selectedDate, "day")
    )
    : [];
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const reset = () => {
    setCalendarValue([]);
    setSelectedSchedule(null);
  }

  const [isBookingPending, setIsBookingPending] = useState(false);
  const onBookSelectedSchedule = async () => {
    if (!selectedSchedule) {
      return;
    }

    setIsBookingPending(true)

    try {
      const { data } = await api.createAppointment(selectedSchedule.id);
      f7.notification.create({
        title: "Вы записаны на прием",
        subtitle: "Ждем вас к указанному времени",
        closeOnClick: true,
        closeTimeout: 2500,
      }).open();
      store.dispatch("addAppointment", data);
      reset()
    } catch (error) {
      f7.notification.create({
        title: "Не получилось записаться на прием",
        subtitle: error.response.data.message,
        closeOnClick: true,
        closeTimeout: 1500,
      }).open();
    } finally {
      setIsBookingPending(false)
    }
  }

  let content = null;
  switch (schedulesLoadingState) {
    case loadingState.loading:
      content = <Preloader />;
      break;
    case loadingState.error:
      content = (
        <Block>
          <p>Не получилось загрузить расписание</p>
        </Block>
      );
      break;
    case loadingState.success:
      content = (
        <List strongIos outlineIos>
          <ListInput
            type="datepicker"
            placeholder="Выберите дату приема"
            readonly
            value={calendarValue}
            onCalendarChange={setCalendarValue}
            calendarParams={{
              timePicker: false,
              minDate: new Date(),
              closeOnSelect: true,
              dateFormat: {
                month: "numeric",
                day: "numeric",
                year: "numeric",
              },
              disabled: function (date) {
                const founded = schedules.find(
                  (schedule) => !schedule.isBooked && moment(schedule.date).isSame(date, "day")
                );
                return !founded
              },
            }}
          />
          <List inset>
            {schedulesBySelectedDate.map((schedule) => (
              <ListButton
                key={schedule.id}
                onClick={() => setSelectedSchedule(schedule)}
              >
                {schedule.startTime.slice(0, -3)} - {schedule.endTime.slice(0, -3)}
              </ListButton>
            ))}
          </List>
        </List>
      );
      break;
  }

  return (
    <Page name="appointment">
      <Navbar sliding={false}>
        <NavTitle sliding>Запись на прием</NavTitle>
      </Navbar>

      <Block>
        <p>Чтобы записаться на прием, выберите день и время приема.</p>
      </Block>

      {content}

      <Popup
        opened={!!selectedSchedule}
        onPopupClose={() => setSelectedSchedule(null)}
        push
      >
        <View>
          <Page>
            <Navbar title="Подтвердите дату и время">
              <NavRight>
                <Link popupClose>Закрыть</Link>
              </NavRight>
            </Navbar>
            <Block>
              {selectedSchedule && (
                <Button tonal large largeIos largeMd onClick={onBookSelectedSchedule}>
                  Записаться на {moment(selectedSchedule.date).format("DD.MM.YYYY")} в {selectedSchedule.startTime.slice(0, -3)}
                </Button>
              )}
            </Block>
          </Page>
        </View>
      </Popup>
    </Page>
  );
};
export default AppointmentPage;
