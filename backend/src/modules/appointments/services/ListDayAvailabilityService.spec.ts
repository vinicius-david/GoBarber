import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

import ListDayAvailabilityService from '../services/ListDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listDayAvailability: ListDayAvailabilityService;

describe('ListDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listDayAvailability = new ListDayAvailabilityService(fakeAppointmentsRepository);
  });

  it('should be able to list the day availability', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'userId',
      user_id: 'anyId',
      date: new Date(2020, 2, 21, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'userId',
      user_id: 'anyId',
      date: new Date(2020, 2, 21, 12, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 2, 21, 9).getTime();
    });

    const availability = await listDayAvailability.execute({
      provider_id: 'userId',
      day: 21,
      month: 3,
      year: 2020,
    });

    expect(availability).toEqual(expect.arrayContaining([
      { hour: 8, available: false },
      { hour: 9, available: false },
      { hour: 10, available: true },
      { hour: 11, available: true },
      { hour: 12, available: false },
    ]))
  });

});
