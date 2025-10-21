interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export const generateCalendarDays = (currentDate: Date): CalendarDay[] => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const days: CalendarDay[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Add days from previous month
  const startDayOfWeek = firstDayOfMonth.getDay();
  for (let i = 0; i < startDayOfWeek; i++) {
    const date = new Date(year, month, 0 - i);
    days.unshift({ date, isCurrentMonth: false, isToday: false });
  }

  // Add days of current month
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const date = new Date(year, month, i);
    days.push({
      date,
      isCurrentMonth: true,
      isToday: date.getTime() === today.getTime(),
    });
  }

  // Add days from next month
  const endDayOfWeek = lastDayOfMonth.getDay();
  const daysToAdd = 6 - endDayOfWeek;
  for (let i = 1; i <= daysToAdd; i++) {
    const date = new Date(year, month + 1, i);
    days.push({ date, isCurrentMonth: false, isToday: false });
  }

  // Ensure calendar grid is always 6 weeks (42 days)
  while (days.length < 42) {
    const lastDay = days[days.length - 1].date;
    const nextDay = new Date(lastDay.getFullYear(), lastDay.getMonth(), lastDay.getDate() + 1);
     days.push({ date: nextDay, isCurrentMonth: false, isToday: false });
  }

  return days;
};

export const getAvailableTimeSlots = (
  selectedDate: Date,
  appointments: { start: string }[]
): Date[] => {
  const availableSlots: Date[] = [];
  const dayOfWeek = selectedDate.getDay();

  // No appointments on weekends (Saturday=6, Sunday=0)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return [];
  }

  const workStartHour = 9; // 9 AM
  const workEndHour = 18; // 6 PM
  const slotDuration = 45; // minutes

  const bookedTimes = new Set(
    appointments.map(a => new Date(a.start).getTime())
  );

  for (let hour = workStartHour; hour < workEndHour; hour++) {
    for (let minute = 0; minute < 60; minute += slotDuration) {
      const slotTime = new Date(selectedDate);
      slotTime.setHours(hour, minute, 0, 0);
      
      // Stop adding slots if we are past working hours
      if (slotTime.getHours() >= workEndHour) break;

      if (slotTime > new Date() && !bookedTimes.has(slotTime.getTime())) {
        availableSlots.push(slotTime);
      }
    }
  }

  return availableSlots;
};
