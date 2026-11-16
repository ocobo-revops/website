import * as React from 'react';

import { css, cx } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

import type { ChallengeKey } from '~/modules/challenge-schema';

// One static class per challenge: Panda only ships literal values.
const ringColour: Record<ChallengeKey, string> = {
  rp: css({ bg: 'challenge.rp' }),
  se: css({ bg: 'challenge.se' }),
  sc: css({ bg: 'challenge.sc' }),
  cx: css({ bg: 'challenge.cx' }),
  sy: css({ bg: 'challenge.sy' }),
  ai: css({ bg: 'challenge.ai' }),
};

const avatarColour: Record<ChallengeKey, string> = {
  rp: css({ bg: 'challenge.rp.light' }),
  se: css({ bg: 'challenge.se.light' }),
  sc: css({ bg: 'challenge.sc.light' }),
  cx: css({ bg: 'challenge.cx.light' }),
  sy: css({ bg: 'challenge.sy.light' }),
  ai: css({ bg: 'challenge.ai.light' }),
};

const ring = css({ display: 'flex', flexShrink: '0', borderRadius: 'full' });
const ringSize = {
  lg: css({ w: '24', h: '24', p: '1' }),
  sm: css({ w: '11', h: '11', p: '0.5' }),
};
const ringGrey = css({ bg: 'gray.200' });
const avatar = css({
  position: 'relative',
  flex: '1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  borderRadius: 'full',
  borderStyle: 'solid',
  borderColor: 'white',
});
const avatarSize = {
  lg: cx(text({ variant: 'display-md-bold' }), css({ borderWidth: '3px' })),
  sm: cx(
    text({ variant: 'small' }),
    css({ fontWeight: 'bold', borderWidth: '2px' }),
  ),
};
const avatarGrey = css({ bg: 'gray.50' });
const photoStyle = css({
  position: 'absolute',
  inset: '0',
  w: 'full',
  h: 'full',
  objectFit: 'cover',
});

const pixels = { lg: 96, sm: 44 } as const;

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

type MemberAvatarProps = {
  name: string;
  /** Photo URL. Without it, or when it fails to load, initials show. */
  photo?: string;
  /** Colours the ring. Without it, the ring is grey. */
  challenge?: ChallengeKey | null;
  /** `lg` (96px) on person cards, `sm` (44px) in a row of faces. */
  size?: 'lg' | 'sm';
  /** `eager` for a photo above the fold. */
  loading?: 'lazy' | 'eager';
  className?: string;
};

/**
 * Round photo in a ring of the member's challenge colour, initials behind it.
 * Decorative: the name always follows as text, so the photo has no alt.
 */
export function MemberAvatar({
  name,
  photo,
  challenge,
  size = 'lg',
  loading = 'lazy',
  className,
}: MemberAvatarProps) {
  const [photoFailed, setPhotoFailed] = React.useState(false);
  const photoRef = React.useRef<HTMLImageElement>(null);

  // A photo that fails before hydration never fires `onError`.
  React.useEffect(() => {
    const image = photoRef.current;
    if (image?.complete && image.naturalWidth === 0) setPhotoFailed(true);
  }, []);

  return (
    <span
      className={cx(
        ring,
        ringSize[size],
        challenge ? ringColour[challenge] : ringGrey,
        className,
      )}
    >
      <span
        className={cx(
          avatar,
          avatarSize[size],
          challenge ? avatarColour[challenge] : avatarGrey,
        )}
      >
        <span aria-hidden="true">{getInitials(name)}</span>
        {photo && !photoFailed && (
          <img
            ref={photoRef}
            src={photo}
            alt=""
            width={pixels[size]}
            height={pixels[size]}
            loading={loading}
            className={photoStyle}
            onError={() => setPhotoFailed(true)}
          />
        )}
      </span>
    </span>
  );
}
