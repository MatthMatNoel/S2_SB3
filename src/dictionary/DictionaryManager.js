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
        // Construire le prompt avec les instructions et la liste des mots
        const wordsStr = this.allowedWords.join(", ")

        const prompt = `Tu dois répondre STRICTEMENT en utilisant UNIQUEMENT les mots du dictionnaire suivant:
${wordsStr}
Tu dois répondre en créant des ensembles d'habits cohérent suivant la question

Les mots du dictionnaire sont structurés de cette manière :
Nom-du-vetement_Couleur_Prix-centime
par exemple, l'élément "Pull-a-rayure_Bleu-clair-Blanc_89-90" est un pull à rayure de couleur bleu clair et blanc et il coute 89.90

Il y a 4 catégories de vêtement :
- Les chapeaux (chapeaux, casquettes, bob, etc.)
- Les hauts (t-shirt, chemise, polo, pull, veste, etc.)
- Les bas (pantalon, jeans, jupe, short, etc.)
- les chaussures (basket, sandales, bottes, mocassin, etc.)

RÈGLES IMPORTANTES:
- Tu ne peux utiliser QUE les mots de ce dictionnaire, sans AUCUNE exception.
- Tu dois choisir les mots qui répondent le plus précisément à la question.
- N'utilise pas de ponctuation entre les mots.
- N'ajoute pas d'explications ou de commentaires.
- Réponds de manière concise.
- Il est plus important que l'ensembles soit cohérents plutôt que d'essayer de rentrer dans le budget
- Il est plus important d'avoir un vêtement par catégorie que de d'être adapté à la situation donnée
- Tu dois créer des ensembles de vêtements cohérents :
  - Un ensemble est constitué au MINIMUM d'un vêtement pour le bas, un vêtement pour le haut et une paire de chaussure.
  - Un ensemble ne peut PAS contenir plus d'un vêtement de la même catégorie (par exemple, pas deux paires de chaussures ou deux chapeaux).

Exemple de réponse correcte: "T-shirt_Blanc_9-95 Jeans-baggy_Bleu_90-00 Baskets-Blanches_99-95"`

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
        return this.allowedWords.join(", ")
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
