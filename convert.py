import os
from PIL import Image

def gif_to_webp(gif_path, webp_path):
    try:
        with Image.open(gif_path) as img:
            frames = []
            durations = []
            for frame in range(img.n_frames):
                img.seek(frame)
                new_frame = Image.new("RGBA", img.size, (0, 0, 0, 0))
                new_frame.paste(img, (0, 0), img.convert("RGBA"))
                frames.append(new_frame)
                durations.append(img.info.get('duration', 100))

            frames[0].save(
                webp_path, 
                'webp',
                save_all=True,
                append_images=frames[1:],
                duration=durations,
                loop=0
            )
        print(f"Converted: {os.path.basename(gif_path)}")
    except Exception as e:
        print(f"Error converting {os.path.basename(gif_path)}: {str(e)}")

def convert_gifs_in_folder(input_folder_name):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    input_folder = os.path.join(script_dir, input_folder_name)
    output_folder = os.path.join(script_dir, "img")

    if not os.path.exists(input_folder):
        print(f"Error: The folder {input_folder} does not exist.")
        return

    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    for filename in os.listdir(input_folder):
        if filename.lower().endswith('.gif'):
            gif_path = os.path.join(input_folder, filename)
            webp_filename = os.path.splitext(filename)[0] + '.webp'
            webp_path = os.path.join(output_folder, webp_filename)
            
            # 检查同名WebP
            if os.path.exists(webp_path):
                print(f"Skipped: {webp_filename} (already exists)")
                continue
            
            gif_to_webp(gif_path, webp_path)

    print("Conversion complete!")

# Example:
input_folder_name = "GIFS"
convert_gifs_in_folder(input_folder_name)
