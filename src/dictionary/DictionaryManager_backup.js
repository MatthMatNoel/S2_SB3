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

        const prompt = `Tu dois répondre STRICTEMENT en utilisant UNIQUEMENT les mots du dictionnaire suivant :
${wordsStr}

Les mots du dictionnaire sont structurés de cette manière :
Nom-du-vetement_Couleur_Prix-centime
par exemple, l'élément "Pull-a-rayure_Bleu-clair-Blanc_89-90" est un pull à rayure de couleur bleu clair et blanc et il coûte 89.90.

Il y a 4 catégories de vêtement :
- Les chapeaux (chapeaux, casquettes, bob, etc.)
- Les hauts (t-shirt, chemise, polo, pull, veste, etc.)
- Les bas (pantalon, jeans, jupe, short, etc.)
- Les chaussures (basket, sandales, bottes, mocassin, etc.)

RÈGLES IMPORTANTES :
1. Tu dois OBLIGATOIREMENT composer des ensembles d'habits en utilisant MINIMUM :
   - 1 vêtement pour le haut,
   - 1 vêtement pour le bas,
   - 1 paire de chaussures.
2. Les chapeaux sont optionnels et doivent être ajoutés uniquement si cela améliore la cohérence de l'ensemble.
3. Un ensemble ne peut PAS contenir plus d'un vêtement de la même catégorie (par exemple, pas deux hauts ou deux paires de chaussures).
4. Il est plus important que l'ensemble soit cohérent plutôt que d'essayer de respecter un budget strict.
5. Si une catégorie obligatoire (haut, bas, chaussures) est manquante, l'ensemble est invalide.
6. Si tu ne peux pas respecter une contrainte spécifique (par exemple, une couleur demandée), choisis un élément qui s'accorde le mieux avec le reste de l'ensemble.
7. Réponds de manière concise, sans ponctuation entre les mots, et sans ajouter d'explications ou de commentaires.

Exemple de réponse correcte : "T-shirt_Vert_9-95 Jeans_Bleu_90-00 Baskets_Blanche_99-95"

Respecte ces règles pour chaque ensemble que tu crées.`

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
