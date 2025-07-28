import pyperclip
import pyautogui
import time

print("[✓ Auto Clipboard Paster Running]")
print("[!] Make sure the cursor is focused in any text field.")

last_text = ""

try:
    while True:
        current_text = pyperclip.paste()
        if current_text != last_text and current_text.strip():
            last_text = current_text
            time.sleep(0.3)  # Let clipboard settle
            pyautogui.hotkey('ctrl', 'v')
            print(f"[✓ Auto-pasted]: {current_text}")
        time.sleep(0.5)
except KeyboardInterrupt:
    print("\n[Exiting]")
