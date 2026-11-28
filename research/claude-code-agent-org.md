# Ce que Claude Code permet pour une organisation d'agents

Recherche pour le ticket Linear GTM-55 (carte GTM-54, projet "Agents factory"). État des docs officielles consultées le 28 novembre 2026.

## Question

Quelles briques de Claude Code permettent à plusieurs agents de travailler ensemble sur ce repo ? Pour chacune : ce qu'elle permet, ses limites (contexte, parallélisme, permissions, coût), et si elle tourne en local ou dans le cloud.

Le ticket sert quatre décisions : les rôles de la phase 1, le support des passages de relais entre agents, la relation avec les skills de Matt Pocock, et le moteur d'exécution des phases suivantes.

## Réponse courte

- **Phase 1 (local, un opérateur)** : des subagents versionnés dans `.claude/agents/`, isolés en worktree, plus des skills de projet dans `.claude/skills/` et des hooks dans `.claude/settings.json` comme contrôles qualité. Tout est déjà stable et partagé par git.
- **Agent teams** : utile pour explorer, mais expérimental, local seulement, et inutilisable en mode headless. À garder hors du chemin critique.
- **Passage de relais** : aucune brique ne fournit un bus de messages durable entre sessions. Le relais fiable reste un artefact : fichier commité, branche, PR, commentaire Linear.
- **Phases suivantes (déclenchement depuis Linear)** : trois moteurs possibles, l'agent cloud de Linear (Claude Code dans un sandbox Linear), les sessions cloud Claude Code, ou la GitHub Action. Ils lisent tous la config du repo. Ils ne lisent pas les plugins installés sur le poste de l'opérateur.
- **Skills de Matt Pocock** : installées aujourd'hui comme plugin utilisateur. Elles ne suivront pas en cloud ni en CI sans être commitées, ou installées par la CI (`plugins` de l'Action), ou activées sur le compte claude.ai.

## Briques une par une

### Subagents (`.claude/agents/*.md`)

Source : [Subagents](https://code.claude.com/docs/en/sub-agents).

- **Permet** : définir un rôle en Markdown avec frontmatter YAML. Champs utiles : `tools` / `disallowedTools`, `model`, `permissionMode`, `maxTurns`, `skills` (préchargées), `mcpServers`, `hooks`, `memory`, `isolation: worktree`, `background`. Le fichier de projet se commite et se partage.
- **Contexte** : chaque subagent démarre avec un contexte neuf : son prompt, le message de délégation, `CLAUDE.md`, le statut git, les skills préchargées. Seul son résumé final revient au parent. Une mémoire persistante par agent est possible (`memory: project` écrit dans `.claude/agent-memory/<nom>/`, les 200 premières lignes de `MEMORY.md` sont chargées).
- **Parallélisme** : 20 subagents actifs au plus par défaut (`CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS`). Imbrication autorisée jusqu'à une profondeur de 3 par défaut. Premier plan ou arrière-plan. Reprise possible par `SendMessage`, transcripts gardés 30 jours.
- **Permissions** : si le parent tourne en `bypassPermissions`, `acceptEdits` ou `auto`, ce mode écrase celui du subagent. Le mode plan se propage. Un rôle ne peut donc pas être plus permissif que la session, et pas forcément plus strict.
- **Coût** : même quota que la session. Le levier principal est `model: haiku` pour l'exploration.
- **Où** : local, et aussi en session cloud (les agents du repo sont chargés automatiquement, voir [Cloud](https://code.claude.com/docs/en/claude-code-on-the-web#use-subagents-and-agent-teams)).

### Agent teams

Source : [Agent teams](https://code.claude.com/docs/en/agent-teams).

- **Permet** : un lead et des coéquipiers, chacun une instance Claude Code séparée. Liste de tâches partagée (statuts, dépendances, verrou à la prise), boîte aux lettres entre coéquipiers. Les coéquipiers peuvent reprendre une définition de subagent (outils, modèle, corps). Le champ `skills` n'est pas appliqué.
- **Activation** : `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`. Fonction expérimentale.
- **Limites** : session interactive requise. En `claude -p` ou via l'Agent SDK, aucun coéquipier ne démarre. Pas de reprise des coéquipiers, une équipe par session, pas d'équipe imbriquée, lead fixe. L'état vit sous `~/.claude/teams/`, donc sur une seule machine. Les doc recommandent 3 à 5 coéquipiers et d'éviter que deux coéquipiers modifient le même fichier.
- **Permissions** : les coéquipiers démarrent avec le mode du lead, sans réglage par coéquipier. Les demandes remontent au lead.
- **Coût** : les tokens croissent linéairement avec le nombre de coéquipiers.
- **Hooks dédiés** : `TeammateIdle`, `TaskCreated`, `TaskCompleted` (code de sortie 2 pour refuser ou relancer).
- **Où** : local. Activable aussi en session cloud par variable d'environnement.

### Skills (`.claude/skills/<nom>/SKILL.md`)

Source : [Skills](https://code.claude.com/docs/en/skills).

- **Permet** : empaqueter une procédure. Seuls le nom et la description restent en contexte tant que la skill n'est pas invoquée. Frontmatter utile : `disable-model-invocation`, `allowed-tools`, `context: fork` avec `agent` (exécution dans un subagent), `model`, `hooks`, `paths`. Les commandes slash sont fusionnées dans les skills.
- **Limites** : garder `SKILL.md` sous 500 lignes. En `-p`, une skill s'invoque en écrivant `/nom` dans le prompt ([Headless](https://code.claude.com/docs/en/headless)).
- **Où** : partout, mais la source compte. Une session cloud ne lit pas `~/.claude/skills/`. Elle lit les skills du repo et celles activées sur le compte claude.ai. La GitHub Action lit les skills du repo après `actions/checkout`, et installe des plugins via les entrées `plugin_marketplaces` et `plugins` ([GitHub Actions](https://code.claude.com/docs/en/github-actions#run-a-skill)).
- **Conséquence pour Matt Pocock** : ses skills sont un plugin utilisateur sur le poste de l'opérateur. Pour qu'un agent cloud ou CI les utilise, il faut choisir : commiter les skills retenues dans `.claude/skills/`, installer le plugin dans le workflow, ou l'activer sur le compte. Les définitions de subagents peuvent les précharger via `skills:`, sauf pour les coéquipiers d'une team.

### Hooks

Source : [Hooks](https://code.claude.com/docs/en/hooks).

- **Permet** : exécuter une commande, un appel HTTP, un outil MCP, un prompt ou un agent sur un événement. Événements utiles ici : `PreToolUse` (bloquant), `PostToolUse`, `SubagentStart`, `SubagentStop`, `Stop`, `PermissionRequest`, `SessionStart`, et les trois hooks des teams.
- **Contrôle** : code de sortie 2 bloque. Un autre code non nul ne bloque pas. `onFailure: "block"` rend le hook bloquant en cas d'échec, sauf pour `Stop`, `SubagentStop`, `TaskCompleted` et `TeammateIdle`. Un matcher sur le type d'agent permet un contrôle par rôle.
- **Où** : `.claude/settings.json` (partagé), plugin, ou frontmatter d'une skill ou d'un subagent. Attention : en `claude -p --bare`, les hooks ne tournent pas ([Headless](https://code.claude.com/docs/en/headless#start-faster-with-bare-mode)). Sans `--bare`, `-p` exécute les hooks du repo sans dialogue de confiance.
- **Usage visé** : faire tourner `pnpm check` et `pnpm typecheck` en fin de tâche d'un rôle, refuser des écritures hors périmètre (par exemple `preset/` pour un rôle contenu).

### Mode headless et Agent SDK

Sources : [Headless](https://code.claude.com/docs/en/headless), [Agent SDK](https://code.claude.com/docs/en/agent-sdk/overview).

- **Permet** : `claude -p` lance une session non interactive. Sorties `json` (avec `session_id` et `total_cost_usd`) et `stream-json`. `--json-schema` force une sortie structurée. `--resume <id>` reprend une session précise. Le SDK Python et TypeScript expose la même boucle avec rappels d'autorisation.
- **Permissions** : sans mode défini, `-p` démarre en mode Manual (v2.1.302 et plus) : tout appel qui demanderait une approbation est refusé, sauf `--allowedTools`, règle `permissions.allow` ou hook `PermissionRequest`. `--permission-prompts none` convient aux exécutions sans opérateur.
- **Limites** : pas d'agent teams. `--bare` (recommandé, bientôt par défaut) saute `CLAUDE.md`, hooks, skills, subagents et plugins, sauf ceux passés en option. Les tâches d'arrière-plan sont coupées après 10 minutes d'inactivité par défaut.
- **Coût** : `--bare` exige une clé API (`ANTHROPIC_API_KEY`), donc une facturation API, et non l'abonnement.
- **Où** : n'importe quelle machine ou CI. C'est la base pour écrire un orchestrateur maison qui enchaîne des rôles.

### Sessions cloud Claude Code

Source : [Use Claude Code in the cloud](https://code.claude.com/docs/en/claude-code-on-the-web).

- **Permet** : une session Claude Code dans une VM gérée par Anthropic. Démarrage depuis le web, le mobile, l'app desktop, `claude --cloud "<tâche>"`, ou une tâche planifiée. Chaque `--cloud` crée une session indépendante, donc du parallélisme simple. `claude -p "<msg>" --cloud <id>` ajoute un message à une session existante. `--teleport` rapatrie une session en local. Auto-fix surveille une PR et corrige CI et commentaires.
- **Config lue** : `.claude/settings.json` du repo, subagents de `.claude/agents/`, skills du repo et du compte. Les agent teams s'activent par variable d'environnement.
- **Limites** : GitHub requis pour cloner et ouvrir des PR. La VM est reprise après inactivité, les commandes et subagents en cours sont perdus. Plans Pro, Max, Ultra, Team ou Enterprise, avec la politique d'organisation `allow_remote_sessions` activée.
- **Coût** : pas de facturation de la VM. Les sessions consomment le même quota que le reste de l'usage Claude, proportionnellement au nombre de sessions en parallèle.

### GitHub Action (`anthropics/claude-code-action@v1`)

Source : [GitHub Actions](https://code.claude.com/docs/en/github-actions).

- **Permet** : mode interactif (mention `@claude` dans une issue ou une PR) ou mode automatisation (entrée `prompt`, sur tout événement GitHub, cron compris). Le prompt peut invoquer une skill du repo ou d'un plugin installé.
- **Config lue** : `CLAUDE.md` et `.claude/` du repo après `actions/checkout`. Arguments CLI via `claude_args` (`--max-turns`, `--model`, `--allowedTools`).
- **Permissions** : l'auteur de l'événement doit avoir l'accès en écriture. Les bots sont refusés sauf `allowed_bots`, ce qui évite les boucles. L'app GitHub Claude demande un jeu large de permissions, une app maison peut le réduire.
- **Coût** : minutes GitHub Actions plus tokens. Clé API (facturation API) ou `CLAUDE_CODE_OAUTH_TOKEN` (abonnement de la personne qui l'a créé). Parallélisme borné par la concurrence GitHub.
- **Note** : comme les issues GitHub ne sont plus utilisées ici (le suivi est dans Linear), le mode `@claude` sur issue sert peu. Le mode PR et le mode automatisation restent pertinents.

### Délégation depuis Linear

Sources : [Assign and delegate issues](https://linear.app/docs/assigning-issues), [Linear cloud coding agent](https://linear.app/docs/linear-cloud-coding-agent), [AI credits](https://linear.app/docs/ai-credits).

- **Permet** : déléguer une issue à un agent tout en gardant un humain assigné. L'agent cloud de Linear transforme l'issue en PR brouillon avec Claude Code ou Codex, dans un sandbox Linear. Les Loops et règles de triage peuvent déléguer automatiquement. Le bouton "Open in coding tool" ouvre l'issue dans Claude Code en local avec un prompt personnalisable.
- **Config lue** : l'agent dit utiliser la configuration Claude Code existante du repo et ses fichiers de skills. Un environnement Linear par repo fournit runtimes, variables, script de préparation et consignes.
- **Limites** : un environnement par repo, un repo par environnement actif. Les secrets marqués comme tels ne sont visibles qu'à la préparation du sandbox.
- **Coût** : crédits IA Linear prépayés, tokens au tarif fournisseur plus sandbox facturé par tranches de 5 minutes. Avec une organisation Claude liée, les tokens Claude passent sur la facture Anthropic, le sandbox reste en crédits Linear. Toute personne ayant accès peut dépenser le solde partagé.
- **Où** : cloud Linear. C'est le déclencheur le plus direct pour une phase "ticket Linear vers PR".

## Tableau de synthèse

| Brique | Statut | Local | Cloud ou CI | Relais entre agents | Coût principal |
|--------|--------|-------|-------------|---------------------|----------------|
| Subagents | Stable | Oui | Oui (cloud) | Résumé au parent, mémoire par agent | Quota session |
| Agent teams | Expérimental | Oui | Session cloud seulement | Tâches et messages, sur une machine | Linéaire par coéquipier |
| Skills | Stable | Oui | Si dans le repo, le compte ou un plugin installé | Procédure partagée | Négligeable |
| Hooks | Stable | Oui | Oui, sauf `--bare` | Contrôles qualité aux transitions | Temps d'exécution |
| Headless / SDK | Stable | Oui | Oui | Sortie JSON, `--resume` | API ou quota |
| Sessions cloud | Stable | Non | Oui | Branche, PR, message `--cloud <id>` | Quota abonnement |
| GitHub Action | Stable | Non | CI | PR, commentaires | Minutes GitHub plus tokens |
| Agent Linear | Stable | Non | Sandbox Linear | Issue, PR, revue dans Linear | Crédits Linear plus tokens |

## Ce que cela implique pour la carte GTM-54

- **Rôles de la phase 1** : chaque rôle devient un fichier `.claude/agents/<rôle>.md` avec outils restreints, modèle choisi et skills préchargées. La session de l'opérateur joue l'orchestrateur. Un rôle de vérification peut s'appuyer sur un hook `SubagentStop` qui lance `pnpm check && pnpm typecheck`.
- **Passage de relais** : seul le résumé remonte au parent, et les messages des teams ne survivent pas à la machine. Il faut donc un artefact écrit à chaque transition : un fichier de plan ou de spec commité, puis la branche et la PR, avec trace dans Linear.
- **Skills Matt Pocock** : décider lesquelles deviennent des skills de projet. Sans cela, les phases cloud perdent `research`, `tdd`, `code-review` et les autres.
- **Moteur des phases suivantes** : trois options à arbitrer.
  - Agent cloud Linear : déclenchement natif depuis l'issue. Coût en crédits Linear, configuration dans Linear.
  - Sessions cloud Claude Code : config entièrement dans le repo, quota de l'abonnement. Pas de déclencheur Linear natif documenté.
  - GitHub Action ou Agent SDK : contrôle total, facturation API. Le déclencheur Linear reste à construire (webhook).

## Incertitudes

- **Skills dans l'agent Linear** : la doc Linear parle d'un fichier `skills.md` et de la "configuration Claude Code existante". Elle ne dit pas si `.claude/agents/`, `.claude/skills/` et les hooks sont tous chargés. À tester sur une issue réelle.
- **Déclenchement Linear vers session cloud Claude Code** : aucune intégration documentée trouvée côté Claude Code. Les tâches planifiées cloud ("routines") acceptent un appel API ou un événement GitHub, page non lue en détail.
- **Agent teams** : fonction expérimentale, son comportement et ses limites peuvent changer d'une version à l'autre.
- **Quota réel** : le coût d'un enchaînement de 4 ou 5 rôles sur une tâche du site n'est pas chiffré. Une mesure via `total_cost_usd` en `-p` sur une tâche type donnerait l'ordre de grandeur.

## Sources

- Subagents : https://code.claude.com/docs/en/sub-agents
- Agent teams : https://code.claude.com/docs/en/agent-teams
- Skills : https://code.claude.com/docs/en/skills
- Hooks : https://code.claude.com/docs/en/hooks
- Headless (`claude -p`) : https://code.claude.com/docs/en/headless
- Agent SDK : https://code.claude.com/docs/en/agent-sdk/overview
- Sessions cloud : https://code.claude.com/docs/en/claude-code-on-the-web
- GitHub Actions : https://code.claude.com/docs/en/github-actions
- Linear, assignation et délégation : https://linear.app/docs/assigning-issues
- Linear, agent cloud : https://linear.app/docs/linear-cloud-coding-agent
- Linear, crédits IA : https://linear.app/docs/ai-credits
