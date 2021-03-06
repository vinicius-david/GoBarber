import { injectable, inject } from 'tsyringe';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import Appointment from '../infra/typeorm/entities/Appointment';
import { classToClass } from 'class-transformer';

interface RequestDTO {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
class ListProviderAppointmentsService
 {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvder: ICacheProvider,
  ) {}

  public async execute({ provider_id, day, month, year }: RequestDTO): Promise<Appointment[]> {
    const cacheKey = `provider-appointments:${provider_id}:${year}-${month}-${day}`;

    let appointments = await this.cacheProvder.recover<Appointment[]>(cacheKey);

    if (!appointments) {
      appointments = await this.appointmentsRepository.findByDayFromProvider({
        provider_id,
        day,
        month,
        year,
      });

      await this.cacheProvder.save(cacheKey, classToClass(appointments));
    }

    return appointments;
  }
};

export default ListProviderAppointmentsService;
