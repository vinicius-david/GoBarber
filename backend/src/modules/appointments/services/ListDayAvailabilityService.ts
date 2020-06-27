import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface RequestDTO {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponseDTO = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({ provider_id, day, month, year }: RequestDTO): Promise<IResponseDTO> {
    const appointments = await this.appointmentsRepository.findByDayFromProvider({
      provider_id,
      day,
      month,
      year,
    });

    const startHour = 8;

    const hoursArray = Array.from(
      { length: 10 },
      (value, index) => index + startHour,
    );

    const currentDate = new Date(Date.now());

    const availability = hoursArray.map(hour => {
      const hasAppointmentInHour = appointments.find(appointment => {
        return getHours(appointment.date) === hour;
      });

      const appointmentDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        available: !hasAppointmentInHour && isAfter(appointmentDate, currentDate),
      };
    });

    return availability;
  }
};

export default ListDayAvailabilityService;
