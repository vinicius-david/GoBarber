import AppError from '@shared/errors/AppError';

import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointmnet', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(fakeAppointmentsRepository);
  });

  it('should be able to create an appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 1, 21, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 1, 21, 13),
      provider_id: 'testID123',
      user_id: 'anyId',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('testID123');
  });

  it('should be not able to create two appointments at the same date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 1, 21, 12).getTime();
    });

    const appointmentDate = new Date(2020, 1, 21, 13);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: 'testID123',
      user_id: 'anyId',
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: 'testID123',
        user_id: 'anyId',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be not able to create an appointment in the past', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 1, 21, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 1, 21, 11),
        provider_id: 'testID123',
        user_id: 'anyId',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be not able to create an appointment with yourself', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 1, 21, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 1, 21, 11),
        provider_id: 'testID123',
        user_id: 'testID123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be not able to create an appointment before 8h or after 17h', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 1, 21, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 1, 21, 18),
        provider_id: 'testID123',
        user_id: 'testID123',
      })
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 1, 22, 7),
        provider_id: 'testID123',
        user_id: 'testID123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
