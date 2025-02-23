import {
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxJsonSchema,
  toTypedRxJsonSchema,
} from 'rxdb';

export const MESSAGE_SCHEMA_LITERAL = {
  title: 'Message schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100, // <- la primary key debe tener un tamaño maximo
    },
    content: {
      type: 'string',
    },
    timestamp: {
      type: 'date-time',
    },
  },
  required: ['id', 'content', 'timestamp'],
};

const schemaType = toTypedRxJsonSchema(MESSAGE_SCHEMA_LITERAL);
export type RxMessageDocumentType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaType
>;

export const MESSAGE_SCHEMA: RxJsonSchema<RxMessageDocumentType> =
  MESSAGE_SCHEMA_LITERAL;
