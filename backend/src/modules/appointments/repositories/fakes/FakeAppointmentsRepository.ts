import { uuid } from 'uuidv4';
import { isEqual, getYear, getMonth, getDate } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindByMonthFromProviderDTO from '@modules/appointments/dtos/IFindByMonthFromProviderDTO';
import IFindByDayFromProviderDTO from '@modules/appointments/dtos/IFindByDayFromProviderDTO';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'

class AppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(appointment =>
      isEqual(appointment.date, date)
    );

    return findAppointment;
  }

  public async findByMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindByMonthFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(appointment => {
      return (
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year
      )}
    );

    return appointments;
  }

  public async findByDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindByDayFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(appointment => {
      return (
        appointment.provider_id === provider_id &&
        getDate(appointment.date) === day &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year
      )}
    );

    return appointments;
  }

  public async create({ provider_id, user_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), provider_id, user_id, date });

    this.appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
