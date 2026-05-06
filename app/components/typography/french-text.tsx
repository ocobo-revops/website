import { useFrenchText } from '~/hooks/use-french-text';

type FrenchTextProps = {
  children: string | null | undefined;
};

export function FrenchText({ children }: FrenchTextProps) {
  const transform = useFrenchText();
  if (!children) return null;
  return <>{transform(children)}</>;
}
