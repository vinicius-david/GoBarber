import 'reflect-metadata';

import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

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
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
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

    const formattedDate = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm");

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento criado! Dia ${formattedDate}`,
    });

    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        'yyyy-M-d',
      )}`
    );

    return appointment;
  }
}

export default CreateAppointmentService;
