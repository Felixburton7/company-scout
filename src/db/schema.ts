import { mysqlTable, serial, varchar, int, text, timestamp, json } from 'drizzle-orm/mysql-core';

export const companies = mysqlTable('companies', {
  id: serial('id').primaryKey(),
  domain: varchar('domain', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).default('researching'), // researching, qualified, rejected
  leadScore: int('lead_score').default(0),
  summary: text('summary'),
  contacts: json('contacts'),
  emailDraft: text('email_draft'),
  createdAt: timestamp('created_at').defaultNow(),
});
