/**
 * View model of the studio page team (#244): one card per active Team member,
 * in the page language.
 *
 * Every member gets a card. The expert fields (challenge, contribution, tools,
 * previous companies) are optional: a member without them gets a card without
 * those lines, and the bio fills the back. Tools resolve through the Tool
 * registry and placeholders drop, as on challenge pages
 * (`resolveExpertFields`).
 */

import type { Language } from '~/localization/resources';
import {
  type ExpertCard,
  buildExpertCard,
} from './challenge-reference-sections';
import type { ChallengeKey } from './challenge-schema';
import {
  resolveExpertFields,
  toolReporter,
} from './content/challenge-references';
import { getActiveMembers } from './content/members';
import type { MemberRegistry } from './content/members';
import { dropReporter, writtenOrNull } from './content/placeholder';
import type { ToolRegistry } from './content/tools';

export type StudioMemberCard = ExpertCard & {
  /** The challenge the member is an expert of, `null` for none. */
  challenge: ChallengeKey | null;
  /** Bio in the page language, for the back of a card with no contribution. */
  bio: string | null;
};

export type StudioTeam = {
  members: StudioMemberCard[];
  /** Every member's previous companies, once each, in member order. */
  previousCompanies: string[];
};

const SCOPE = 'StudioTeam';

function uniqueCompanies(cards: readonly StudioMemberCard[]): string[] {
  const seen = new Set<string>();
  return cards
    .flatMap((card) => card.previousCompanies)
    .filter((company) => {
      const key = company.trim().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function buildStudioTeam(
  registry: MemberRegistry,
  tools: ToolRegistry,
  lang: Language,
): StudioTeam {
  const reportTool = toolReporter(tools, (message) =>
    console.error(`[${SCOPE}] studio: ${message}`),
  );
  const reportDrop = dropReporter(SCOPE, 'studio');
  const members = getActiveMembers(registry).map((member) => {
    const expert = resolveExpertFields(member, tools, reportTool, reportDrop);
    return {
      ...buildExpertCard(expert, lang),
      challenge: expert.challenge ?? null,
      bio: writtenOrNull(member.bio[lang], () =>
        reportDrop(`team/${member.slug} bio.${lang}`),
      ),
    };
  });
  return { members, previousCompanies: uniqueCompanies(members) };
}
