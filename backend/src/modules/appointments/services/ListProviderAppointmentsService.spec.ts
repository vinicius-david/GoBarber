import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

import ListProviderAppointmentsService from '../services/ListProviderAppointmentsService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the provider appointments', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'providerId',
      user_id: 'anyId',
      date: new Date(2020, 2, 21, 8, 0, 0),
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'providerId',
      user_id: 'anyId',
      date: new Date(2020, 2, 21, 9, 0, 0),
    });

    const availability = await listProviderAppointments.execute({
      provider_id: 'providerId',
      day: 21,
      month: 3,
      year: 2020,
    });

    expect(availability).toEqual([
      appointment1,
      appointment2,
    ]);
  });

});
