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
                    const {
                        haut,
                        bas,
                        chaussures,
                        chapeaux,
                        couleur,
                        nom,
                        prix,
                        description,
                    } = args

                    // Vérifier si une couleur valide est fournie
                    if (couleur && /^#[0-9A-F]{6}$/i.test(couleur)) {
                        // Modifier la variable CSS --color-background
                        document.documentElement.style.setProperty(
                            "--color-background",
                            couleur
                        )

                        // Vérifier si la couleur est claire ou foncée
                        const isLight = this.isColorLight(couleur)

                        // Appliquer le thème correspondant
                        document.body.classList.remove(
                            "light-theme",
                            "dark-theme"
                        )
                        document.body.classList.add(
                            isLight ? "light-theme" : "dark-theme"
                        )
                    } else {
                        console.warn(
                            "Couleur invalide ou non fournie. La couleur de fond ne sera pas modifiée."
                        )
                    }

                    // Mettre le nom de l'ensemble
                    const ensembleNomElement =
                        document.querySelector(".ensemble-nom")
                    if (ensembleNomElement) {
                        ensembleNomElement.textContent =
                            nom || "Nom de l'ensemble non défini"
                    }

                    // Mettre le prix de l'ensemble
                    const ensemblePrixElement =
                        document.querySelector(".ensemble-prix")
                    if (ensemblePrixElement) {
                        ensemblePrixElement.textContent =
                            prix || "Prix de l'ensemble non défini"
                    }

                    // Mettre la description de l'ensemble
                    const ensembleDescriptionElement = document.querySelector(
                        ".ensemble-description"
                    )
                    if (ensembleDescriptionElement) {
                        ensembleDescriptionElement.textContent =
                            description ||
                            "Description de l'ensemble non défini"
                    }

                    // Fonction pour extraire le prix d'un élément
                    const extractPrice = (item) => {
                        const match = item.match(/\d+\$/)
                        return match ? match[0] : "0$"
                    }

                    // Mettre à jour les prix individuels
                    const updatePriceElement = (selector, items) => {
                        const element = document.querySelector(selector)
                        if (element) {
                            const totalPrice = items
                                .map(extractPrice)
                                .reduce(
                                    (sum, price) =>
                                        sum + parseInt(price.replace("$", "")),
                                    0
                                )
                            element.textContent = `${totalPrice}$`
                        }
                    }

                    // Convertir les paramètres string en tableaux
                    const parseItems = (items) =>
                        items ? items.split(",").map((item) => item.trim()) : []

                    const hautArray = parseItems(haut)
                    const basArray = parseItems(bas)
                    const chaussuresArray = parseItems(chaussures)
                    const chapeauxArray = parseItems(chapeaux)

                    // Mettre à jour les prix individuels dans le DOM
                    updatePriceElement(".prix-haut", hautArray)
                    updatePriceElement(".prix-bas", basArray)
                    updatePriceElement(".prix-chaussures", chaussuresArray)
                    updatePriceElement(".prix-chapeau", chapeauxArray)

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

Tu crée un ensemble de vêtement cohérent en respectant les demandes faites.
Prends en compte le prix des vêtement quand on te donne le contexte

pour chaque ensemble, j'ai aussi envie que tu me donne une couleurs en hex qui va avec les vêtement que tu à choisi et qui pourrait être mis en fond
pour chaque ensemble, calcule le prix total.
pour chaque ensemble, donne lui un nom en maximum 2 mots.
pour chaque ensemble, écrit moi une courte description en quelques phrases de l'ensemble dans sa globalité qui vente les mérite de cet ensemble en mettant en avant les qualité de l'ensemble.
dans cette description, tu n'as pas besoin de décrire chaque élément de l'ensemble. 
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
                    description: {
                        type: "string",
                        description: "la description de l'ensemble",
                    },
                },
            },
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
     * Vérifie si une couleur hexadécimale est claire ou foncée.
     *
     * @param {string} hexColor - La couleur en format hexadécimal (ex: "#FFFFFF").
     * @returns {boolean} - Retourne true si la couleur est claire, false si elle est foncée.
     */
    isColorLight(hexColor) {
        // Vérifier si le format est valide
        if (!/^#[0-9A-F]{6}$/i.test(hexColor)) {
            console.warn("Couleur invalide:", hexColor)
            return false // Considérer comme foncée par défaut
        }

        // Convertir la couleur hexadécimale en composantes RGB
        const r = parseInt(hexColor.slice(1, 3), 16)
        const g = parseInt(hexColor.slice(3, 5), 16)
        const b = parseInt(hexColor.slice(5, 7), 16)

        // Calculer la luminance relative
        const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b

        // Retourner true si la luminance est supérieure à 128 (clair), sinon false (foncé)
        return luminance > 128
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
