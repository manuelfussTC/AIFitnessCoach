#!/bin/bash

# Verzeichnis, das durchsucht werden soll, hier als Root-Pfad angegeben
root_dir="."  # Ändere dies, falls ein anderer Pfad benötigt wird
output_file="projekt_uebersicht.txt"

# Die Datei, in der der Output gespeichert wird, leeren oder neu anlegen
> "$output_file"

# Durchsuche das Verzeichnis rekursiv nach den Dateitypen und schließe venv und .venv aus
find "$root_dir" -type f \( -name "*.js" -o -name "*.ts"  -o -name "*.html" -o -name "*.tsx" -o -name "*.css" \) \
    -not -path "*/venv/*" -not -path "*/node_modules/*" -not -path "*/dist/*" -not -path "*/.dist/*" -not -path "*/.min/*" -not -path "*/vendor/*" -not -path "*/.venv/*" -not -path "*/tests/*" -not -path "*/old/*" -not -path "*/socialcomm/*" \
    -not -path "transcript.html" -not -path "testus20240516.html" -not -path "services/coaching.html" -not -path "templates/newsletterInfos.html" | while read -r file; do


    # Dateipfad in die Ausgabedatei schreiben
    echo "##### Pfad: $file #####" >> "$output_file"

    # Inhalt der Datei in die Ausgabedatei schreiben
    cat "$file" >> "$output_file"

    # Eine Trennlinie zwischen den Dateien für Übersichtlichkeit
    echo -e "\n\n" >> "$output_file"
done

echo "Fertig! Der Inhalt wurde in '$output_file' gespeichert."
