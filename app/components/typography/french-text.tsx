import { useFrenchText } from '~/hooks/use-french-text';

type FrenchTextProps = {
  children: string;
};

export function FrenchText({ children }: FrenchTextProps) {
  const transform = useFrenchText();
  return <>{transform(children)}</>;
}
