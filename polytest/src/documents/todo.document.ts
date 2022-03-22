import { Timestamp } from '@google-cloud/firestore';

export class TodoDocument {
  static collectionName = 'todos';

  name: string;
  dueDate: Timestamp;
}