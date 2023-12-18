import py7zr
import os

def create_sample_7z_file(output_path, files):
    with py7zr.SevenZipFile(output_path, 'w') as archive:
        for file_path in files:
            archive.write(file_path, os.path.basename(file_path))

if __name__ == "__main__":
    # Specify the output path for the 7z file
    output_path = 'sample-2.7z'

    # Specify the files you want to include in the 7z file
    files_to_compress = ['file1.txt', 'file2.txt']

    # Create the sample 7z file
    create_sample_7z_file(output_path, files_to_compress)

    print(f"Sample 7z file '{output_path}' created successfully.")
