import { Injectable } from '@angular/core';
import { addRxPlugin, createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';
import { MESSAGE_SCHEMA_LITERAL } from '../models/message.model';

addRxPlugin(RxDBJsonDumpPlugin);

async function createDatabase() {
  const db = await createRxDatabase<any>({
    name: 'message-db',
    storage: getRxStorageDexie(),
  });

  // Creamos la colección
  await db.addCollections({
    message: {
      schema: MESSAGE_SCHEMA_LITERAL,
    },
  });

  // Inserta un mensaje de prueba (esto se puede eliminar después)
 
  const myCollection = db.message;
  myCollection.exportJSON().then((json: any) => console.dir(json));

  return db;
}

let initState: null | Promise<any>;
let DB_INSTANCE: any;

export async function initDatabase() {
  if (!initState) {
    initState = createDatabase().then((db) => (DB_INSTANCE = db));
  }
  await initState;
}

@Injectable({
  providedIn: 'root',
})
export class DbService {
  constructor() {}

  // Método para obtener la instancia de la base de datos y acceder a la colección "message"
  async getDb() {
    if (!DB_INSTANCE) {
      await initDatabase();  // Asegura que la base de datos esté inicializada
    }
    if (!DB_INSTANCE) {
      throw new Error('La base de datos aún no ha sido inicializada');
    }
    return DB_INSTANCE;
  }

  // Método para acceder a la colección de mensajes
  async getMessages() {
    const db = await this.getDb(); // Obtiene la instancia de la base de datos
    return db.message.find().exec();  // Devuelve todos los mensajes usando exec()
  }
}
