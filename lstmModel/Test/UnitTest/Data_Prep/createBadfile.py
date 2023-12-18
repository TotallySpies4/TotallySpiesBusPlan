import os
import random

def create_bad_7z_file(original_file_path):
    # Stellen Sie sicher, dass die Originaldatei existiert
    if not os.path.exists(original_file_path):
        print(f"Die Datei {original_file_path} existiert nicht.")
        return None

    # Bestimmen Sie den Pfad für die beschädigte Datei
    bad_file_path = os.path.splitext(original_file_path)[0] + "-bad.7z"

    # Lesen Sie den Inhalt der Originaldatei
    with open(original_file_path, 'rb') as file:
        data = file.read()

    # Manipulieren Sie einige Bytes im Inhalt
    corrupted_data = bytearray(data)
    for _ in range(10):  # Ändern Sie 10 zufällige Bytes
        index_to_corrupt = random.randint(0, len(corrupted_data) - 1)
        corrupted_data[index_to_corrupt] = corrupted_data[index_to_corrupt] ^ random.randint(1, 255)

    # Schreiben Sie den manipulierten Inhalt in die neue Datei
    with open(bad_file_path, 'wb') as file:
        file.write(corrupted_data)

    return bad_file_path

if __name__ == "__main__":
    original_file = 'testStub/sample-1.7z'  # Pfad zur ursprünglichen 7z-Datei

    bad_file = create_bad_7z_file(original_file)
    if bad_file:
       print(f"Beschädigte 7z-Datei erstellt: {bad_file}")
    else:
       print("Fehler beim Erstellen der beschädigten 7z-Datei.")
