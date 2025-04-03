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
                    const { haut, bas, chaussures, chapeaux, couleur } = args

                    // Vérifier si une couleur valide est fournie
                    if (couleur && /^#[0-9A-F]{6}$/i.test(couleur)) {
                        // Modifier la variable CSS --color-background
                        document.documentElement.style.setProperty(
                            "--color-background",
                            couleur
                        )
                    } else {
                        console.warn(
                            "Couleur invalide ou non fournie. La couleur de fond ne sera pas modifiée."
                        )
                    }

                    // Convertir les paramètres string en tableaux
                    const parseItems = (items) =>
                        items ? items.split(",").map((item) => item.trim()) : []

                    const hautArray = parseItems(haut)
                    const basArray = parseItems(bas)
                    const chaussuresArray = parseItems(chaussures)
                    const chapeauxArray = parseItems(chapeaux)

                    // Vérifier si au moins une catégorie est fournie
                    if (
                        hautArray.length === 0 &&
                        basArray.length === 0 &&
                        chaussuresArray.length === 0 &&
                        chapeauxArray.length === 0
                    ) {
                        const errorResult = {
                            success: false,
                            message:
                                "Aucun élément fourni pour créer l'ensemble.",
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

                    // Fonction pour transformer un item en nom de fichier d'image
                    const transformItemToImageName = (item) => {
                        return (
                            item
                                .replace(/\s+/g, "_") // Remplace les espaces par des underscores
                                .replace(/-/g, "_") + // Remplace les tirets par des underscores
                            ".png"
                        ) // Ajoute l'extension .png
                    }

                    // Fonction pour ajouter des images d'une catégorie
                    const addImages = (items, category) => {
                        items.forEach((item) => {
                            const imageName = transformItemToImageName(item)
                            const imagePath = `public/images/${imageName}`

                            // Créer un conteneur pour l'image
                            const imageContainer = document.createElement("div")
                            imageContainer.classList.add(
                                "ensemble-image-container"
                            )

                            const imgElement = document.createElement("img")
                            imgElement.src = imagePath
                            imgElement.alt = `${category}: ${item}`
                            imgElement.classList.add("ensemble-image")

                            // Ajouter un gestionnaire d'erreur pour les images manquantes
                            imgElement.onerror = () => {
                                console.warn(
                                    `Image non trouvée pour: ${imageName}`
                                )
                                imgElement.remove()
                            }

                            // Ajouter l'image au conteneur
                            imageContainer.appendChild(imgElement)

                            // Ajouter le conteneur au conteneur principal
                            ensembleContainer.appendChild(imageContainer)
                        })
                    }

                    // Ajouter les images pour chaque catégorie
                    if (basArray.length > 0) addImages(basArray, "bas")
                    if (hautArray.length > 0) addImages(hautArray, "haut")
                    if (chaussuresArray.length > 0)
                        addImages(chaussuresArray, "chaussures")
                    if (chapeauxArray.length > 0)
                        addImages(chapeauxArray, "chapeaux")

                    // Ajouter le conteneur au DOM
                    const appElement = document.querySelector(".main-content")
                    if (appElement) {
                        appElement.appendChild(ensembleContainer)
                    }

                    const result = {
                        success: true,
                        message: `Ensemble créé avec succès.`,
                    }

                    // Afficher le résultat dans le terminal
                    this.terminal.showInTerminal("creer_ensemble", args, result)
                    return result
                },
                description: `
Tu dois répondre STRICTEMENT en utilisant UNIQUEMENT les mots du dictionnaire
Les mots du dictionnaire ont à la fin leur prix en $
Utilise ces prix pour créer des ensemble qui corresonde au budget si il est précisé

Tu crée un ensemble de vêtement cohérent en respectant les demandes faites.

Il y a 4 type de vêtement :
- bas
- haut
- chaussures
- chapeaux

Il ne peut pas y avoir 2 élément du même type dans un ensemble

pour chaque ensemble, j'ai aussi envie que tu me donne une couleurs en hex qui va avec les vêtement que tu à choisi et qui pourrait être mis en fond

pour chaque ensemble, calcule le prix total

pour chaque ensemble, donne lui un nom en maximum 2 mots
`,
                parameters: {
                    bas: {
                        type: "string",
                        description: "le bas choisi pour l'ensemble",
                    },
                    haut: {
                        type: "string",
                        description: "le haut choisi pour l'ensemble",
                    },
                    chaussures: {
                        type: "string",
                        description:
                            "la paire de chaussures choisi pour l'ensemble",
                    },
                    chapeaux: {
                        type: "string",
                        description: "le chapeaux choisi pour l'ensemble",
                    },
                    couleur: {
                        type: "string",
                        description: "une couleur de fond en hex",
                    },
                    prix: {
                        type: "string",
                        description: "le prix total de l'ensemble",
                    },
                    nom: {
                        type: "string",
                        description: "le nom de l'ensemble",
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
