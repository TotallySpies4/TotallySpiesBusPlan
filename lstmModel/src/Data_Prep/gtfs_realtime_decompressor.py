import os
import logging

from py7zr import py7zr, Bad7zFile


def decompress_7z_file(zip_file_path):
    try:
        with py7zr.SevenZipFile(zip_file_path, mode="r") as archive:
            directory = os.path.dirname(zip_file_path)
            archive.extractall(path=directory)
            return os.path.join(directory, next(iter(archive.getnames()), ''))
    except Bad7zFile as e:
        logging.error(f"Fehler beim Extrahieren der 7z-Datei: {e}")
        return None