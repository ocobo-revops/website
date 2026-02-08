import { css } from '@ocobo/styled-system/css';
import { center, flex } from '@ocobo/styled-system/patterns';

interface Client {
  name: string;
  logo: string;
}

interface ClientMarqueeProps {
  clients: Client[];
  /** Vertical padding: 'sm' = 3, 'md' = 8 */
  padding?: 'sm' | 'md';
  /** Show border-y */
  bordered?: boolean;
}

const paddingMap = {
  sm: '3',
  md: '8',
} as const;

export const ClientMarquee = ({
  clients,
  padding = 'sm',
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
        className={`${flex({ align: 'center' })} ${css({
          w: 'max',
          animation: 'marquee-ultra-slow',
          whiteSpace: 'nowrap',
        })}`}
      >
        {extendedClients.map((client, idx) => (
          <div
            key={`${client.name}-${idx}`}
            className={`${center()} ${css({ px: { base: '10', md: '14' } })}`}
          >
            <img
              src={client.logo}
              alt={client.name || 'Client logo'}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              className={css({
                h: '8',
                w: 'auto',
                objectFit: 'contain',
                opacity: '0.4',
                transition: 'opacity',
                transitionDuration: '300ms',
                cursor: 'default',
                userSelect: 'none',
                _hover: { opacity: '1' },
              })}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
