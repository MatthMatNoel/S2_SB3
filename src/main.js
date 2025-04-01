/**
 * Point d'entrée principal de l'application.
 * Ce fichier initialise tous les composants et démarre l'application.
 */
import "./styles/style.css"
import "./styles/dragDrop.css"
import "./styles/mediaInput.css"
import { ChatInterface } from "./ui/ChatInterface.js"
import { FunctionCallHandler } from "./functions/FunctionCallHandler.js"
import { FunctionRegistry } from "./functions/FunctionRegistry.js"
import { JsonDictionaryManager } from "./dictionary/JsonDictionaryManager.js"
import { DictionaryManager } from "./dictionary/DictionaryManager.js"
import { LMStudioClient } from "./api/LMStudioClient.js"
import { MinifyManager } from "./minify/MinifyManager.js"
import { TerminalInterface } from "./ui/TerminalInterface.js"
import { ThemeSelector } from "./ui/ThemeSelector.js"
import { ModeSelector } from "./ui/ModeSelector.js"
import { DragAndDropManager } from "./ui/DragAndDropManager.js"
import { CanvasManager } from "./canvas/CanvasManager.js"

// Attendre que le DOM soit complètement chargé avant d'initialiser l'application
// document.addEventListener("DOMContentLoaded", () => {
function start() {
    // ===== CONFIGURATION DE BASE =====

    // Vérifier si le mode JSON est activé (sauvegardé dans le stockage local)
    const savedMode = localStorage.getItem("useJsonMode")
    const useJsonMode = savedMode !== null ? savedMode === "true" : false

    // Liste des mots autorisés pour le dictionnaire
    const dictionary = {
        haut: [
            {
                nom: "T-shirt Regular Fit",
                marque: "H&M",
                prix: "9.95",
                couleur: "Blanc",
            },
            {
                nom: "Chemise Slim Fit",
                marque: "Zara",
                prix: "29.99",
                couleur: "Bleu",
            },
        ],
        bas: [
            {
                nom: "Pantalon en denim baggy",
                marque: "Vans",
                prix: "90.00",
                couleur: "Bleu",
            },
            {
                nom: "Jupe plissée",
                marque: "Uniqlo",
                prix: "39.90",
                couleur: "Noir",
            },
        ],
        chapeau: [
            {
                nom: "Casquette classique",
                marque: "Nike",
                prix: "19.99",
                couleur: "Rouge",
            },
            {
                nom: "Chapeau de paille",
                marque: "H&M",
                prix: "14.99",
                couleur: "Beige",
            },
        ],
        chaussure: [
            {
                nom: "Sneakers Air Max",
                marque: "Nike",
                prix: "120.00",
                couleur: "Blanc",
            },
            {
                nom: "Sandales en cuir",
                marque: "Birkenstock",
                prix: "89.95",
                couleur: "Marron",
            },
        ],
    }

    // Configuration de l'API LMStudio
    const lmUrl = "http://localhost:1234/v1/chat/completions"
    const modelName = "gemma-3-27b-it"

    // ===== INITIALISATION DES COMPOSANTS =====

    // 1. Créer le client pour communiquer avec l'API LMStudio
    const lmClient = new LMStudioClient(lmUrl, modelName)

    // 2. Créer le gestionnaire de dictionnaire selon le mode choisi
    const dictManager = useJsonMode
        ? new JsonDictionaryManager(dictionary) // Mode JSON
        : new DictionaryManager(dictionary) // Mode standard

    // 3. Créer le gestionnaire d'appels de fonctions
    // En mode JSON, on lui passe le dictionnaire JSON pour qu'il puisse enregistrer les fonctions
    const functionHandler = new FunctionCallHandler(
        useJsonMode ? dictManager : null
    )

    // ===== INTERFACE UTILISATEUR =====

    // 1. Initialiser l'interface de chat
    const chatInterface = new ChatInterface(
        lmClient,
        dictManager,
        functionHandler
    )
    chatInterface.initialize()

    // 2. Initialiser le sélecteur de mode (JSON vs Standard)
    const modeSelector = new ModeSelector(
        useJsonMode,
        dictManager,
        functionHandler
    )

    // 3. Initialiser le sélecteur de thème
    const themeSelector = new ThemeSelector()

    // 4. Initialiser le terminal
    const terminalElement = document.getElementById("terminal-content")
    const terminal = new TerminalInterface(terminalElement)
    terminal.initialize()

    // 6. Initialiser le gestionnaire de minimisation
    const minifyManager = new MinifyManager(chatInterface)
    minifyManager.initialize()

    // 4. Créer le registre de fonctions qui définit toutes les fonctions disponibles
    const functionRegistry = new FunctionRegistry(
        functionHandler,
        minifyManager
    )

    // 5. Enregistrer toutes les fonctions définies dans le registre
    functionRegistry.registerAllFunctions()

    // 6. Configurer le terminal dans le registre de fonctions
    functionRegistry.initializeTerminal(terminal)

    // Initialize drag and drop for dictionary display
    const dictionaryDisplay = document.getElementById("dictionary-display")
    new DragAndDropManager(dictionaryDisplay, dictManager)

    // Initialize CanvasManager
    const canvasManager = new CanvasManager()

    // Register the function to update the canvas color
    functionHandler.registerCanvasColorFunction(canvasManager)

    // Example of calling the function via a JSON response
    const jsonResponse = JSON.stringify({
        name: "updateCanvasColor",
        arguments: { color: "#ff0000" },
    })
    functionHandler.processResponse(jsonResponse)
}

window.addEventListener("DOMContentLoaded", () => {
    start()
})
