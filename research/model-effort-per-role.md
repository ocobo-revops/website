# Modèle et niveau d'effort par rôle de la phase 1

Recherche pour le ticket Linear GTM-65 (carte GTM-54, projet "Agents factory"). État des docs officielles consultées le 28 novembre 2026.

## Question

Quel modèle Claude et quel niveau d'effort pour chacun des trois rôles de la phase 1 ?

- **Intake et orchestrateur** : la session principale. Seul rôle qui écrit dans Linear et GitHub.
- **Builder** : subagent, seul rédacteur de code, travaille dans un worktree.
- **Reviewer** : subagent en lecture seule, isolé, qui juge le diff.

Le ticket demande aussi ce que Claude Code permet de régler par subagent, l'écart de qualité mesuré entre modèles, l'intérêt d'un reviewer plus fort que le builder, et le coût en quota par intention.

## Réponse courte

- **Intake et orchestrateur** : Opus 5.5 en effort `medium`, le réglage par défaut des plans payants. Bascule vers Sonnet 5.5 `medium` si la limite hebdomadaire est atteinte avant la fin de semaine.
- **Builder** : Sonnet 5.5 en effort `medium`, fixé dans le frontmatter. Passer à `high` pour un ticket long ou transverse. Bascule vers Opus 5.5 si plus d'un aller-retour de review par ticket devient la norme.
- **Reviewer** : Opus 5.5 en effort `medium`, fixé dans le frontmatter. Bascule vers Sonnet 5.5 si un test A/B local sur une dizaine de PR montre les mêmes défauts trouvés.
- **Fable 5.2** : hors de la phase 1. Son quota est séparé ou plafonné, et Anthropic garde Opus 5.5 comme modèle quotidien.
- **Reviewer plus fort que le builder** : aucune source primaire ne le mesure. Le choix repose sur un indice indirect et doit être vérifié localement.
- **Piège de configuration** : `CLAUDE_CODE_EFFORT_LEVEL` écrase tout. Un subagent sur un autre modèle que la session n'hérite pas de l'effort : il faut écrire `effort` explicitement.

## Ce que Claude Code permet de régler

### Modèle par subagent

Source : [Subagents](https://code.claude.com/docs/en/sub-agents).

- **Champ** : `model` accepte `sonnet`, `opus`, `haiku`, `fable`, un identifiant complet ou `inherit`. Sans champ, le subagent prend le modèle du parent.
- **Ordre de priorité** : le paramètre `model` passé à l'appel, puis le frontmatter, puis `CLAUDE_CODE_SUBAGENT_MODEL`, puis le modèle de la session.
- **Forçage** : `CLAUDE_CODE_SUBAGENT_MODEL_FORCE=1` ignore le frontmatter (v2.1.257 et plus).
- **Conséquence** : l'orchestrateur peut écraser le modèle d'un rôle à l'appel. Le prompt de l'orchestrateur ne doit pas passer de `model`, sauf exception voulue.
- **Explore intégré** : il hérite du modèle du parent, donc Opus sur un abonnement. Pour l'exploration en Haiku, définir son propre agent `Explore` avec `model: haiku`.

### Effort par subagent

Source : [Subagents](https://code.claude.com/docs/en/sub-agents).

- **Champ** : `effort` accepte `low`, `medium`, `high`, `xhigh` et `max`. Il écrase l'effort de la session, mais pas la variable `CLAUDE_CODE_EFFORT_LEVEL`.
- **Ordre de priorité** : `CLAUDE_CODE_EFFORT_LEVEL`, puis l'effort de l'agent appelant ou d'une skill, puis `CLAUDE_CODE_SUBAGENT_EFFORT`. Le paramètre d'effort passé à l'appel écrase le champ.
- **Par défaut** : sur le même modèle que la session, le subagent reprend le `/effort` de la session. Sur un autre modèle, l'effort de la session ne s'applique pas.
- **Conséquence** : le Builder en Sonnet sous une session Opus doit porter `effort: medium` dans son frontmatter.

### Valeurs par défaut et plafonds

Source : [Model configuration](https://code.claude.com/docs/en/model-config).

- **Alias** : `opus` désigne Opus 5.5, `sonnet` Sonnet 5.5, `haiku` Haiku 5.5, `fable` Fable 5.2.
- **Modèle par défaut** : Opus 5.5 sur Pro, Max, Team, Ultra et Enterprise.
- **Effort par défaut dans Claude Code** : `medium` pour les quatre modèles. Les quatre acceptent les cinq niveaux.
- **Réflexion** : impossible à couper sur les modèles 5.5 et sur Fable.
- **Plafond** : une organisation peut limiter l'effort avec `maxEffortLevel`.
- **Fable** : selon le plan ou le siège, il consomme des crédits d'usage ("Requires usage credits" dans `/model`).

## Écart de qualité entre modèles

### Écriture de code

Sources : [Claude Opus 5.5](https://www.anthropic.com/news/claude-opus-5-5), [Claude Sonnet 5.5](https://www.anthropic.com/news/claude-sonnet-5-5), [Claude Haiku](https://www.anthropic.com/claude/haiku), [Fable 5.2 overview](https://platform.claude.com/docs/en/models/fable-5-2/overview), [Fable et Mythos 5.2](https://www.anthropic.com/claude-fable-and-mythos-5-2).

| Benchmark | Opus 5.5 | Sonnet 5.5 | Haiku 5.5 | Fable 5.2 |
|---|---|---|---|---|
| Terminal-Bench 4.0 | 66,4 % (xhigh) | 70,6 % | 39,2 % (source secondaire) | non publié |
| FrontierCode (max) | 54,4 % | 46,2 % | non publié | 49,1 % (xhigh, version 2.0) |
| CursorBench | 57,8 % (max) | 55,5 % | non publié | non publié |

- **Sonnet 5.5** : meilleur sur les tâches bien cadrées et les corrections de bugs. Anthropic le dit plus faible qu'Opus sur le travail ouvert qui demande du jugement suivi.
- **Opus 5.5** : en effort `medium`, 54,6 % sur FrontierCode et 52,5 % sur CursorBench. Le niveau par défaut perd peu face à `max`.
- **Haiku 5.5** : présenté comme subagent rapide pour les tâches bien définies. Il ne convient pas comme agent de code principal.
- **Fable 5.2** : en effort `high`, 45,3 % sur FrontierCode 2.0 contre 45,5 % pour Opus 5.5. Il mène sur FrontierSWE v2 (69,9 % contre 62,3 %).
- **Retour terrain cité par Anthropic** : un studio laisse Opus fixer l'architecture et Sonnet implémenter. C'est la répartition proposée ici.

### Review d'un diff

Sources : [Claude Opus 5.5](https://www.anthropic.com/news/claude-opus-5-5), [Claude Sonnet 5.5](https://www.anthropic.com/news/claude-sonnet-5-5), [Review locally with /code-review](https://code.claude.com/docs/en/code-review-local).

- **Opus 5.5** : Deloitte rapporte 72 % des bugs connus détectés, même à l'effort le plus bas. Opus 5 en trouvait 56 % en effort `high`.
- **Sonnet 5.5** : CodeRabbit lui confie les reviews simples et moyennes. Aucun taux de détection publié.
- **Risque de Sonnet en effort max** : il lance plus souvent la skill de review, multiplie les subagents, et finit en timeout ou en modifications hors périmètre.
- **Effort et review** : `/code-review` en `low` rapporte les défauts les plus sûrs. De `medium` à `max`, la couverture s'élargit, avec plus de faux positifs.
- **Code Review managé** : Anthropic choisit lui-même les modèles de ses agents. Aucune donnée par rôle n'est publiée ([Code Review](https://code.claude.com/docs/en/code-review)).

## Reviewer plus fort que le builder

- **Constat** : aucune source primaire ne compare un reviewer plus fort au builder et un reviewer de même force.
- **Indice indirect** : un modèle juge plus favorablement une sortie qu'il croit sienne, surtout quand le code est faux ([arXiv 2603.04582](https://arxiv.org/html/2603.04582v1)). Un modèle différent du builder limite ce biais.
- **Indice contraire** : sur la révision de texte, une autre étude ne trouve pas de préférence pour soi ([arXiv 2606.20093](https://arxiv.org/abs/2606.20093)). Une partie de la préférence suit une qualité réelle ([arXiv 2504.03846](https://arxiv.org/abs/2504.03846v3)).
- **Argument de coût** : le reviewer lit un diff, pas tout le ticket. Son entrée est courte, donc le surcoût d'Opus y pèse peu.
- **Mesure proposée** : rejouer une dizaine de PR déjà fusionnées avec deux reviewers, Opus `medium` et Sonnet `medium`. Compter les défauts réels trouvés, les faux positifs, et la consommation affichée par `/usage`.

## Coût en quota par intention

Sources : [Manage costs](https://code.claude.com/docs/en/costs), [Models, usage, and limits in Claude Code](https://support.claude.com/en/articles/14552983-models-usage-and-limits-in-claude-code), [Using Claude Code with your Pro or Max plan](https://support.claude.com/en/articles/11145838-using-claude-code-with-your-pro-or-max-plan), [Models overview](https://platform.claude.com/docs/en/about-claude/models/overview), [Effort](https://platform.claude.com/docs/en/build-with-claude/effort).

- **Fenêtres** : une fenêtre glissante de 5 heures et une fenêtre hebdomadaire. Elles sont partagées entre tous les modèles et avec le chat claude.ai.
- **Fable** : Max a une limite hebdomadaire Fable séparée. Sur Pro et les sièges Team standard, Fable compte jusqu'à 50 % de la limite hebdomadaire.
- **Ordre de grandeur** : Anthropic écrit qu'Opus coûte plusieurs fois plus par tour que Sonnet, et Sonnet plus que Haiku.
- **Prix API comme repère relatif** (entrée / sortie par million de tokens) : Fable 8 $ / 40 $, Opus 4 $ / 20 $, Sonnet 2 $ / 10 $, Haiku à partir de 0,10 $ / 0,50 $.
- **Effort** : il agit sur tous les tokens, appels d'outils compris. Changer l'effort de la session en cours de conversation peut invalider le cache.
- **Subagents** : chacun envoie ses propres requêtes et consomme le quota. `/usage` attribue la consommation par subagent.
- **Chiffre par intention** : aucun chiffre publié. La seule moyenne officielle est 13 $ par développeur et par jour actif en Enterprise.

Estimation relative d'une intention, à vérifier avec `/usage` :

| Combinaison (orchestrateur / builder / reviewer) | Poids relatif attendu | Commentaire |
|---|---|---|
| Opus / Opus / Opus | le plus lourd | Le builder produit la majorité des tokens |
| Opus / Sonnet / Opus | intermédiaire | Recommandation de ce document |
| Sonnet / Sonnet / Opus | plus léger | Repli si la limite hebdomadaire est atteinte |
| Sonnet / Sonnet / Sonnet | le plus léger | Pas de regard d'un modèle différent sur le diff |

Le builder pèse le plus, car il lit le code, exécute les contrôles et itère. Le choix de son modèle compte donc davantage pour le quota que celui des deux autres rôles.

## Recommandation par rôle

### Intake et orchestrateur

- **Choix** : Opus 5.5, effort `medium`. Aucun réglage à faire, c'est le défaut du plan.
- **Pourquoi** : il découpe le ticket, rédige les briefs et décide des retours de review. Ce travail demande du jugement et produit peu de tokens.
- **Bascule** : Sonnet 5.5 `medium` si la limite hebdomadaire est atteinte avant la fin de semaine. L'orchestration reste légère.

### Builder

- **Choix** : Sonnet 5.5, `model: sonnet` et `effort: medium` dans le frontmatter. Effort `high` à l'appel pour un ticket long ou transverse.
- **Pourquoi** : les tickets arrivent cadrés par l'Intake. Anthropic recommande Sonnet `medium` pour le code bien spécifié, et Sonnet mène sur Terminal-Bench 4.0.
- **Ne pas monter à `max`** : Anthropic signale timeouts et modifications hors périmètre à ce niveau.
- **Bascule** : Opus 5.5 si plus d'un aller-retour de review par ticket devient la norme. Aussi pour un refactor de `preset/` ou d'une recette partagée.

### Reviewer

- **Choix** : Opus 5.5, `model: opus` et `effort: medium` dans le frontmatter. Le fixer explicitement protège contre un changement du modèle de session.
- **Pourquoi** : la review demande du jugement, l'entrée est courte, et un modèle différent du builder limite le biais d'auto-évaluation.
- **Bascule** : Sonnet 5.5 si le test A/B sur une dizaine de PR montre les mêmes défauts réels trouvés. Fable 5.2 seulement pour une review profonde d'un changement critique, si le quota Fable le permet.

## Exemple de frontmatter

```yaml
# .claude/agents/builder.md
model: sonnet
effort: medium
isolation: worktree
```

```yaml
# .claude/agents/reviewer.md
model: opus
effort: medium
```

Ne pas définir `CLAUDE_CODE_EFFORT_LEVEL` ni `CLAUDE_CODE_SUBAGENT_MODEL_FORCE` sur le poste de l'opérateur. Ces variables annulent ces réglages.

## Questions ouvertes

- **Plan réel** : le siège de l'opérateur (Team Standard, Team Premium ou Max) fixe la taille des fenêtres. Le document ne la connaît pas.
- **Mesure locale** : le test A/B du reviewer et la consommation par intention restent à faire, avec `/usage`.
