# Préchargement des skills de plugin et blocage de version

Recherche pour le ticket Linear GTM-67. Deux questions :

1. Le champ `skills:` du frontmatter d'un subagent (`.claude/agents/*.md`) accepte-t-il une skill fournie par un plugin, par exemple `mattpocock-skills:tdd` ?
2. Peut-on bloquer la version d'un plugin pour le projet depuis le `.claude/settings.json` versionné ?

Sources : documentation officielle Claude Code (code.claude.com, lue le 2026-11-28), changelog officiel (`anthropics/claude-code`, `CHANGELOG.md`), état local du plugin `mattpocock-skills` 1.3.2, et un test réel sur Claude Code 2.1.329.

## Réponse

**Q1. Oui.** Une skill de plugin se précharge avec son nom complet `plugin:skill`, par exemple `mattpocock-skills:tdd`. Une skill marquée `disable-model-invocation: true` ne se précharge pas : Claude Code l'ignore avec un avertissement dans le journal de debug. Un subagent peut aussi appeler l'outil Skill pour toute skill de plugin non listée, sauf si `Skill` est retiré de ses outils.

**Q2. Oui, avec `ref`.** Une source de marketplace `github` dans `extraKnownMarketplaces` accepte un champ `ref` : branche, tag, ou SHA complet d'un commit. Pour `mattpocock/skills`, le plugin est servi par un chemin relatif (`"source": "./"`), donc bloquer le marketplace bloque aussi le plugin. Le SHA est le blocage le plus strict, il exige Claude Code v2.1.324 ou plus récent sur chaque poste.

## Q1. Skills de plugin dans le champ `skills:` d'un subagent

### Ce que dit la documentation

Source : [Subagents, frontmatter et section « Preload skills into subagents »](https://code.claude.com/docs/en/sub-agents).

- Le champ `skills` injecte le contenu complet de chaque skill listée au démarrage du subagent. La limite est de 32 noms distincts.
- Ce champ choisit les skills préchargées. Il ne limite pas l'accès : sans lui, le subagent peut toujours découvrir et appeler les skills de projet, d'utilisateur et de plugin via l'outil Skill.
- Pour interdire toute skill à un subagent : retirer `Skill` de `tools`, ou l'ajouter à `disallowedTools`.
- Une skill absente ou désactivée est ignorée, avec un avertissement dans le journal de debug.
- On ne peut pas précharger une skill qui porte `disable-model-invocation: true`. Le préchargement puise dans les skills que Claude peut appeler seul.
- Pour les subagents fournis par un plugin, seuls `hooks`, `mcpServers` et `permissionMode` sont ignorés. Le champ `skills` n'est pas concerné.

Source : [Skills, nommage et frontmatter](https://code.claude.com/docs/en/skills).

- Une skill de plugin est nommée `plugin-name:skill-name` (commande `/plugin-name:skill-name`).
- `disable-model-invocation: true` empêche Claude de charger la skill seul. Le flag bloque aussi son préchargement dans un subagent.

Source : [changelog Claude Code](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md).

- Une entrée récente indique que les subagents préchargent au plus 32 skills du champ `skills`, chacune une fois. Un subagent qui a l'outil Skill peut toujours appeler les autres.

### Point non couvert par la documentation

La documentation ne donne aucun exemple de nom de plugin dans le champ `skills:`. Elle ne dit pas non plus si ce champ accepte le préfixe `plugin:`. J'ai donc fait un test.

### Test réel (Claude Code 2.1.329)

Un subagent temporaire a été lancé via `claude -p --agents` avec ce champ :

```yaml
skills:
  - mattpocock-skills:tdd
  - mattpocock-skills:grill-me
  - tdd
```

Extrait du journal de debug :

```text
[WARN] [Agent: probe] Warning: Skill 'mattpocock-skills:grill-me' specified in frontmatter was not found
[DEBUG] [Agent: probe] Preloaded skill 'mattpocock-skills:tdd'
[DEBUG] [Agent: probe] Preloaded skill 'tdd'
```

Le subagent confirme avoir reçu le contenu de la skill TDD (titre « Test-Driven Development »).

Ce que le test établit :

- `mattpocock-skills:tdd` se précharge. La syntaxe `plugin:skill` fonctionne.
- `mattpocock-skills:grill-me` porte `disable-model-invocation: true`. Il est ignoré avec le message « not found ». Le message ne mentionne pas la vraie cause.
- Le nom court `tdd` a aussi résolu la skill du plugin, car aucune autre skill `tdd` n'existe ici. Le nom complet reste préférable : il ne dépend pas des skills installées sur chaque poste.
- Les deux noms ont chargé le même contenu deux fois. La règle « chacune une fois » compare les noms écrits, pas la skill résolue.

### Skills du plugin 1.3.2 qu'on ne peut pas précharger

Seize skills portent `disable-model-invocation: true` dans `mattpocock-skills` 1.3.2 : `ask-matt`, `grill-with-docs`, `implement`, `implement-spec`, `improve-codebase-architecture`, `retro`, `setup-matt-pocock-skills`, `to-spec`, `to-tickets`, `triage`, `wayfinder`, `grill-me`, `handoff`, `teach`, `to-questionnaire`, `wait-what`.

Les autres se préchargent : `tdd`, `diagnosing-bugs`, `prototype`, `research`, `domain-modeling`, `codebase-design`, `code-review`, `pr`, `wizard`, `grilling`, `writing-for-agents`.

Ce flag peut changer à chaque version du plugin. Une skill préchargée aujourd'hui peut disparaître silencieusement après une mise à jour. C'est un argument de plus pour bloquer la version (Q2).

## Q2. Bloquer la version du plugin pour le projet

### Le champ `ref` du marketplace

Source : [Marketplace reference, « Marketplace sources » et « Fields by type »](https://code.claude.com/docs/en/plugins/marketplace-reference).

- Une source de marketplace `github` accepte `repo`, `ref`, `path` et `sparsePaths`. La source `git` accepte `url`, `ref`, `path` et `sparsePaths`.
- `ref` vaut une branche, un tag, ou le SHA complet en minuscules d'un commit d'une branche ou d'un tag. Par défaut : la branche par défaut du dépôt.
- Le SHA exige Claude Code v2.1.324 ou plus récent. Les versions plus anciennes ne chargent plus un marketplace bloqué ainsi.
- La documentation recommande le SHA complet pour empêcher rafraîchissements et mises à jour automatiques de quitter un commit relu.
- `extraKnownMarketplaces` est valide dans tout fichier de settings, dont le `.claude/settings.json` du projet ([Settings reference](https://code.claude.com/docs/en/settings-reference)).

Le changelog classe l'entrée « marketplace `ref` accepte l'identifiant complet de tout commit d'une branche ou d'un tag » sous la version 2.1.325. La documentation dit v2.1.324. Retenir 2.1.325 comme minimum par prudence. Le poste local est en 2.1.329.

### Pourquoi le blocage du marketplace suffit ici

- Le `marketplace.json` de `mattpocock/skills` déclare le plugin avec `"source": "./"`. Les fichiers du plugin viennent donc du clone du marketplace.
- Une entrée de plugin avec sa propre source distante (`github`, `url`, `git-subdir`) pourrait encore se mettre à jour. La documentation conseille alors de bloquer aussi l'entrée avec `sha`. Ce cas ne s'applique pas à `mattpocock-skills`.
- Le dépôt publie des tags : `v1.3.2` pointe sur `d1478fcb140db0b93c0c8df17bcfd311844749d0` (vérifié via l'API GitHub).

Exemple pour `.claude/settings.json` :

```json
{
  "extraKnownMarketplaces": {
    "mattpocock": {
      "source": {
        "source": "github",
        "repo": "mattpocock/skills",
        "ref": "d1478fcb140db0b93c0c8df17bcfd311844749d0"
      },
      "autoUpdate": false
    }
  },
  "enabledPlugins": {
    "mattpocock-skills@mattpocock": true
  }
}
```

`"ref": "v1.3.2"` marche aussi, avec les versions plus anciennes de Claude Code. Mais un tag peut être déplacé par l'auteur du dépôt. Le SHA ne bouge pas.

### Autres mécanismes

Source : [Plugin loading reference, « Versions and updates » et « When auto-update runs »](https://code.claude.com/docs/en/plugins/loading).

- **Champ `version` du plugin.** Claude Code calcule la version ainsi : d'abord `version` dans `plugin.json`, puis `version` dans l'entrée du marketplace, sinon le SHA du commit. Le plugin 1.3.2 fixe `"version": "1.3.2"` dans son `plugin.json`. Ce champ est contrôlé par l'auteur, pas par le projet. Effet de bord : de nouveaux commits sans changement de version ne déclenchent pas de mise à jour.
- **`enabledPlugins` ne prend pas de version.** La clé est `<plugin>@<marketplace>` avec `true` ou `false`. Aucune syntaxe de version n'est documentée.
- **Mise à jour automatique.** L'ordre de décision est : `autoUpdate` sur l'entrée `extraKnownMarketplaces`, puis `autoUpdate` dans `known_marketplaces.json`, puis le défaut. Le défaut est désactivé pour tout marketplace tiers comme `mattpocock`. `DISABLE_AUTOUPDATER=1`, `DISABLE_UPDATES=1` ou `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1` coupent toute la passe, sauf avec `FORCE_AUTOUPDATE_PLUGINS=1`.
- **`autoUpdate: false` seul ne bloque rien.** Un `claude plugin update` manuel, ou un `install name@marketplace`, rafraîchit le marketplace quel que soit ce réglage. Seul `ref` fixe le contenu.

### Limites à connaître

- **Conflit avec les settings utilisateur.** Le poste déclare déjà `mattpocock` en utilisateur, sans `ref`. La documentation ne précise pas quelle source l'emporte quand deux fichiers déclarent le même nom de marketplace. Elle dit seulement qu'un changement de source en settings déclenche un nouveau téléchargement. Non vérifié : à tester avant de compter sur le blocage projet.
- **Un seul clone par utilisateur.** `known_marketplaces.json` est commun à tous les projets du poste. Bloquer `mattpocock` dans ce dépôt peut donc aussi changer la version vue dans les autres projets. Non vérifié en pratique.
- **Installation encore nécessaire.** Un plugin activé seulement dans `.claude/settings.json` ne se charge pas avant installation sur le poste (`claude plugin install mattpocock-skills@mattpocock --scope project`). Exception : un plugin en chemin relatif d'un marketplace git déjà ajouté se charge après `/reload-plugins`.
- **Confiance du dossier.** `extraKnownMarketplaces` du projet n'est lu qu'après acceptation du dialogue de confiance. Les sessions cloud hébergées par Anthropic ne l'appliquent pas.

## Récapitulatif

| Point | Statut |
|-------|--------|
| Le champ `skills` précharge le contenu complet, 32 noms au plus | Confirmé (docs) |
| Une skill avec `disable-model-invocation: true` ne se précharge pas | Confirmé (docs et test) |
| Un subagent peut appeler l'outil Skill sur une skill de plugin non listée | Confirmé (docs) |
| La syntaxe `plugin:skill` marche dans `skills:` | Confirmé par test, absent des docs |
| Une source de marketplace `github` accepte `ref` (branche, tag, SHA) | Confirmé (docs) |
| Le SHA comme `ref` exige v2.1.324 (docs) ou v2.1.325 (changelog) | Confirmé, écart de version noté |
| Bloquer le marketplace bloque `mattpocock-skills` (source `./`) | Déduit des docs et du `marketplace.json` |
| Priorité projet ou utilisateur pour un marketplace déclaré deux fois | Non vérifié |
| Effet du blocage sur les autres projets du même poste | Non vérifié |
