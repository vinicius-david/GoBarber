import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import AppError from '@shared/errors/AppError';

describe('CreateAppointmnet', () => {
  it('should be able to create an appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(fakeAppointmentsRepository);

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: 'testID123',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('testID123');
  });

  it('should be not able to create two appointments at the same date', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(fakeAppointmentsRepository);

    const appointmentDate = new Date();

    const appointment = await createAppointment.execute({
      date: appointmentDate,
      provider_id: 'testID123',
    });

    expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: 'testID123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
