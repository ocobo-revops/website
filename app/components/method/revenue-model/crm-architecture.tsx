import {
  Building2,
  Layers,
  type LucideIcon,
  Repeat,
  Star,
  UserCheck,
  Zap,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { flex, hstack } from '@ocobo/styled-system/patterns';

import { SectionLabel } from './section-label';

type Entity = { name: string; icon: string };
type Branch = { name: string; icon: string };

const iconMap: Record<string, LucideIcon> = {
  userCheck: UserCheck,
  zap: Zap,
  layers: Layers,
  building2: Building2,
  repeat: Repeat,
  star: Star,
};

const entityCardStyle = css({
  bg: 'white',
  borderWidth: '1px',
  borderColor: 'gray.200',
  p: '4',
  rounded: 'xl',
  shadow: 'sm',
  display: 'flex',
  alignItems: 'center',
  gap: '4',
  px: '6',
  transition: 'colors',
  transitionDuration: '200ms',
  _hover: { borderColor: 'ocobo.sky/40' },
});

const branchConnector = css({
  w: '8',
  h: '0',
  borderTopWidth: '1px',
  borderTopStyle: 'dashed',
  borderTopColor: 'gray.300',
});

export const CrmArchitecture = () => {
  const { t } = useTranslation('method');
  const entities = t('scope.crm.entities', { returnObjects: true }) as Entity[];
  const branches = t('scope.crm.branches', { returnObjects: true }) as Branch[];

  return (
    <div
      className={css({
        position: 'relative',
        py: '16',
        bg: 'gray.50/30',
        borderBottomWidth: '1px',
        borderBottomColor: 'gray.100',
        display: { base: 'none', md: 'block' },
      })}
    >
      <SectionLabel label={t('scope.labels.crm')} color="sky" />

      <div
        className={css({
          maxW: '6xl',
          mx: 'auto',
          px: '8',
          position: 'relative',
          h: '32',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        })}
      >
        {/* Dashed connector line behind cards */}
        <div
          className={css({
            position: 'absolute',
            left: '16',
            right: '56',
            h: '0',
            borderTopWidth: '1px',
            borderTopStyle: 'dashed',
            borderTopColor: 'gray.300',
            top: '50%',
            transform: 'translateY(-50%)',
          })}
        />

        {/* Entity cards */}
        {entities.map((entity, i) => {
          const Icon = iconMap[entity.icon] ?? UserCheck;
          const isLast = i === entities.length - 1;

          if (isLast) {
            return (
              <div
                key={`entity-${i}`}
                className={css({
                  position: 'relative',
                  zIndex: '1',
                  display: 'flex',
                  alignItems: 'center',
                })}
              >
                <div className={entityCardStyle}>
                  <span className={css({ color: 'ocobo.sky' })}>
                    <Icon size={20} />
                  </span>
                  <span
                    className={css({
                      fontSize: '12px',
                      fontWeight: 'black',
                      textTransform: 'uppercase',
                      letterSpacing: 'widest',
                      color: 'gray.500',
                      whiteSpace: 'nowrap',
                    })}
                  >
                    {entity.name}
                  </span>
                </div>

                {/* Branches */}
                <div
                  className={flex({
                    direction: 'column',
                    gap: '4',
                    ml: '6',
                  })}
                >
                  {branches.map((branch) => {
                    const BranchIcon = iconMap[branch.icon] ?? Repeat;
                    const isRenewal = branch.icon === 'repeat';
                    return (
                      <div key={branch.name} className={hstack({ gap: '3' })}>
                        <div className={branchConnector} />
                        <div
                          className={css({
                            bg: 'white',
                            borderWidth: '1px',
                            borderColor: 'gray.200',
                            p: '3',
                            rounded: 'xl',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3',
                            px: '5',
                            shadow: 'sm',
                            transition: 'colors',
                            transitionDuration: '200ms',
                            _hover: {
                              borderColor: isRenewal
                                ? 'ocobo.yellow/40'
                                : 'ocobo.mint/40',
                            },
                          })}
                        >
                          <span
                            className={css({
                              color: isRenewal ? 'ocobo.yellow' : 'ocobo.mint',
                            })}
                          >
                            <BranchIcon size={16} />
                          </span>
                          <span
                            className={css({
                              fontSize: '11px',
                              fontWeight: 'black',
                              textTransform: 'uppercase',
                              letterSpacing: 'widest',
                              color: 'gray.500',
                              whiteSpace: 'nowrap',
                              textAlign: 'left',
                            })}
                          >
                            {branch.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }

          return (
            <div
              key={`entity-${i}`}
              className={css({ position: 'relative', zIndex: '1' })}
            >
              <div className={entityCardStyle}>
                <span className={css({ color: 'ocobo.sky' })}>
                  <Icon size={20} />
                </span>
                <span
                  className={css({
                    fontSize: '12px',
                    fontWeight: 'black',
                    textTransform: 'uppercase',
                    letterSpacing: 'widest',
                    color: 'gray.500',
                    whiteSpace: 'nowrap',
                  })}
                >
                  {entity.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
