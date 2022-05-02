import KeyService from './key.service.js';

export default class Key {
  constructor(code, lang, keyboard) {
    this.key = {};
    this.keyCode = code;
    this.allKeys = KeyService;
    this.lang = lang;
    this.keyboard = keyboard;
    this.textarea = keyboard.textarea;

    if (lang === 'en') {
      this.allKeys.en.forEach(() => {
        this.key.en = this.allKeys[lang].find((keyData) => keyData.code === this.keyCode);
      });
    } else if (lang === 'ru') {
      this.allKeys.ru.forEach(() => {
        this.key.ru = this.allKeys[lang].find((keyData) => keyData.code === this.keyCode);
      });
    }

    this.sub = document.createElement('span');
    this.sub.textContent = this.key[lang].shift;

    this.title = document.createElement('span');
    this.title.textContent = this.key[lang].value;

    if (this.key[lang].shift === this.key[lang].value.toUpperCase()) {
      this.sub.innerHTML = '';
    }
    this.keyWrapper = document.createElement('div');
    this.keyWrapper.classList.add('key');
    this.keyWrapper.setAttribute('code', this.keyCode);
    this.keyWrapper.append(this.sub, this.title);
    this.currentValue = this.key[lang].value;
  }

  keyDown(isClick = false) {
    this.keyWrapper.classList.add('keydown');
    if (this.key[this.lang].shift !== null || this.key[this.lang].code === 'ArrowDown' || this.key[this.lang].code === 'ArrowUp') {
      this.writeText();
    } else {
      this.funcKeysOn(isClick);
    }
  }

  keyUp(isClick = false) {
    this.textarea.focus();
    if (!isClick) {
      this.keyWrapper.classList.remove('keydown');
    }
    switch (this.keyCode) {
      case 'CapsLock':
        this.keyWrapper.classList.toggle('func-key_active');
        this.keyboard.caps = !this.keyboard.caps;
        this.keyboard.capsClick();
        break;
      case 'ShiftRight':
        if (isClick === false) {
          this.keyboard.shiftRight = false;
          this.keyboard.unshift();
        }
        break;
      case 'ShiftLeft':
        if (isClick === false) {
          this.keyboard.shiftLeft = false;
          this.keyboard.unshift();
        }
        break;
      default:
        break;
    }
  }

  funcKeysOn(isClick) {
    const click = isClick;
    const cursorStart = this.textarea.selectionStart;
    const cursorEnd = this.textarea.selectionEnd;
    const textBeforeCursor = this.textarea.value.substring(0, cursorStart);
    const textAterCursor = this.textarea.value.substring(cursorStart, this.textarea.value.length);
    const V = this.textarea.value;
    const S = this.textarea.selectionStart;
    const E = this.textarea.selectionEnd;
    switch (this.keyCode) {
      case 'ArrowLeft':
        if (cursorStart > 0) {
          this.textarea.setSelectionRange(cursorStart - 1, cursorStart - 1);
        }
        break;
      case 'ArrowRight':
        this.textarea.setSelectionRange(cursorEnd + 1, cursorEnd + 1);
        break;
      case 'Backspace':
        if (S === E) {
          this.textarea.value = V.substring(0, S - 1) + V.substring(S, V.length);
          this.textarea.setSelectionRange(cursorStart - 1, cursorEnd - 1);
        } else {
          this.textarea.value = V.substring(0, S) + V.substring(E, V.length);
        }
        break;
      case 'Delete':
        if (S === E) {
          this.textarea.value = V.substring(0, S) + V.substring(S + 1, V.length);
          this.textarea.setSelectionRange(cursorStart, cursorEnd);
        } else {
          this.textarea.value = V.substring(0, S) + V.substring(E, V.length);
        }
        break;
      case 'CapsLock':
        break;
      case 'ShiftRight':
        if (isClick === false) {
          this.keyboard.shiftRight = true;
          this.keyboard.shift();
        } else {
          this.keyWrapper.classList.toggle('func-key_active');
          this.keyboard.shiftRight = !this.keyboard.shiftRight;
          this.keyboard.shiftClick();
        }
        break;
      case 'ShiftLeft':
        if (isClick === false) {
          this.keyboard.shiftLeft = true;
          this.keyboard.shift();
        } else {
          this.keyWrapper.classList.toggle('func-key_active');
          this.keyboard.shiftRight = !this.keyboard.shiftRight;
          this.keyboard.shiftClick();
        }
        break;
      case 'ControlRight' || 'ControlLeft':
        break;
      case 'AltRight' || 'AltLeft':
        break;
      case 'Space':
        this.textarea.value = `${textBeforeCursor} ${textAterCursor}`;
        this.textarea.setSelectionRange(cursorEnd + 1, cursorEnd + 1);
        break;
      case 'Enter':
        this.textarea.value = `${textBeforeCursor}\n${textAterCursor}`;
        this.textarea.setSelectionRange(cursorEnd + 1, cursorEnd + 1);
        break;
      case 'Tab':
        this.textarea.value = `${textBeforeCursor}    ${textAterCursor}`;
        this.textarea.setSelectionRange(cursorEnd + 4, cursorEnd + 4);
        break;
      default:
        break;
    }
  }

  writeText() {
    const cursorStart = this.textarea.selectionStart;
    const cursorEnd = this.textarea.selectionEnd;

    const textBeforeCursor = this.textarea.value.slice(0, cursorStart);
    const textAterCursor = this.textarea.value.slice(cursorEnd);
    if (this.currentValue.length === 1) {
      this.textarea.value = textBeforeCursor + this.currentValue + textAterCursor;
      this.textarea.selectionStart = cursorStart + 1;
      this.textarea.selectionEnd = cursorStart + 1;
    }
  }

  shifOn() {
    const { caps, shiftLeft, shiftRight } = this.keyboard;
    if (this.key[this.lang].shift) {
      if (!caps) {
        if (shiftLeft || shiftRight) {
          this.sub.classList.add('shift_active');
          this.currentValue = this.key[this.lang].shift;
          if (this.key[this.lang].shift === this.key[this.lang].value.toUpperCase()) {
            this.title.innerHTML = this.currentValue;
          }
        }
      } else if (shiftLeft || shiftRight) {
        this.sub.classList.add('shift_active');
        if (this.key[this.lang].shift !== this.key[this.lang].value.toUpperCase()) {
          this.currentValue = this.key[this.lang].shift;
        }
      }
    }
  }

  shifOff() {
    const { caps, shiftLeft, shiftRight } = this.keyboard;
    if (this.key[this.lang].shift) {
      if (!caps) {
        if (!shiftLeft && !shiftRight) {
          this.sub.classList.remove('shift_active');
          this.currentValue = this.key[this.lang].value;
          if (this.key[this.lang].shift === this.key[this.lang].value.toUpperCase()) {
            this.title.innerHTML = this.currentValue;
          }
        }
      } else if (!shiftLeft && !shiftRight) {
        this.sub.classList.remove('shift_active');
        if (this.key[this.lang].shift !== this.key[this.lang].value.toUpperCase()) {
          this.currentValue = this.key[this.lang].value;
        }
      }
    }
  }

  capsToggle() {
    const { shiftLeft, shiftRight } = this.keyboard;
    if (this.key[this.lang].shift) {
      if (!shiftLeft && !shiftRight) {
        if (this.currentValue === this.key[this.lang].shift) {
          if (this.key[this.lang].shift === this.key[this.lang].value.toUpperCase()) {
            this.currentValue = this.key[this.lang].value;
            this.title.innerHTML = this.currentValue;
          }
        } else if (this.key[this.lang].shift === this.key[this.lang].value.toUpperCase()) {
          this.currentValue = this.key[this.lang].shift;
          this.title.innerHTML = this.currentValue;
        }
      }
    }
  }

  shiftToggle() {
    const { caps, shiftLeft, shiftRight } = this.keyboard;
    if (this.key[this.lang].shift) {
      if (!caps) {
        if (this.key[this.lang].shift === this.key[this.lang].value.toUpperCase()) {
          if (this.currentValue !== this.key[this.lang].shift) {
            this.currentValue = this.key[this.lang].shift;
            this.title.innerHTML = this.currentValue;
          } else if (this.key[this.lang].shift === this.key[this.lang].value.toUpperCase()) {
            this.currentValue = this.key[this.lang].value;
            this.title.innerHTML = this.currentValue;
          }
        }
      }

      if (this.key[this.lang].shift !== this.key[this.lang].value.toUpperCase()) {
        if (this.currentValue === this.key[this.lang].shift) {
          this.sub.classList.remove('shift_active');
          this.currentValue = this.key[this.lang].value;
        } else {
          this.sub.classList.add('shift_active');
          this.currentValue = this.key[this.lang].shift;
        }
      }
    }
  }
}
