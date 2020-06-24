import { container } from 'tsyringe';

import IStorageProvider from '../providers/StorageProvider/models/IStorageProvider';
import DiskStorageProvider from '../providers/StorageProvider/implementations/DiskStorageProvider';

import IMailProvider from '../providers/MailProvider/models/IMailProvider';
import EtherealMailProvider from '../providers/MailProvider/implementations/EtherealMailProvider';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider
);

container.registerInstance<IMailProvider>(
  'EtherealMailProvider',
  new EtherealMailProvider(),
);
