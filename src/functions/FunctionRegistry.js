/**
 * Gestionnaire d'enregistrement des fonctions.
 * Cette classe définit toutes les fonctions disponibles pour le modèle d'IA
 * et gère leur affichage dans le terminal.
 */
export class FunctionRegistry {
    /**
     * Constructeur du registre de fonctions.
     * Initialise les fonctions disponibles et le gestionnaire de fonctions.
     *
     * @param {Object} functionHandler - Le gestionnaire de fonctions qui traitera les appels
     */
    constructor(functionHandler, minifyManager) {
        this.functions = {}
        this.functionHandler = functionHandler
        this.terminal = null
        this.minifyManager = minifyManager
        this.canvasFunctions = minifyManager.canvasManager.canvasFunctions

        // Définition des fonctions disponibles
        this.availableFunctions = {
            // reponse_dictionnaire: {
            //     handler: (args) => {
            //         // Cette fonction permet de traiter une réponse en utilisant
            //         // strictement les mots du dictionnaire
            //         const result = {
            //             success: true,
            //             message: `Réponse traitée avec ${
            //                 args.mots?.length || 0
            //             } mots du dictionnaire`,
            //         }

            //         // Afficher le résultat dans le terminal
            //         this.terminal.showInTerminal(
            //             "reponse_dictionnaire",
            //             args,
            //             result
            //         )
            //         return result
            //     },
            //     description:
            //         "Traite une réponse en utilisant strictement les mots du dictionnaire",
            //     parameters: {
            //         mots: {
            //             type: "array",
            //             description:
            //                 "Liste des mots du dictionnaire à utiliser dans la réponse",
            //             items: {
            //                 type: "string",
            //             },
            //         },
            //     },
            // },

            creer_ensemble: {
                handler: (args) => {
                    const { mots } = args

                    // Vérifier si des mots sont fournis
                    if (!mots || !Array.isArray(mots) || mots.length === 0) {
                        const errorResult = {
                            success: false,
                            message: "Aucun mot fourni pour créer l'ensemble.",
                        }
                        this.terminal.showInTerminal(
                            "creer_ensemble",
                            args,
                            errorResult
                        )
                        return errorResult
                    }

                    // Vérifier si un conteneur existe déjà et le supprimer
                    const existingContainer = document.querySelector(
                        ".ensemble-container"
                    )
                    if (existingContainer) {
                        existingContainer.remove()
                    }

                    // Créer un nouveau conteneur HTML pour l'ensemble
                    const ensembleContainer = document.createElement("div")
                    ensembleContainer.classList.add("ensemble-container")

                    // Parcourir les mots et ajouter les images correspondantes
                    mots.forEach((mot) => {
                        const imagePath = `public/images/${mot}.png`
                        const imgElement = document.createElement("img")
                        imgElement.src = imagePath
                        imgElement.alt = mot
                        imgElement.classList.add("ensemble-image")

                        // Ajouter un gestionnaire d'erreur pour les images manquantes
                        imgElement.onerror = () => {
                            console.warn(`Image non trouvée pour: ${mot}`)
                            imgElement.remove()
                        }

                        ensembleContainer.appendChild(imgElement)
                    })

                    // Ajouter le conteneur au DOM
                    const appElement = document.querySelector(".main-content")
                    if (appElement) {
                        appElement.appendChild(ensembleContainer)
                    }

                    const result = {
                        success: true,
                        message: `Ensemble créé avec ${mots.length} éléments.`,
                    }

                    // Afficher le résultat dans le terminal
                    this.terminal.showInTerminal("creer_ensemble", args, result)
                    return result
                },
                description: `Tu dois répondre STRICTEMENT en utilisant UNIQUEMENT les mots du dictionnaire.

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

Respecte ces règles pour chaque ensemble que tu crées.`,
                parameters: {
                    mots: {
                        type: "array",
                        description:
                            "Liste des mots représentant les vêtements à inclure dans l'ensemble.",
                        items: {
                            type: "string",
                        },
                    },
                },
            },

            // jouer_morceau: {
            //   handler: (args) => {
            //     // Cette fonction appelle le serveur Flask pour jouer un morceau dans iTunes
            //     const result = {
            //       pending: true,
            //       message: "Chargement du morceau en cours...",
            //     };
            //     this.terminal.showInTerminal("jouer_morceau", args, result);

            //     // Appel au serveur Flask
            //     fetch(
            //       "http://localhost:5000/api/play-track?track=" +
            //         encodeURIComponent(args.track)
            //     )
            //       .then((response) => response.json())
            //       .then((data) => {
            //         const finalResult = {
            //           success: data.success,
            //           message: data.message,
            //         };
            //         this.terminal.showInTerminal("jouer_morceau", args, finalResult);
            //         return finalResult;
            //       })
            //       .catch((error) => {
            //         const errorResult = {
            //           success: false,
            //           message: `Erreur lors du chargement du morceau: ${error.message}`,
            //         };
            //         this.terminal.showInTerminal("jouer_morceau", args, errorResult);
            //         return errorResult;
            //       });

            //     return result;
            //   },
            //   description:
            //     "Joue un morceau dans l'application iTunes sur votre Mac. Actuellement uniquement disponible ces morceaux : 'Winter Sleep (Original Mix)' ou 'Party People' ou le nom de la track demandée expressément par l'utilisateur. Ne jamais retourner un json sans nom de morceau.",
            //   parameters: {
            //     track: {
            //       type: "string",
            //       description: "Le nom du morceau à jouer. ",
            //     },
            //   },
            // },

            // dessiner_images: {
            //     handler: (args) => {
            //         this.terminal.showInTerminal(
            //             "dessiner_images",
            //             args,
            //             "dessiner dans le canvas"
            //         )
            //         console.log("args.mots", args.mots)
            //         this.minifyManager.minimize()
            //         this.canvasFunctions.clear()
            //         args.mots.forEach((mot) => {
            //             this.canvasFunctions.addImage(mot + ".png")
            //         })
            //         return "Dessiné dans le canvas"
            //     },
            //     description:
            //         "Traite une réponse en utilisant strictement les mots du dictionnaire.",
            //     parameters: {
            //         mots: {
            //             type: "array",
            //             description:
            //                 "Liste des mots du dictionnaire à utiliser dans la réponse.",
            //             items: {
            //                 type: "string",
            //             },
            //         },
            //     },
            // },

            // changer_theme: {
            //   handler: (args) => {
            //     // Cette fonction change le thème de l'application
            //     // en fonction du paramètre theme.
            //     const theme = args.theme || "theme-light";
            //     const themes = [
            //       "theme-light",
            //       "dark-theme",
            //       "blue-theme",
            //       "green-theme",
            //     ];

            //     // Map des anciens noms de thèmes vers les nouveaux
            //     const themeMap = {
            //       light: "theme-light",
            //       dark: "dark-theme",
            //       blue: "blue-theme",
            //       green: "green-theme",
            //     };

            //     // Convertir l'ancien nom de thème si nécessaire
            //     const normalizedTheme = themeMap[theme] || theme;

            //     // Vérifier si le thème est valide
            //     if (!themes.includes(normalizedTheme)) {
            //       return {
            //         success: false,
            //         message: `Thème non valide. Les thèmes disponibles sont: ${themes.join(
            //           ", "
            //         )}`,
            //       };
            //     }

            //     // Utiliser la fonction globale de changement de thème
            //     if (typeof window.changeTheme === "function") {
            //       window.changeTheme(normalizedTheme);
            //     }

            //     return {
            //       success: true,
            //       message: `Thème changé pour: ${normalizedTheme}`,
            //     };
            //   },
            //   description: "Change le thème de l'application",
            //   parameters: {
            //     theme: {
            //       type: "string",
            //       description:
            //         "Le thème à appliquer. Valeurs possibles: theme-light, dark-theme, blue-theme, green-theme",
            //     },
            //   },
            // },
        }
    }

    /**
     * Initialise le terminal pour afficher les résultats des fonctions.
     *
     * @param {Object} terminal - Le terminal à utiliser
     */
    initializeTerminal(terminal) {
        this.terminal = terminal
    }

    /**
     * Enregistre toutes les fonctions définies dans availableFunctions.
     * Cette méthode est appelée au démarrage de l'application.
     */
    registerAllFunctions() {
        // Parcourir toutes les fonctions disponibles et les enregistrer
        Object.entries(this.availableFunctions).forEach(
            ([name, funcConfig]) => {
                this.functionHandler.registerFunction(
                    name,
                    funcConfig.handler,
                    funcConfig.description,
                    funcConfig.parameters
                )
            }
        )
    }
}
