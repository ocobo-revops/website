import { CheckCircle2, Handshake, Layers, Send, Sparkles } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { center, flex, grid, vstack } from '@ocobo/styled-system/patterns';
import { badge, iconBox, text } from '@ocobo/styled-system/recipes';

import { FlexPair } from '../home/flex-pair';
import { Container } from '../ui/Container';

interface BenefitData {
  icon: string;
  color: string;
  title: string;
  description: string;
}

const benefitIconMap: Record<string, React.ReactNode> = {
  handshake: <Handshake size={20} />,
  sparkles: <Sparkles size={20} />,
  layers: <Layers size={20} />,
};

const BenefitItem = ({ icon, color, title, description }: BenefitData) => {
  return (
    <FlexPair gap={5}>
      <FlexPair.Icon>
        <div
          className={iconBox({
            size: 'md',
            variant: 'outline',
            color: color as 'sky' | 'yellow' | 'mint',
          })}
        >
          {benefitIconMap[icon]}
        </div>
      </FlexPair.Icon>
      <FlexPair.Content>
        <h4
          className={css({
            fontWeight: 'bold',
            color: 'ocobo.dark',
          })}
        >
          {title}
        </h4>
        <p className={text({ variant: 'body', color: 'muted' })}>
          {description}
        </p>
      </FlexPair.Content>
    </FlexPair>
  );
};

const SuccessMessage = ({ onReset }: { onReset: () => void }) => {
  const { t } = useTranslation('technology');

  return (
    <div
      className={css({
        py: '12',
        textAlign: 'center',
        animation: 'fade-in-up',
      })}
    >
      <div
        className={`${center()} ${css({
          w: '20',
          h: '20',
          bg: 'ocobo.mintLight',
          color: 'ocobo.mint',
          rounded: 'full',
          mx: 'auto',
          mb: '6',
        })}`}
      >
        <CheckCircle2 size={40} />
      </div>
      <h3
        className={`${text({ variant: 'display-md', color: 'dark' })} ${css({ mb: '4' })}`}
      >
        {t('partnerForm.success.title')}
      </h3>
      <p className={`${text({ color: 'muted' })} ${css({ mb: '8' })}`}>
        {t('partnerForm.success.message')}
      </p>
      <button
        type="button"
        onClick={onReset}
        className={css({
          fontSize: 'xs',
          fontWeight: 'black',
          textTransform: 'uppercase',
          letterSpacing: 'widest',
          color: 'gray.400',
          transition: 'colors',
          _hover: { color: 'ocobo.dark' },
        })}
      >
        {t('partnerForm.success.reset')}
      </button>
    </div>
  );
};

const inputStyles = css({
  w: 'full',
  bg: 'gray.50',
  borderWidth: '1px',
  borderColor: 'gray.100',
  outline: 'none',
  p: '4',
  rounded: 'none',
  fontSize: 'sm',
  fontWeight: 'bold',
  _placeholder: { color: 'gray.300' },
  _focus: {
    borderColor: 'ocobo.dark',
    bg: 'white',
  },
});

const PartnerFormFields = ({ onSubmit }: { onSubmit: () => void }) => {
  const { t } = useTranslation('technology');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={vstack({ gap: '6', alignItems: 'stretch' })}
    >
      <h3
        className={`${text({ variant: 'display-md', color: 'dark' })} ${css({ mb: '8' })}`}
      >
        {t('partnerForm.formTitle')}
      </h3>
      <div className={grid({ columns: { base: 1, md: 2 }, gap: '6' })}>
        <div>
          <label
            className={css({
              display: 'block',
              fontSize: 'xs',
              fontWeight: 'black',
              textTransform: 'uppercase',
              letterSpacing: 'widest',
              color: 'ocobo.dark',
              mb: '2',
            })}
          >
            {t('partnerForm.fields.solutionName')}{' '}
            <span className={css({ color: 'ocobo.coral' })}>*</span>
          </label>
          <input
            required
            type="text"
            placeholder={t('partnerForm.fields.solutionNamePlaceholder')}
            className={inputStyles}
          />
        </div>
        <div>
          <label
            className={css({
              display: 'block',
              fontSize: 'xs',
              fontWeight: 'black',
              textTransform: 'uppercase',
              letterSpacing: 'widest',
              color: 'ocobo.dark',
              mb: '2',
            })}
          >
            {t('partnerForm.fields.website')}{' '}
            <span className={css({ color: 'ocobo.coral' })}>*</span>
          </label>
          <input
            required
            type="url"
            placeholder={t('partnerForm.fields.websitePlaceholder')}
            className={inputStyles}
          />
        </div>
      </div>
      <div>
        <label
          className={css({
            display: 'block',
            fontSize: 'xs',
            fontWeight: 'black',
            textTransform: 'uppercase',
            letterSpacing: 'widest',
            color: 'ocobo.dark',
            mb: '2',
          })}
        >
          {t('partnerForm.fields.email')}{' '}
          <span className={css({ color: 'ocobo.coral' })}>*</span>
        </label>
        <input
          required
          type="email"
          placeholder={t('partnerForm.fields.emailPlaceholder')}
          className={inputStyles}
        />
      </div>
      <div>
        <label
          className={css({
            display: 'block',
            fontSize: 'xs',
            fontWeight: 'black',
            textTransform: 'uppercase',
            letterSpacing: 'widest',
            color: 'ocobo.dark',
            mb: '2',
          })}
        >
          {t('partnerForm.fields.message')}
        </label>
        <textarea
          rows={4}
          placeholder={t('partnerForm.fields.messagePlaceholder')}
          className={`${inputStyles} ${css({ resize: 'none' })}`}
        />
      </div>
      <button
        type="submit"
        className={`${center()} ${css({
          w: 'full',
          py: '5',
          bg: 'ocobo.dark',
          color: 'white',
          fontWeight: 'black',
          textTransform: 'uppercase',
          letterSpacing: '0.25em',
          fontSize: 'xs',
          rounded: 'none',
          transition: 'all',
          shadow: 'xl',
          gap: '3',
          _hover: { bg: 'black' },
          '& svg': { transition: 'transform' },
          '&:hover svg': {
            transform: 'translateX(4px) translateY(-4px)',
          },
        })}`}
      >
        {t('partnerForm.submit')} <Send size={16} />
      </button>
    </form>
  );
};

export const PartnerFormSection = () => {
  const { t } = useTranslation('technology');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const benefits = t('partnerForm.benefits', {
    returnObjects: true,
  }) as BenefitData[];

  return (
    <section
      className={css({
        py: '32',
        bg: 'gray.50',
        position: 'relative',
        overflow: 'hidden',
      })}
    >
      <div
        className={css({
          position: 'absolute',
          top: '0',
          right: '0',
          w: '1/3',
          h: 'full',
          bg: 'white',
          transform: 'skewX(12deg) translateX(50%)',
          zIndex: -10,
        })}
      />

      <Container>
        <div
          className={flex({
            direction: { base: 'column', lg: 'row' },
            gap: '20',
            align: 'center',
          })}
        >
          <div className={css({ lg: { w: '1/2' } })}>
            <span
              className={`${badge({ variant: 'sky' })} ${css({ mb: '10' })}`}
            >
              {t('partnerForm.badge')}
            </span>

            <h2
              className={css({
                fontFamily: 'display',
                fontSize: { base: '5xl', md: '6xl' },
                fontWeight: 'bold',
                lineHeight: '0.95',
                letterSpacing: 'tight',
                color: 'ocobo.dark',
                mb: '8',
              })}
            >
              {t('partnerForm.title.before')}
              <br />
              {t('partnerForm.title.after')}{' '}
              <span className={css({ color: 'ocobo.sky' })}>
                {t('partnerForm.title.highlight')}
              </span>
            </h2>

            <p
              className={`${text({ variant: 'subtitle', color: 'muted' })} ${css({ mb: '10' })}`}
            >
              {t('partnerForm.subtitle')}
            </p>

            <div className={`${vstack({ gap: '6' })} ${css({ mb: '12' })}`}>
              {benefits.map((benefit) => (
                <BenefitItem key={benefit.title} {...benefit} />
              ))}
            </div>
          </div>

          <div className={css({ lg: { w: '1/2' }, w: 'full' })}>
            <div
              className={css({
                bg: 'white',
                p: { base: '8', md: '12' },
                rounded: '3xl',
                shadow: '2xl',
                borderWidth: '1px',
                borderColor: 'gray.100',
                position: 'relative',
                overflow: 'hidden',
              })}
            >
              <div
                className={css({
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  w: 'full',
                  h: '1.5',
                  background:
                    'linear-gradient(to right, token(colors.ocobo.yellow), token(colors.ocobo.sky), token(colors.ocobo.mint))',
                })}
              />

              {formSubmitted ? (
                <SuccessMessage onReset={() => setFormSubmitted(false)} />
              ) : (
                <PartnerFormFields onSubmit={() => setFormSubmitted(true)} />
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
