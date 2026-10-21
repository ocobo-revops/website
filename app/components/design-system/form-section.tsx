import { createListCollection } from '@ark-ui/react/select';

import { css } from '@ocobo/styled-system/css';
import { vstack } from '@ocobo/styled-system/patterns';

import { Input } from '~/components/ui/Input';
import { Label } from '~/components/ui/Label';
import { Select } from '~/components/ui/Select';

import { ShowcaseSection } from './showcase-section';

const fruitCollection = createListCollection({
  items: [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'blueberry', label: 'Blueberry' },
    { value: 'grapes', label: 'Grapes' },
    { value: 'pineapple', label: 'Pineapple' },
  ],
});

const field = css({
  width: 'md',
});

export function FormSection() {
  return (
    <ShowcaseSection title="Form">
      <form
        className={vstack({
          alignItems: 'start',
          bg: 'coral.light',
          p: '8',
        })}
      >
        <div className={field}>
          <Label htmlFor="email" className={css({})}>
            E-mail professionnel*
          </Label>
          <Input id="email" name="email" placeholder="nom@email.com" />
        </div>
        <div className={field}>
          <Label htmlFor="email_disabled" className={css({})}>
            E-mail professionnel*
          </Label>
          <Input
            disabled
            id="email_disabled"
            name="email_disabled"
            placeholder="nom@email.com"
          />
        </div>
        <div className={field}>
          <Label htmlFor="email_error" className={css({})}>
            E-mail professionnel*
          </Label>
          <Input
            isError
            id="email_error"
            name="email_error"
            placeholder="nom@email.com"
          />
        </div>
        <div className={field}>
          <Label htmlFor="email_error" className={css({})}>
            Select
          </Label>
          <Select.Root collection={fruitCollection}>
            <Select.Trigger>
              <Select.Value placeholder="Select a fruit" />
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                <Select.Label>Fruits</Select.Label>
                {fruitCollection.items.map((item) => (
                  <Select.Item key={item.value} item={item}>
                    {item.label}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
      </form>
    </ShowcaseSection>
  );
}
