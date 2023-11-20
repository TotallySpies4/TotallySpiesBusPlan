import os
import logging

from py7zr import py7zr


def decompress_7z_file(zip_file):
    try:
        with py7zr.SevenZipFile(zip_file, mode="r") as archive:
            archive.extractall()
    except py7zr.exceptions.Bad7zFile as e:
        logging.info(f"Fehler beim Extrahieren der 7z-Datei: {e}")


