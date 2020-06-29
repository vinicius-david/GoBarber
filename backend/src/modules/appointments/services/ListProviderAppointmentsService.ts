import { injectable, inject } from 'tsyringe';

import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

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
  ) {}

  public async execute({ provider_id, day, month, year }: RequestDTO): Promise<Appointment[]> {
    const appointments = await this.appointmentsRepository.findByDayFromProvider({
      provider_id,
      day,
      month,
      year,
    });

    return appointments;
  }
};

export default ListProviderAppointmentsService
;
