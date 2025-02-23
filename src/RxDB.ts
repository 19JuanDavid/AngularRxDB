import { RxCollection, RxDatabase, RxDocument } from 'rxdb';
import { RxMessageDocumentType } from './app/models/message.model';

export type RxMessageDocument = RxDocument<RxMessageDocumentType, {}>;
export type RxMessageCollection = RxCollection<RxMessageDocumentType, {}, {}>;
export type RxMessageCollections = { message: RxMessageCollection };
export type RxMessageDatabase = RxDatabase<RxMessageCollections>;
