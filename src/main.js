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

// Attendre que le DOM soit complètement chargé avant d'initialiser l'application
// document.addEventListener("DOMContentLoaded", () => {
function start() {
    // ===== CONFIGURATION DE BASE =====

    // Vérifier si le mode JSON est activé (sauvegardé dans le stockage local)
    const savedMode = localStorage.getItem("useJsonMode")
    const useJsonMode = savedMode !== null ? savedMode === "true" : false

    // Liste des mots autorisés pour le dictionnaire
    const dictionary = [
        "Blouson-cuir_Marine_350-00",
        "Casquette-coton_Gris_55-00",
        "Chemise_Blanc-casse_34-90",
        "Chemise-motif-estival_Multicolor_35-30",
        "Debardeur_Blanc_12-95",
        "Doudoune-sans-manches_Vert-olive_820-00",
        "Haut-sans-manches_Noir_35-00",
        "Jacket-foot_Blanc-Bleu-Rouge_165-00",
        "Jeans-baggy_Bleu_90-00",
        "Mocassin-cuir_Noir_138-00",
        "Pantalon-costume_Noir_49-96",
        "Pantalon-lin_Beige-fonce_45-95",
        "Polo_Bleu-clair_39-95",
        "Polo_Rose-clair_159-00",
        "Pull-cachemire_Vert-mousse_149-00",
        "Pull-over-poilu_Beige_37-50",
        "Pull-rayure_Bleu-clair-Blanc_89-90",
        "Sneaker_Blanc-casse_37-95",
        "Sweat-capuche_Orange_129-90",
        "Sweat-capuche_Vert-fluo_70-00",
        "T-shirt_Blanc_9-95",
        "Trench-coat_Noir_569-00",
        "Vest-costume_Beige_169-95",
        "Vest-metallisee_Fuchsia_163-00",
        "Veste-denim_Bleu_139-90",
        "Veste-karpa_Bleu-canard_210-00",
        "Veste-laine_Vert-olive_2650-00",
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
}

window.addEventListener("DOMContentLoaded", () => {
    start()
})
