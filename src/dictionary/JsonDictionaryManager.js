/**
 * Classe pour gérer le dictionnaire de mots autorisés avec réponses au format JSON.
 */
export class JsonDictionaryManager {
    /**
     * Initialise le gestionnaire de dictionnaire JSON.
     *
     * @param {string[]} words - Liste des mots autorisés
     */
    constructor(words) {
        this.words = words
        this.registeredFunctions = []
    }

    /**
     * Enregistre une nouvelle fonction disponible pour le modèle.
     *
     * @param {string} name - Nom de la fonction
     * @param {string} description - Description de la fonction
     * @param {Object} parameters - Paramètres de la fonction avec leurs types et descriptions
     */
    registerFunction(name, description, parameters) {
        // Vérifier si la fonction existe déjà
        const existingIndex = this.registeredFunctions.findIndex(
            (f) => f.name === name
        )

        if (existingIndex !== -1) {
            // Mettre à jour la fonction existante
            this.registeredFunctions[existingIndex] = {
                name,
                description,
                parameters,
            }
        } else {
            // Ajouter la nouvelle fonction
            this.registeredFunctions.push({ name, description, parameters })
        }
    }

    /**
     * Génère la documentation des fonctions disponibles pour le modèle.
     *
     * @returns {string} - Documentation des fonctions au format texte
     */
    generateFunctionDocs() {
        let docs = "Fonctions disponibles:\n\n"

        this.registeredFunctions.forEach((func, index) => {
            docs += `${index + 1}. ${func.name}\n`
            docs += `   Description: ${func.description}\n`
            docs += `   Paramètres:\n`

            for (const [paramName, paramInfo] of Object.entries(
                func.parameters
            )) {
                const required = paramInfo.required
                    ? " (obligatoire)"
                    : " (optionnel)"
                docs += `   - ${paramName} (${paramInfo.type})${required}: ${paramInfo.description}\n`
            }

            docs += "\n"
        })

        return docs
    }

    /**
     * Génère des exemples de réponses pour les fonctions disponibles.
     *
     * @returns {string} - Exemples de réponses au format texte
     */
    generateExamples() {
        let examples = "Exemples de réponses correctes:\n\n"

        this.registeredFunctions.forEach((func) => {
            const example = this.generateExampleForFunction(func)
            examples += `Pour ${func.name}:\n${example}\n\n`
        })

        return examples
    }

    /**
     * Génère un exemple de réponse pour une fonction spécifique.
     *
     * @param {Object} func - Définition de la fonction
     * @returns {string} - Exemple de réponse JSON
     */
    generateExampleForFunction(func) {
        const args = {}

        for (const [paramName, paramInfo] of Object.entries(func.parameters)) {
            if (paramInfo.type === "array") {
                if (paramName === "mots") {
                    // Exemple spécifique pour le paramètre "mots"
                    args[paramName] = ["Arbre", "Forêt", "Vent", "Feuille"]
                } else {
                    args[paramName] = ["exemple1", "exemple2"]
                }
            } else if (paramInfo.type === "string") {
                args[paramName] = "exemple de texte"
            } else if (paramInfo.type === "number") {
                args[paramName] = 42
            } else if (paramInfo.type === "boolean") {
                args[paramName] = true
            } else if (paramInfo.type === "object") {
                args[paramName] = { cle: "valeur" }
            }
        }

        const example = {
            name: func.name,
            arguments: args,
        }

        return JSON.stringify(example)
    }

    /**
     * Génère le prompt système qui explique les contraintes du dictionnaire
     * et le format JSON attendu.
     *
     * @returns {string} - Le prompt système
     */
    getSystemPrompt() {
        let wordsStr = ""
        if (typeof this.words === "object" && !Array.isArray(this.words)) {
            wordsStr = Object.entries(this.words)
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
        } else if (Array.isArray(this.words)) {
            wordsStr = this.words.join(", ")
        }

        const prompt = `Tu es un assistant styliste. Ta tâche est de composer des ensembles d'habits en fonction des situations données par l'utilisateur.
Tu dois STRICTEMENT respecter les règles suivantes :
1. Tu ne peux utiliser que les informations du dictionnaire suivant :
${wordsStr}

2. Règles pour composer les ensembles :
   - **Chapeau** : Tu peux ne pas inclure de chapeau, mais tu ne dois pas en mettre plus d'un.
   - **Haut** : Tu peux ne pas inclure de haut, mais tu peux en mettre jusqu'à deux si cela est logique.
   - **Bas** : Tu dois presque toujours inclure un bas, sauf si cela est explicitement demandé de ne pas en mettre. Tu ne dois pas en mettre plus d'un.
   - **Chaussure** : Tu dois presque toujours inclure des chaussures, sauf si cela est explicitement demandé de ne pas en mettre. Tu ne dois pas en mettre plus d'une.

3. Les ensembles doivent être logiques et respecter la demande de l'utilisateur.

4. Fais attention au cumul des prix des vêtements. Essaie de rester dans une gamme de prix raisonnable en fonction de la situation donnée.

5. Pour chaque ensemble, tu dois inclure les informations suivantes :
   - **Nom de l'ensemble** : Un nom court et descriptif.
   - **Description** : Une description de l'ensemble en 3 à 5 phrases, expliquant pourquoi il est adapté.
   - **Couleur associée** : Un code hexadécimal représentant une couleur associée à l'ensemble.

6. Réponds UNIQUEMENT avec un objet JSON au format suivant :
{
  "ensemble": {
    "nom": "<Nom de l'ensemble>",
    "description": "<Courte description de l'ensemble>",
    "couleur": "<Code hexadécimal>",
    "chapeau": {
      "<Nom du chapeau>": [
        "<Marque>",
        "<Prix>",
        "<Couleur>"
      ]
    },
    "haut": {
      "<Nom du haut>": [
        "<Marque>",
        "<Prix>",
        "<Couleur>"
      ]
    },
    "bas": {
      "<Nom du bas>": [
        "<Marque>",
        "<Prix>",
        "<Couleur>"
      ]
    },
    "chaussure": {
      "<Nom de la chaussure>": [
        "<Marque>",
        "<Prix>",
        "<Couleur>"
      ]
    }
  },
  "prix_total": "<Prix total de l'ensemble>"
}

7. Ne retourne que l'objet JSON brut, sans texte supplémentaire.`

        return prompt
    }

    /**
     * Récupère la liste des mots du dictionnaire.
     *
     * @returns {string[]} - Liste des mots du dictionnaire
     */
    getWords() {
        return this.words
    }

    /**
     * Formate la liste des mots pour l'affichage.
     *
     * @returns {string} - Chaîne formatée des mots du dictionnaire
     */
    getFormattedWordList() {
        // Vérifier si `this.words` est un objet structuré
        if (typeof this.words === "object" && !Array.isArray(this.words)) {
            // Parcourir les catégories et formater les mots
            return Object.entries(this.words)
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

        // Si `this.words` est un tableau simple
        return Array.isArray(this.words) ? this.words.join(", ") : ""
    }

    /**
     * Met à jour la liste des mots du dictionnaire.
     *
     * @param {Array<string>} words - Liste des mots autorisés
     */
    setWords(words) {
        this.words = words
    }
}
