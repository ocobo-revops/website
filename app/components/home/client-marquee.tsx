import { css } from '@ocobo/styled-system/css';
import { center, flex } from '@ocobo/styled-system/patterns';

interface ClientMarqueeProps {
  clients: string[];
  /** Vertical padding: 'sm' = 3, 'md' = 8 */
  padding?: 'sm' | 'md';
  /** Text size: 'sm' = base/lg, 'md' = base/xl */
  textSize?: 'sm' | 'md';
  /** Show border-y */
  bordered?: boolean;
}

const paddingMap = {
  sm: '3',
  md: '8',
} as const;

const textSizeMap = {
  sm: { base: 'base', md: 'lg' },
  md: { base: 'base', md: 'xl' },
} as const;

export const ClientMarquee = ({
  clients,
  padding = 'sm',
  textSize = 'sm',
  bordered = false,
}: ClientMarqueeProps) => {
  const extendedClients = [...clients, ...clients, ...clients];

  return (
    <div
      className={css({
        position: 'relative',
        w: 'full',
        overflow: 'hidden',
        py: paddingMap[padding],
        ...(bordered
          ? {
              borderTopWidth: '1px',
              borderBottomWidth: '1px',
              borderColor: 'white/5',
            }
          : {}),
      })}
    >
      <div
        className={css({
          position: 'absolute',
          left: '0',
          top: '0',
          bottom: '0',
          w: { base: '32', md: '64' },
          bgGradient: 'to-r',
          gradientFrom: 'ocobo.dark',
          gradientTo: 'transparent',
          zIndex: '10',
          pointerEvents: 'none',
        })}
      />
      <div
        className={css({
          position: 'absolute',
          right: '0',
          top: '0',
          bottom: '0',
          w: { base: '32', md: '64' },
          bgGradient: 'to-l',
          gradientFrom: 'ocobo.dark',
          gradientTo: 'transparent',
          zIndex: '10',
          pointerEvents: 'none',
        })}
      />

      <div
        className={`${flex()} ${css({
          w: 'max',
          animation: 'marquee-ultra-slow',
          whiteSpace: 'nowrap',
        })}`}
      >
        {extendedClients.map((client, idx) => (
          <div
            key={`${client}-${idx}`}
            className={`${center()} ${css({ px: { base: '10', md: '14' } })}`}
          >
            <span
              className={css({
                fontFamily: 'display',
                fontWeight: 'black',
                color: 'white/20',
                fontSize: textSizeMap[textSize],
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                transition: 'colors',
                transitionDuration: '300ms',
                cursor: 'default',
                userSelect: 'none',
                _hover: { color: 'ocobo.yellow' },
              })}
            >
              {client}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
