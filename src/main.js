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
    // const dictionary = [
    //     "T-shirt",
    //     "Pantalon",
    //     "Jeans",
    //     "Short",
    //     "Pantalon-Sport",
    //     "Pull",
    //     "Veste",
    //     "T-shirt-Sport",
    // ]

    const dictionary = [
        "Blouson cuir Marine 350$",
        // "Casquette coton Gris 55$",
        "Chemise Blanc 34$",
        "Chemise motif moche Multicolor 35$",
        "Debardeur Blanc 12$",
        "Doudoune sans manches Vert olive 820$",
        "Haut sans manches Noir 35$",
        "Jacket football Blanc Bleu Rouge 165$",
        // "Jeans baggy Bleu 90$",
        "Mocassin cuir Noir 138$",
        "Pantalon costume Noir 49$",
        "Pantalon lin Beige fonce 45$",
        "Polo Bleu clair 39$",
        "Polo Rose clair 159$",
        "Pull cachemire Vert mousse 149$",
        "Pull over poilu Beige 37$",
        "Pull rayure Bleu clair Blanc casse 89$",
        // "Basket Blanc 37$",
        "Sweat capuche Orange 129$",
        "Sweat capuche Vert fluo 70$",
        // "T shirt Blanc 9$",
        "Veste Noir 569$",
        "Veste costume Beige 169$",
        "Veste metallique Rose fonce 163$",
        "Veste jeans Bleu 139$",
        "Veste impermeable Bleu canard 210$",
        "Veste costume Vert olive 2650$",
        "Jacket sport Ambre 59$",
        "Jeans baggy Bleu fonce 850$",
        "Jeans baggy Noir 49$",
        "Jeans baggy Rose 105$",
        "Jeans cargo Bleu clair 144$",
        "Jeans droit Bleu clair 139$",
        "Jupe courte cuir Noir 333$",
        "Jupe courte jeans Bleu clair 79$",
        "Jupe longue cuir Noir 413$",
        "Jupe longue jeans Noir 77$",
        "Jupe motif fleur Blanc Rouge 105$",
        "Jupe sport Jaune pale 79$",
        "Kilt carreaux Beige Rouge 432$",
        "Pantalon sport Rose 68$",
        "Pantalon cargo Noir 199$",
        "Pantalon cuir Noir 445$",
        "Pantalon evase Marron 19$",
        "Pantalon ski Rouge 1160$",
        "Survetement sport Ambre 54$",
        "Pantalon sport Brun fonce 72$",
        "Pantalon sport Orange 72$",
        "Pantalon velour cotele Violet 79$",
        "Short de bain Rose 149$",
        "Short jeans Blanc 60$",
        "Short jeans Bleu clair 60$",
        "Short lin Beige 179$",
        "Short lin Vert olive 24$",
        "T Shirt Gris fonce 100$",
        "Tongs Orange 29$",
        "Basket Vert 120$",
        "Santiag basse cuir Noir 480$",
        "Mocassin gucci Marron 1030$",
        "Mocassin cuir Marron 199$",
        "Derbies cuir Noir 215$",
        "Crocs Rouge 35$",
        "Claquette synthetique Noir 40$",
        "Bottines dr martens Noir 250$",
        "Bottines cuir Noir 152$",
        "Botte caoutchouc Vert 180$",
        "Basket technique Noir 430$",
        "Basket sport Creme 150$",
        "Basket sport Blanc 240$",
        "Basket nike air max plus Rose Blanc 220$",
        "Basket nike air max plus Noir 170$",
        "Basket nike air max plus Bleu 220$",
        "Basket jeans Bleu 176$",
        "Basket gucci Beige Blanc 1020$",
        "Basket converse Jaune 105$",
        "Basket air jordan 1 Rouge Blanc Noir 165$",
        "Basket air force 1 Vert mousse 130$",
        "Chapka Brun Vert Rouge 30$",
        "Chapeau paille Jaune pale 38$",
        "Chapeau droit Vert fonce 90$",
        "Casquette ralph lauren Orange 60$",
        "Casquette luxe Rose 116$",
        "Casquette luxe Noir 189$",
        "Casquette jeans Bleu 41$",
        "Casquette gucci Beige 480$",
        "Casquette avec coeur Brun 70$",
        "Bonnet petit Noir 31$",
        "Bonnet grand Noir 63$",
        "Bonnet dinosaure Bleu fonce 10$",
        "Bob lacost Noir 70$",
        "Bob jeans Bleu 50$",
        "Bob gucci Rose 520$",
        "Beret carreaux Beige 60$",
        // "Short sport blanc 20$",
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
