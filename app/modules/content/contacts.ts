import yaml from 'js-yaml';
import {
  type ContactsRecord,
  ContactsRecordSchema,
  type HiringContact,
} from '../schemas';

export function parseContactsYaml(raw: string): ContactsRecord {
  const parsed = yaml.load(raw);
  const result = ContactsRecordSchema.safeParse(parsed);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .join('; ');
    throw new Error(`Invalid _contacts.yml: ${issues}`);
  }
  return result.data;
}

export function resolveContact(
  ref: string,
  registry: ContactsRecord,
): HiringContact | null {
  return registry[ref] ?? null;
}
