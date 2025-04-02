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
        "Chemise-motif-moche_Multicolor_35-30",
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
        "Pull-rayure_Bleu-clair-Blanc-casse__89-90",
        "Sneakers_Blanc-casse_37-95",
        "Sweat-capuche_Orange_129-90",
        "Sweat-capuche_Vert-fluo_70-00",
        "T-shirt_Blanc_9-95",
        "Trench-coat_Noir_569-00",
        "Veste-costume_Beige_169-95",
        "Veste-metallique_Rose-fonce_163-00",
        "Veste-denim_Bleu_139-90",
        "Parka-capuche_Bleu-canard_210-00",
        "Veste-laine_Vert-olive_2650-00",
        "Jacket-sport_Ambre_59-90",
        "Jeans-baggy_Bleu-fonce_850-00",
        "Jeans-baggy_Noir_49-90",
        "Jeans-baggy_Rose_105-00",
        "Jeans-cargo_Bleu-clair_144-00",
        "Jeans-droit_Bleu-clair_139-90",
        "Jupe-courte-cuir_Noir_333-00",
        "Jupe-courte-jeans_Bleu-clair_79-90",
        "Jupe-longue-cuir_Noir_413-00",
        "Jupe-longue-jeans_Noir_77-00",
        "Jupe-motif-fleur_Blanc-Rouge_105-00",
        "Jupe-sport_Jaune-pale_79-90",
        "Kilt-carreaux_Beige-Rouge_432-00",
        "Training-sport_Rose_68-00",
        "Pantalon-cargo_Noir_199-00",
        "Pantalon-cuir_Noir_445-00",
        "Pantalon-evase_Marron_19-95",
        "Pantalon-ski_Rouge_1160-00",
        "Training-sport_Ambre_54-90",
        "Training-sport_Brun-fonce_72-00",
        "Training-sport_Orange_72-00",
        "Pantalon-velour-cotele_Violet_79-00",
        "Short-de-bain_Rose_149-00",
        "Short-jeans_Blanc_60-00",
        "Short-jeans_Bleu-clair_60-00",
        "Short-lin_Beige_179-00",
        "Short-lin_Vert-olive_24-90",
        "T-Shirt_Gris-fonce_100-00",
        "Tongs_Orange_29-00",
        "Sneakers_Vert_120-00",
        "Santiag-basse-cuir_Noir_480-00",
        "Mocassin-gucci_Marron_1030-00",
        "Mocassin-cuir_Marron_199-00",
        "Derbies-cuir_Noir_215-00",
        "Crocs_Rouge_35-00",
        "Claquette-synthetique_Noir_40-00",
        "Bottines-dr-martens_Noir_250-00",
        "Bottines-cuir_Noir_152-00",
        "Botte-caoutchouc_Vert_180-00",
        "Basket-technique_Noir_430-00",
        "Basket-sport_Creme_150-00",
        "Basket-sport_Blanc_240-00",
        "Basket-nike-air-max-plus_Rose-Blanc_220-00",
        "Basket-nike-air-max-plus_Noir_170-00",
        "Basket-nike-air-max-plus_Bleu_220-00",
        "Basket-jeans_Bleu_176-00",
        "Basket-gucci_Beige-Blanc_1020-00",
        "Basket-converse_Jaune_105-00",
        "Basket-air-jordan-1_Rouge-Blanc-Noir_165-00",
        "Basket-air-force-1_Vert-mousse_130-00",
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
