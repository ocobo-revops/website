import { MemberCard } from '~/components/member/member-card';
import type { Member } from '~/modules/content/members';

type HiringContactProps = {
  contact: Member;
};

export function HiringContact({ contact }: HiringContactProps) {
  return <MemberCard member={contact} contextLabel="@ Ocobo" />;
}
