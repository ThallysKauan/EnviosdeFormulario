import { pgTable, serial, text, timestamp, varchar, integer, jsonb } from 'drizzle-orm/pg-core';

export const sites = pgTable('sites', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  url: varchar('url', { length: 255 }).notNull().unique(),
  ownerEmail: varchar('owner_email', { length: 255 }).notNull(),
  apiKey: varchar('api_key', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const submissions = pgTable('submissions', {
  id: serial('id').primaryKey(),
  siteId: integer('site_id').references(() => sites.id).notNull(),
  senderEmail: varchar('sender_email', { length: 255 }),
  data: jsonb('data').notNull(),
  status: varchar('status', { length: 50 }).default('pending').notNull(),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
