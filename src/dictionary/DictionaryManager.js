/**
 * Gestionnaire de dictionnaire de mots.
 * Cette classe gère la liste des mots autorisés pour l'application
 * et génère le prompt système pour le modèle d'IA.
 */
export class DictionaryManager {
    /**
     * Initialise le gestionnaire de dictionnaire.
     *
     * @param {Array<string>} allowedWords - Liste des mots autorisés
     */
    constructor(allowedWords = []) {
        // Liste des mots autorisés pour l'application
        this.allowedWords = allowedWords
    }

    /**
     * Génère le prompt système qui explique les contraintes du dictionnaire.
     *
     * @returns {string} - Le prompt système
     */
    getSystemPrompt() {
        let wordsStr = ""
        if (
            typeof this.allowedWords === "object" &&
            !Array.isArray(this.allowedWords)
        ) {
            // Parcourir les catégories et formater les mots
            wordsStr = Object.entries(this.allowedWords)
                .map(([category, items]) => {
                    const formattedItems = items
                        .map(
                            (item) =>
                                `${item.nom} (${item.marque}, ${item.prix}, ${item.couleur})`
                        )
                        .join(", ")
                    return `${category}: ${formattedItems}`
                })
                .join("\n")
        } else if (Array.isArray(this.allowedWords)) {
            // Si `allowedWords` est un tableau simple
            wordsStr = this.allowedWords.join(", ")
        }

        const prompt = `Tu es un assistant utile. Tu dois répondre en utilisant le format JSON suivant :
{
  "name": "reponse_dictionnaire",
  "arguments": {
    "chapeau": {
      "<Nom de l'article>": [
        "<Marque>",
        "<Prix>",
        "<Couleur>"
      ]
    },
    "haut": {
      "<Nom de l'article>": [
        "<Marque>",
        "<Prix>",
        "<Couleur>"
      ]
    },
    "bas": {
      "<Nom de l'article>": [
        "<Marque>",
        "<Prix>",
        "<Couleur>"
      ]
    },
    "chaussure": {
      "<Nom de l'article>": [
        "<Marque>",
        "<Prix>",
        "<Couleur>"
      ]
    }
  }
}

## Contraintes strictes
- Chaque segment doit être cohérent, lié par un même thème, et refléter un aspect distinct de ta réponse.
- Tous les segments réunis doivent couvrir l’ensemble de ta réponse.
- Tu dois TOUJOURS renvoyer un objet JSON complet : fonction + segments.
- N’ajoute **aucun texte autour du JSON** (pas de phrases, pas de markdown, pas de \`\`\`, pas de commentaires).
- Les champs doivent respecter exactement la casse, la structure et les types indiqués.
- Si une image est fournie, tu peux t'en servir pour produire une réponse structurée et choisir la fonction la plus pertinente.

## Exemple
{
  "ensemble": {
    "nom": "Élégance estivale",
    "description": "Un ensemble léger et confortable, parfait pour une journée d'été.",
    "couleur": "#FFD700",
    "chapeau": {
      "Chapeau de paille": [
        "H&M",
        "14.99",
        "Beige"
      ]
    },
    "haut": {
      "T-shirt Regular Fit": [
        "H&M",
        "9.95",
        "Blanc"
      ]
    },
    "bas": {
      "Pantalon en denim baggy": [
        "Vans",
        "90.00",
        "Bleu"
      ]
    },
    "chaussure": {
      "Sandales en cuir": [
        "Birkenstock",
        "89.95",
        "Marron"
      ]
    }
  },
  "prix_total": "204.89"
}

## Dictionnaire des mots autorisés :
${wordsStr}`

        return prompt
    }

    /**
     * Récupère la liste des mots du dictionnaire.
     *
     * @returns {Array<string>} - Liste des mots du dictionnaire
     */
    getWords() {
        return [...this.allowedWords] // Retourne une copie de la liste
    }

    /**
     * Formate la liste des mots pour l'affichage.
     * Les mots sont séparés par des virgules.
     *
     * @returns {string} - Chaîne formatée des mots du dictionnaire
     */
    getFormattedWordList() {
        // Vérifier si `this.allowedWords` est un objet structuré
        if (
            typeof this.allowedWords === "object" &&
            !Array.isArray(this.allowedWords)
        ) {
            // Parcourir les catégories et formater les mots
            return Object.entries(this.allowedWords)
                .map(([category, items]) => {
                    const formattedItems = items
                        .map(
                            (item) =>
                                `${item.nom} (${item.marque}, ${item.prix}, ${item.couleur})`
                        )
                        .join(", ")
                    return `${category}: ${formattedItems}`
                })
                .join("\n")
        }

        // Si `this.allowedWords` est un tableau simple
        return Array.isArray(this.allowedWords)
            ? this.allowedWords.join(", ")
            : ""
    }

    /**
     * Met à jour la liste des mots du dictionnaire.
     *
     * @param {Array<string>} words - Liste des mots autorisés
     */
    setWords(words) {
        this.allowedWords = words
    }
}
