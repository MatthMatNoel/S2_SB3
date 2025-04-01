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

// Attendre que le DOM soit complètement chargé avant d'initialiser l'application
// document.addEventListener("DOMContentLoaded", () => {
function start() {
    // ===== CONFIGURATION DE BASE =====

    // Vérifier si le mode JSON est activé (sauvegardé dans le stockage local)
    const savedMode = localStorage.getItem("useJsonMode")
    const useJsonMode = savedMode !== null ? savedMode === "true" : false

    // Liste des mots autorisés pour le dictionnaire
    const dictionary = [
        "T-shirt_Blanc_9-95",
        "Trench-coat_Noir_569-00",
        "Polo_Rose-clair_159-00",
        "Jeans-baggy_Bleu_90-00",
        "Pantalon-costum_Noir_49-95",
        "Chemise_Blanche_29-99",
        "Robe_Rouge_120-00",
        "Veste_Grise_89-95",
        "Short_Bleu-marine_45-50",
        "Pull_Bordeaux_60-00",
        "Blouson_Cuir_250-00",
        "Jupe_Noire_75-00",
        "Chapeau-Beige_35-00",
        "Chapeau-de-paille_Vert-clair_25-00",
        "Casquette-Noire_20-00",
        "Casquette-Bleue_18-50",
        "Echarpe-Rayee_20-00",
        "Gants-Noirs_15-99",
        "Manteau-en-laine_Gris-foncé_300-00",
        "Baskets-Blanches_99-95",
        "Baskets-Noires_89-95",
        "Sandales-Dorees_49-99",
        "Sandales-Argentées_55-00",
        "Chaussures-richelieu_Noir_120-00",
        "Chaussures-derby_Marron-clair_110-00",
        "Bottes-en-cuir_Marron-foncé_150-00",
        "Bottes-plates_Noir_130-00",
        "Ceinture-Marron_25-00",
        "Pantalon-chino_Beige_70-00",
        "Casquette-coton_Gris_55-00",
    ]

    // Configuration de l'API LMStudio
    const lmUrl = "http://localhost:1234/v1/chat/completions"
    const modelName = "gemma-3-4b-it"

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
}

window.addEventListener("DOMContentLoaded", () => {
    start()
})
