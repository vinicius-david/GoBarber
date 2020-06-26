import { injectable, inject } from 'tsyringe';

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

    return [{ day: 1, available: false }];
  }
};

export default ListMonthAvailabilityService;
