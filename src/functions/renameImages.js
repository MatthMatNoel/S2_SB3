import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

// Obtenir le chemin du fichier actuel
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Chemin vers le dossier contenant les images
const imagesDir = path.join(__dirname, "../../public/images")

// Lire tous les fichiers dans le dossier
fs.readdir(imagesDir, (err, files) => {
    if (err) {
        console.error("Erreur lors de la lecture du dossier:", err)
        return
    }

    files.forEach((file) => {
        // Vérifier si le fichier a l'extension .png
        if (path.extname(file) === ".png") {
            // Remplacer les '-' par '_'
            let newName = file.replace(/-/g, "_")

            // Remplacer les 3 derniers caractères avant l'extension par '$'
            newName = newName.slice(0, -7) + "$.png"

            // Chemins complets pour l'ancien et le nouveau fichier
            const oldPath = path.join(imagesDir, file)
            const newPath = path.join(imagesDir, newName)

            // Renommer le fichier
            fs.rename(oldPath, newPath, (renameErr) => {
                if (renameErr) {
                    console.error(
                        `Erreur lors du renommage de ${file}:`,
                        renameErr
                    )
                } else {
                    console.log(`Renommé: ${file} -> ${newName}`)
                }
            })
        }
    })
})
