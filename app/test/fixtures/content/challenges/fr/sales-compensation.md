---
key: sc
order: 4
name: Sales Compensation
tagline: Une rémunération variable qui tire dans le bon sens
hero:
  title:
    - Une rémunération variable
    - qui tire dans le bon sens.
  quote: Mes commerciaux optimisent leur commission, pas mon chiffre.
  lead: "Votre plan de commissionnement est le document que vos commerciaux lisent le plus attentivement. S'il contredit votre stratégie, c'est lui qui l'emporte. Nous concevons, modélisons, outillons et pilotons"
  highlight: une rémunération variable alignée sur ce que vous voulez vraiment vendre.
  cta: Revoir mon plan de rémunération variable
bowtie:
  activeStages:
    - negotiation
    - closing
    - expansion
  caption: "Là où le plan oriente les comportements : le choix des deals, la signature, le développement des comptes."
symptoms:
  title:
    - Un plan qui coûte cher et se calcule à la main.
    - Et qui récompense les mauvais deals.
  items:
    - Les commissions se calculent dans un tableur, chaque mois, avec des erreurs et des contestations.
    - Le plan récompense le volume signé, quand vous avez besoin de marge, de récurrence ou de nouveaux clients.
    - Vos commerciaux ne savent pas ce qu'ils vont toucher avant la fin du mois.
    - Le plan change chaque année sans que personne n'ait mesuré l'effet du précédent.
    - Le coût du variable progresse plus vite que votre chiffre, sans que vous sachiez pourquoi.
audience:
  - team: Ventes
    roles: Directeur commercial, CRO
    benefit: Des plans qui orientent les efforts vers les deals que veut l'entreprise.
  - team: Finance
    roles: CFO, DAF
    benefit: Un coût du variable modélisé et maîtrisé, sans calcul manuel.
  - team: RH
    roles: DRH, People
    benefit: Des plans lisibles, équitables et faciles à expliquer à l'embauche.
  - team: Terrain
    roles: Commerciaux et CSM
    benefit: Savoir ce qu'on gagne, et pourquoi, sans attendre la fin du mois.
workstreams:
  intro: De la stratégie au bulletin de paie, sans ressaisie.
  items:
    - category: Alignement
      step: 1
      title: Un plan qui découle de votre stratégie
      description: Objectifs par rôle, part fixe et variable, accélérateurs, traitement de la marge, des nouveaux clients et des renouvellements.
      deliverable: Plans de rémunération variable par rôle, validés par la direction.
    - category: KPIs et pilotage
      step: 2
      title: Un coût modélisé avant d'être payé
      description: Simulation du plan sur votre historique de ventes, scénarios de dépassement, coût de vente rapporté au chiffre.
      deliverable: Un modèle financier du plan, partagé avec votre direction financière.
    - category: Processus et techno
      step: 3
      title: Des commissions calculées automatiquement
      description: Données de vente prises dans le CRM, règles paramétrées dans un outil de commissionnement, export vers la paie.
      deliverable: Un calcul automatisé, du deal signé à la paie.
    - category: Enablement
      step: 4
      title: Un plan que chaque commercial comprend
      description: Présentation du plan aux équipes, simulateur individuel, suivi de ses gains en temps réel.
      deliverable: Supports de lancement et visibilité en continu pour chaque commercial.
    - category: Gouvernance
      step: 5
      title: Un plan qui s'ajuste sur des faits
      description: Mesure de l'effet du plan sur les comportements, traitement des cas particuliers, revue annuelle avec vos RH.
      deliverable: Un rituel de revue et des règles de gestion des exceptions.
partner:
  tool: qobra
  sentence: "Qobra automatise le calcul. Ocobo conçoit le plan qu'il calcule, et s'assure qu'il produit les comportements attendus."
  metrics:
    - before: 7 jours
      after: "1"
      label: "Clôture mensuelle des commissions chez Doctolib (source : Qobra)"
    - before: 3 jours
      after: ½
      label: "Clôture mensuelle des commissions chez Pennylane (source : Qobra)"
  source: Chiffres publiés par Qobra sur ses clients.
aiBridge:
  title: Chaque commercial sait ce que lui rapporte le deal sur lequel il travaille.
  bullets:
    - Le commercial pose sa question en français et obtient le détail de sa commission.
    - Les scénarios de plan se simulent en quelques minutes, sur vos vraies données.
    - Les anomalies de calcul sont repérées avant la paie.
  demo:
    channel: Assistant variable
    agent: Assistant variable
    time: "10:18"
    opening:
      kind: question
      text: Combien me rapporte le deal Brightlane ?
    elements:
      - type: figure
        value: 3 840 €
        caption: de commission si signé ce mois-ci
      - type: status
        label: Taux de base
        value: 8 % × 48 k€
        state: ok
      - type: status
        label: Accélérateur
        value: Palier 110 % atteint
        state: ok
      - type: status
        label: Contrôle
        value: 1 deal compté deux fois
        state: alert
    footer: Calcul vérifié avant la paie
method:
  subtitle: De l'analyse du plan actuel à un variable qui se pilote seul.
  steps:
    - text: Le Design Sprint analyse votre plan actuel, son coût et les comportements qu'il produit vraiment.
    - text: La squad conçoit et outille le plan avec votre direction commerciale, votre direction financière et vos RH.
    - text: Le calcul tourne seul, et vos équipes ajustent le plan chaque année sur des faits.
  tools:
    - qobra
    - hubspot
    - salesforce
  note: Et votre outil de paie. Nous partons de votre stack.
case:
  headline: "[Nom du client] : [le passage en une phrase]."
  summary: "[Contexte en deux lignes. Ce qu'on a construit. Ce qui a changé pour la direction et les équipes.]"
  metrics:
    - value: "[X]"
      label: "[Temps de calcul mensuel des commissions, avant et après]"
    - value: "[X]"
      label: "[Évolution du comportement visé : marge, récurrence ou nouveaux clients]"
diagnostic:
  question: Votre plan récompense-t-il ce que vous voulez vraiment vendre ?
  subtitle: Trente minutes avec un architecte du revenu pour le vérifier, et savoir par où commencer.
---
