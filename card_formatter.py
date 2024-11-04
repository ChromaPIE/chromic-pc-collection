import re
import os

def format_card_info(input_str):
    # 匹配时期（era）或活动（event）名称
    pattern = r'^(\w+(?:\s*&\s*\w+)?)\s+de\s+([\w\s*]+(?:\s*x\s*[\w\s*]+)?)\s+(era|evento)\s+([\w\s\'.]+)\s+✨(\d+)\s+-\s+([\w\d.]+)$'
    match = re.match(pattern, input_str)
    
    if match:
        name, group, type_, era_event, number, code = match.groups()
        if type_ == 'evento':
            result = f'newInvCard("{name}", "{group}", "{era_event}", {number}, "{code}", -, -, true),'
        else:  # era
            result = f'newInvCard("{name}", "{group}", "{era_event}", {number}, "{code}", -, -),'
        
        # 检查卡面gif
        gif_code = code.split('.')[0]
        gif_exists = check_gif_exists(gif_code)
        
        return result, gif_code, gif_exists
    else:
        return "❌ ERROR: Format invalid. Is it from Garam APP? or did the regex go wrong again?", None, None

def check_gif_exists(gif_code):
    gif_folder = 'GIFS'
    if not os.path.exists(gif_folder):
        print(f"❌ WARNING: FOLDER '{gif_folder}' does not exist!")
        return False
    for file in os.listdir(gif_folder):
        if file.startswith(gif_code) and file.endswith('.gif'):
            return True
    return False

def add_to_js_file(new_card):
    js_file = 'addcards.js'
    with open(js_file, 'r', encoding='utf-8') as file:
        content = file.read()

    last_bracket_index = content.rfind('];')
    if last_bracket_index != -1:
        new_content = content[:last_bracket_index] + '  ' + new_card + '\n' + content[last_bracket_index:]
        
        with open(js_file, 'w', encoding='utf-8') as file:
            file.write(new_content)
        return True
    return False

print("Enter card info from Garam ('quit' to exit) :")

while True:
    user_input = input()
    if user_input.lower() == 'quit':
        break
    result, gif_code, gif_exists = format_card_info(user_input)
    print(">>>>>>>>>>>>")
    print(result)
    if gif_code:
        if gif_exists:
            print(f"❗ GIF found for card - {gif_code}")
        else:
            print(f"❓ GIF missing for card - {gif_code}")
    
    if result.startswith('newInvCard'):
        if add_to_js_file(result):
            print("✔️  Result wrote to javascript, double check it!")
        else:
            print("❌  Failed to write result to javascript.")
    print("<<<<<<<<<<<<")

print("Program terminated.")
