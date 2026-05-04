import { css } from '@ocobo/styled-system/css';

type IntroProps = {
  text: string;
};

export function Intro({ text }: IntroProps) {
  return (
    <div
      className={css({
        fontSize: { base: 'xl', md: '2xl' },
        color: 'gray.600',
        fontWeight: 'medium',
        lineHeight: 'relaxed',
        mb: '16',
        fontStyle: 'italic',
        borderLeftWidth: '4px',
        borderColor: 'ocobo.yellow',
        pl: '8',
      })}
    >
      {text}
    </div>
  );
}
