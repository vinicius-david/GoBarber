import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

import ListMonthAvailabilityService from '../services/ListMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listMonthAvailability: ListMonthAvailabilityService;

describe('ListMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listMonthAvailability = new ListMonthAvailabilityService(fakeAppointmentsRepository);
  });

  it('should be able to list the month availability', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'userId',
      date: new Date(2020, 2, 21, 8, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'userId',
      date: new Date(2020, 2, 21, 9, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'userId',
      date: new Date(2020, 2, 21, 10, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'userId',
      date: new Date(2020, 2, 21, 11, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'userId',
      date: new Date(2020, 2, 21, 12, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'userId',
      date: new Date(2020, 2, 21, 13, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'userId',
      date: new Date(2020, 2, 21, 14, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'userId',
      date: new Date(2020, 2, 21, 15, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'userId',
      date: new Date(2020, 2, 21, 16, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'userId',
      date: new Date(2020, 2, 21, 17, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'userId',
      date: new Date(2020, 2, 22, 9, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'userId',
      date: new Date(2020, 2, 22, 10, 0, 0),
    });

    const availability = await listMonthAvailability.execute({
      provider_id: 'userId',
      month: 3,
      year: 2020,
    });

    expect(availability).toEqual(expect.arrayContaining([
      { day: 20, available: true },
      { day: 21, available: false },
      { day: 22, available: true },
      { day: 23, available: true },
    ]))
  });

});
