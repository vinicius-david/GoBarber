import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface RequestDTO {
  provider_id: string;
  month: number;
  year: number;
}

type IResponseDTO = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({ provider_id, month, year }: RequestDTO): Promise<IResponseDTO> {
    const appointments = await this.appointmentsRepository.findByMonthFromProvider({
      provider_id,
      month,
      year
    });

    const daysInMonth = getDaysInMonth(new Date(year, month - 1));

    const daysArray = Array.from(
      { length: daysInMonth },
      (value, index) => index + 1,
    );

    const availability = daysArray.map(day => {
      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });

      return {
        day,
        available: appointmentsInDay.length < 10,
      };
    });

    return availability;
  }
};

export default ListMonthAvailabilityService;
