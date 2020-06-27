import 'reflect-metadata';

import { startOfHour, isBefore, getHours } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import AppError from '@shared/errors/AppError';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

interface IRequestDTO {
  provider_id: string;
  user_id: string;
  date: Date;
};

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute({ provider_id, user_id, date }: IRequestDTO): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (provider_id === user_id) throw new AppError("You can't create appointment with yourself.");

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't create an appointment in the past.");
    };

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError('You can create appointments only between 8h and 17h');
    };

    const checkAppointmentAvailability = await this.appointmentsRepository.findByDate(appointmentDate);

    if (checkAppointmentAvailability) {
      throw new AppError('This appointment is not available.');
    };

    const appointment = this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
