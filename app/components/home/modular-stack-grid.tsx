import { Plus } from 'lucide-react';

import { css } from '@ocobo/styled-system/css';
import { center, flex, grid } from '@ocobo/styled-system/patterns';

interface StackItem {
  type: 'logo' | 'empty';
  label?: string;
  logo?: string;
}

interface ModularStackGridProps {
  items: StackItem[];
  /** Container max width: 'lg' or 'xl' */
  maxWidth?: 'lg' | 'xl';
  /** Show label text below logos */
  showLabels?: boolean;
  /** Staggered fade-in animation */
  animated?: boolean;
}

const maxWidthMap = {
  lg: 'lg',
  xl: 'xl',
} as const;

export const ModularStackGrid = ({
  items,
  maxWidth = 'lg',
  showLabels = false,
  animated = false,
}: ModularStackGridProps) => {
  return (
    <div
      className={css({
        position: 'relative',
        w: 'full',
        maxW: maxWidthMap[maxWidth],
        mx: 'auto',
        aspectRatio: 'square',
        p: '4',
      })}
    >
      <div
        className={css({
          position: 'absolute',
          inset: '0',
          opacity: '0.03',
          pointerEvents: 'none',
        })}
        style={{
          backgroundImage:
            'linear-gradient(#212323 1px, transparent 1px), linear-gradient(90deg, #212323 1px, transparent 1px)',
          backgroundSize: '25% 25%',
        }}
      />

      <div
        className={`${grid({ columns: 4, gap: { base: '3', md: '4' } })} ${css({
          position: 'relative',
          zIndex: '10',
          h: 'full',
        })}`}
      >
        {items.map((item, i) => (
          <div
            key={item.label ?? `empty-${i}`}
            className={`${center()} ${css({
              aspectRatio: 'square',
              rounded: { base: 'xl', md: '2xl' },
              borderWidth: '1px',
              transition: 'all',
              transitionDuration: '500ms',
              ...(item.type === 'logo'
                ? {
                    bg: 'white',
                    borderColor: 'gray.100',
                    shadow: 'soft',
                    _hover: {
                      shadow: 'xl',
                      transform: 'translateY(-4px)',
                      borderColor: 'ocobo.sky/30',
                    },
                  }
                : {
                    bg: 'gray.50/50',
                    borderStyle: 'dashed',
                    borderColor: 'gray.200',
                    _hover: {
                      bg: 'white',
                      borderStyle: 'solid',
                      borderColor: 'ocobo.yellow/40',
                    },
                  }),
              ...(animated ? { animation: 'fade-in-up' } : {}),
            })} group`}
            style={
              animated
                ? {
                    animationDelay: `${i * 0.05}s`,
                    opacity: 0,
                    animationFillMode: 'forwards',
                  }
                : undefined
            }
          >
            {item.type === 'logo' ? (
              <div
                className={flex({
                  direction: 'column',
                  align: 'center',
                  gap: '1.5',
                })}
              >
                <img
                  src={item.logo}
                  alt={item.label}
                  className={css({
                    w: { base: '6', md: '8' },
                    h: { base: '6', md: '8' },
                    objectFit: 'contain',
                    filter: 'grayscale(100%)',
                    opacity: '0.6',
                    transition: 'all',
                    transitionDuration: '300ms',
                    _groupHover: { filter: 'grayscale(0%)', opacity: '1' },
                  })}
                />
                {showLabels && item.label && (
                  <span
                    className={css({
                      fontSize: 'xs',
                      fontWeight: 'black',
                      textTransform: 'uppercase',
                      letterSpacing: 'widest',
                      color: 'ocobo.dark',
                      opacity: '0.3',
                    })}
                  >
                    {item.label}
                  </span>
                )}
              </div>
            ) : (
              <Plus
                size={16}
                className={css({
                  color: 'gray.200',
                  transition: 'colors',
                  transitionDuration: '300ms',
                  _groupHover: { color: 'ocobo.yellow' },
                })}
              />
            )}
          </div>
        ))}
      </div>

      <div
        className={css({
          position: 'absolute',
          bottom: '-6',
          right: '-6',
          w: '24',
          h: '24',
          bg: 'ocobo.yellow/5',
          rounded: 'full',
          filter: 'blur(32px)',
          zIndex: '-10',
        })}
      />
    </div>
  );
};

export const DEFAULT_STACK_ITEMS: StackItem[] = [
  { type: 'logo', label: 'HubSpot', logo: '/images/partners/hubspot.png' },
  { type: 'logo', label: 'Clay', logo: '/images/partners/clay.png' },
  {
    type: 'logo',
    label: 'Salesforce',
    logo: '/images/partners/salesforce.png',
  },
  { type: 'logo', label: 'Notion', logo: '/images/partners/notion.png' },
  { type: 'logo', label: 'Vasco', logo: '/images/partners/vasco.webp' },
  { type: 'logo', label: 'Aircall', logo: '/images/partners/aircall.png' },
  { type: 'empty' },
  { type: 'logo', label: 'Qobra', logo: '/images/partners/qobra.png' },
  { type: 'logo', label: 'Modjo', logo: '/images/partners/modjo.jpeg' },
  { type: 'empty' },
  { type: 'logo', label: 'Planhat', logo: '/images/partners/planhat.png' },
  { type: 'logo', label: 'Dust', logo: '/images/partners/dust.png' },
  { type: 'empty' },
  {
    type: 'logo',
    label: 'Hyperline',
    logo: '/images/partners/hyperline.svg',
  },
  { type: 'logo', label: 'Lemlist', logo: '/images/partners/lemlist.webp' },
  { type: 'empty' },
];
