# MCP Carousel Engine v3.3

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![MCP Specification](https://img.shields.io/badge/MCP-3.3-blue)](https://modelcontextprotocol.io)
[![Format](https://img.shields.io/badge/Ratio-4%3A5%20Vertical%20(1080x1350)-orange)](https://github.com)
[![Renderer](https://img.shields.io/badge/Renderer-Chromium%20Headless%20Automated-purple)](https://pptr.dev)
[![Export](https://img.shields.io/badge/Export-PNG%202x%20Retina%20%2B%20PDF%20LinkedIn-red)](https://github.com)

**The Sovereign Multi-Archetype Model Context Protocol (MCP) Server for High-End 4:5 Vertical Social Carousels.**  
*Designed and engineered by Said KOMI (Ingénieur Réseaux et Système).*

[Aperçu Visuel](#-aperçu-visuel--showcase) •
[Presets de Thèmes](#-presets-de-thèmes-métiers) •
[Modes Visuels](#-modes-visuels-hybrid--dark--light) •
[Micro-Charts Vectoriels](#-micro-graphiques-vectoriels-svg) •
[Les Patterns de Mise en Page](#-les-patterns-de-mise-en-page) •
[Installation](#-installation--configuration) •
[Outils MCP](#-outils-mcp-exposés)

</div>

---

## [▸] Quoi de neuf dans la Version 3.3 ?

1. **3 Modes Visuels (`themeMode`) :**
   - **`hybrid`** *(Signature Said KOMI)* : Fond noir absolu `#000000` + Carte flottante blanche `#FFFFFF` + Sphères 3D + Badges néon.
   - **`dark`** *(Full Dark Terminal)* : Fond noir `#000000` + Carte centrale graphite `#111113` + Typographie blanche pure & zinc `#A1A1AA` + Accents luminescents.
   - **`light`** *(Paper Light Editorial)* : Toile ivoire chaude `#F6F5F0` + Carte centrale blanche `#FFFFFF` + Typographie encre sombre `#0A0A0A`.

2. **5 Presets de Thèmes Métiers & Détection Automatique Intelligente (`preset`) :**
   - **`cloud-devops`** : Orange AWS (`#FF9900`) & Émeraude (`#10B981`) — Standard d'autorité pour Cloud Architects & Leads DevOps.
   - **`cybersecurity`** : Vert Matrice Terminal (`#10B981`) & Cyan Laser (`#00F0FF`) — Dédié aux RSSI, pentesters et analystes SOC.
   - **`fintech-systems`** : Bleu International Klein (`#0052FF`) & Cyan Électrique (`#06B6D4`) — Systèmes transactionnels, Core Banking et APIs haute vélocité.
   - **`ai-deeptech`** : Violet Quantique (`#8B5CF6`) & Cyan Cyber (`#06B6D4`) — LLMs, RAG, inférence et architectures d'IA.
   - **`monochrome-swiss`** : Encre Pure (`#0A0A0A`) & Zinc Architectural (`#71717A`) — Minimalisme brutaliste, code craftsmanship et manifestes.
   *(Inférence automatique par analyse pondérée des mots-clés du sujet si le preset est omis !)*

3. **Micro-Graphiques Vectoriels Purs SVG Mathématiques (`chart`) :**
   - `area-sparkline` (Courbe de Bézier cubique Catmull-Rom avec ligne de seuil SLA et aire remplie)
   - `bento-bars` (Barres horizontales de benchmark contrastées avec badges delta et mise en valeur)
   - `radial-gauge` (Jauge circulaire de jauge/score avec grand pourcentage central et sous-titre)
   - `pipeline-flow` (Topologie de nœuds horizontaux avec badges de latence et connecteurs vectoriels)

4. **Export PDF LinkedIn Natif Multipages :** Compilation automatique d'un fichier `linkedin_carousel.pdf` optimisé au ratio 1080x1350 à chaque génération.

---

## [▸] Les 4 Archétypes de Design

| Archétype | ADN Visuel | Cas d'Usage Idéaux |
| :--- | :--- | :--- |
| **`neo-geometric-dark`** | Fond noir absolu `#000000`, sphères volumétriques 3D, carte centrale blanche à fort contraste, capsules dégradées. | Architecture Cloud, Systèmes Distribués, Santé Digitale. |
| **`paper-light-editorial`** | Fond papier ivoire chaud `#F7F5F0`, typographie encre de presse, filet bordeaux `#C8102E`, texture procédurale sans 3D. | Rapports Annuels, Conjoncture, Intelligence Économique, Mémos. |
| **`swiss-editorial-clean`** | Fond papier ivoire chaud `#F6F5F0`, typographie asymétrique monumentale (poids 900), accents Bleu Klein `#002FA7`. | Fintech, Core Banking, Mémos Stratégiques, Leadership. |
| **`cyber-glass-bento`** | Fond nuit cyber `#060911`, compartiments Bento translucides (`backdrop-filter: blur`), bordures laser cyan `#00F0FF`. | Cybersécurité, SOC, Télémétrie, Zero-Trust, Protocoles Réseau. |

---

## [▸] Les 6 Patterns de Mise en Page

| Pattern | Rôle Visuel | Champs Déclencheurs |
| :--- | :--- | :--- |
| `stat-highlight` | Métrique monumentale au centre avec adaptation typographique anti-débordement. | `statValue`, `statLabel`, `statSubtext` |
| `comparison-versus` | Comparaison split 2 colonnes : Mauvaise pratique vs Standard recommandé. | `versus: { badTitle, badPoints, goodTitle, goodPoints }` |
| `flow-pipeline` | Étapes séquentielles numérotées reliées par connecteur vertical. | `steps: [{ title, desc }]` |
| `code-terminal` | Terminal développeur avec en-tête macOS et code pré-formaté. | `codeSnippet`, `codeFilename` |
| `manifesto-quote` | Citation d'autorité avec grand guillemet esthétique et signature auteur. | `quote`, `quoteAuthor` |
| `classic-card` | Carte maîtresse avec titre bicolore bold/thin, description et tirets d'accent. | `bulletPoints`, `features` |

---

## [▸] Les 5 Règles d'Or du Système

| N° | Règle | Spécification Technique | Rationale |
| :---: | :--- | :--- | :--- |
| **01** | **Ratio 4:5 Vertical Strict** | Canvas fixé à **$1080\text{ px} \times 1350\text{ px}$** avec `overflow: hidden` et `box-sizing: border-box`. | Format d'engagement maximal sur mobile (LinkedIn, Instagram, Facebook). |
| **02** | **Zéro Émoji (Strict Policy)** | Interdiction totale des émojis. Utilisation exclusive de glyphes (`::`, `//`, `[+]`, `[✓]`, `->`). | Confère un look d'ingénierie moderne, sobre et hautement professionnel. |
| **03** | **Éclairage 3D & Contraste Harmonique** | Dégradés radiaux multi-points avec halos diffus ou verre dépoli spatial. | Crée une illusion de profondeur tridimensionnelle sans moteur 3D lourd. |
| **04** | **Cadrage Zéro Coupure de l'Avatar** | Ancrage optique calibré (`object-position: center 8%`) dans un médaillon à double anneau dégradé. | Garantit que le visage et les cheveux de l'auteur ne sont jamais tronqués. |
| **05** | **Rendu Headless Chromium Autonome** | Capture native via Chromium Headless à échelle 2x Retina. | Fichiers PNG vectoriels d'une netteté cristalline, 100% automatisés. |

---

## [▸] Modèle Freemium & Licence Pro

Ce serveur MCP adopte une architecture **Freemium Virale & White-Label Pro** :

| Fonctionnalité | Version Gratuite (Community) | Version Pro (White-Label) |
| :--- | :---: | :---: |
| **Accès aux 5 Presets Métiers** | ✓ Inclus | ✓ Inclus |
| **Micro-Graphiques Vectoriels SVG** | ✓ Inclus | ✓ Inclus |
| **Export PNG 2x Retina & PDF LinkedIn** | ✓ Inclus | ✓ Inclus |
| **Watermark discret d'attribution** | `// STUDIO CAROUSEL SAID KOMI :: PRO` | **Zéro Watermark (100% White-Label)** |
| **Branding Entreprise Personnalisé** | Standard | **Accès prioritaire & Logos custom** |
| **Obtention de Licence** | Gratuit à vie | **Disponible sur [polar.sh/saidkomi](https://polar.sh/saidkomi)** |

### Activation de la Clé Pro :
Soit par variable d'environnement dans votre client MCP :
```json
"env": {
  "CAROUSEL_LICENSE_KEY": "votre-clé-pro-polar-sh"
}
```
Soit directement lors de l'appel de l'outil `render_carousel_project` avec le paramètre `licenseKey: "votre-clé"`.

---

## [▸] Installation & Déploiement

### Option A : Installation en 1 Clic via Smithery (Recommandé)

```bash
npx -y @smithery/cli install mcp-carousel-engine --client claude
```

### Option B : Exécution Directe sans cloner (via NPX)

```json
{
  "mcpServers": {
    "carousel-engine": {
      "command": "npx",
      "args": ["-y", "mcp-carousel-engine"],
      "env": {
        "CAROUSEL_LICENSE_KEY": ""
      }
    }
  }
}
```

### Option C : Installation Locale depuis les sources

```bash
git clone https://github.com/saidkomi/mcp-carousel-engine.git
cd mcp-carousel-engine
npm install
npm run build
```
Configuration locale :
```json
{
  "mcpServers": {
    "carousel-engine": {
      "command": "node",
      "args": ["c:/VEILLE TECHNOLOGIQUE/laboratoires/agentic-google/mcp-carousel-engine/dist/index.js"]
    }
  }
}
```

---

## [▸] Outils et Prompts MCP Exposés

### 1. `render_carousel_project`
Compile le projet complet (slides vectorielles, micro-graphiques mathématiques SVG, orbes 3D), pilote Chromium Headless en tâche de fond, génère les PNGs $1080 \times 1350$ Retina 2x, assemble le PDF multipages natif LinkedIn (`linkedin_carousel.pdf`) et crée la galerie interactive `index.html`.

### 2. `list_theme_presets`
Retourne les 5 presets métiers calibrés (`cloud-devops`, `cybersecurity`, `fintech-systems`, `ai-deeptech`, `monochrome-swiss`) et les spécifications des 3 modes visuels (`hybrid`, `dark`, `light`).

### 3. `get_design_rules`
Retourne les règles typographiques, la Formule Souveraine Hybride, le ratio strict (1080x1350) et la politique zéro-émoji.

### 4. `list_creative_archetypes`
Catalogue des archétypes de mise en page avec recommandations de palettes et structures.

### 5. `match_design_dna`
Prend `{ topic, industry, tone }` et déduit automatiquement le profil de Design DNA le plus adapté (palette, grille, tokens).

### 6. `list_design_primitives`
Liste les primitives de mise en page réutilisables (grille, orbes 3D, badges suspendus, etc.).

### Prompt MCP : `compose_technical_carousel`
Blueprint interactif guidant les modèles d'IA pour structurer en 5 slides percutantes un sujet technique complexe pour Said KOMI avant de déclencher le rendu.

---

## [▸] Exemple de Prompt pour votre Agent IA

> *"Crée un carrousel de 5 slides sur l'Architecture Zero Trust avec le serveur MCP carousel-engine. Auteur Said KOMI (Ingénieur Réseaux & Système)."*

L'agent va :
1. Consulter `match_design_dna` pour sélectionner l'ADN `dna-cyber-defense`.
2. Structurer le scénario technique en 5 slides percutantes.
3. Appeler `render_carousel_project`.
4. Livrer directement les 5 images PNG prêtes à être publiées sur LinkedIn.

---

## [▸] Auteur & Licence

* **Concepteur & Architecte :** **Said KOMI**  
* **Rôle :** Ingénieur Réseaux et Système  
* **Licence :** [MIT License](./LICENSE)
