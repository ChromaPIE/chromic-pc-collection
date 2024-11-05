import re
import os

def format_card_info(input_str):
    # 匹配时期（era）或活动（event）名称
    pattern = r'^([\w\s&]+)\s+de\s+([\w\s.*\']+(?:\s*x\s*[\w\s.*\']+)?)\s+(era|evento)\s+([\w\s\'.?:]+)\s+✨(\d+)\s+-\s+([\w\d.]+)$'
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
        return f"❌ ERROR: Format invalid. Input: {input_str}. Is it from Garam APP? or did the regex go wrong again?", None, None

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

    # 查找inventory数组
    inventory_pattern = r'let\s+inventory\s*=\s*\[([\s\S]*?)\];'
    inventory_match = re.search(inventory_pattern, content)
    
    if inventory_match:
        inventory_content = inventory_match.group(1)
        
        # 新卡NUMBER
        new_card_number = int(re.search(r'(\d+)', new_card.split(',')[3]).group(1))
        
        # 现有卡NUMBER
        existing_cards = re.findall(r'(\s*newInvCard\(.*?\),?\s*)', inventory_content, re.DOTALL)
        
        # 插入位置
        insert_index = 0
        for i, card in enumerate(existing_cards):
            match = re.search(r'newInvCard\((.*?)\)', card)
            if match:
                card_parts = match.group(1).split(',')
                if len(card_parts) >= 4:
                    try:
                        card_number = int(re.search(r'(\d+)', card_parts[3]).group(1))
                        if new_card_number < card_number:
                            break
                        insert_index = i + 1
                    except ValueError:
                        print(f"Warning: Could not parse number for card: {card}")
        
        # 构建新inventory
        # 寻找索引
        new_inventory_content = inventory_content.strip().split('\n')
        first_card_index = next((i for i, line in enumerate(new_inventory_content) if 'newInvCard' in line), 0)
        new_inventory_content.insert(first_card_index + insert_index, '  ' + new_card.strip())
        new_inventory_content = '\n'.join(new_inventory_content)
        
        # 替换原文件内容
        new_content = re.sub(inventory_pattern, f'let inventory = [\n{new_inventory_content}\n];', content).strip()
        
        with open(js_file, 'w', encoding='utf-8') as file:
            file.write(new_content)
        return True
    return False

print("Enter card info from Garam ('quit' to exit) :")

while True:
    user_input = input()
    if user_input.lower() == 'quit':
        break
    try:
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
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        print("Please check your input and try again.")

print("Program terminated.")
