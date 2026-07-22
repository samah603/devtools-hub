const GEMINI_API_KEY = "__GEMINI_API_KEY__";

// ==========================================
// 1. Base64 Encoder / Decoder
// ==========================================
function encodeBase64() {
  const input = document.getElementById('base64Input').value;
  if (!input) {
    document.getElementById('base64Output').value = '';
    return;
  }
  try {
    const bytes = new TextEncoder().encode(input);
    let binary = '';
    bytes.forEach(b => binary += String.fromCharCode(b));
    document.getElementById('base64Output').value = btoa(binary);
  } catch (e) {
    document.getElementById('base64Output').value = 'Error: ไม่สามารถ Encode ได้';
  }
}

function decodeBase64() {
  const input = document.getElementById('base64Input').value.trim();
  if (!input) {
    document.getElementById('base64Output').value = '';
    return;
  }
  try {
    const binary = atob(input);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    document.getElementById('base64Output').value = new TextDecoder().decode(bytes);
  } catch (e) {
    document.getElementById('base64Output').value = 'Error: รูปแบบ Base64 ไม่ถูกต้อง';
  }
}

// ==========================================
// 2. Random Password Generator
// ==========================================
function generatePassword() {
  const length = parseInt(document.getElementById('passLength').value) || 16;
  const incUpper = document.getElementById('incUpper').checked;
  const incLower = document.getElementById('incLower').checked;
  const incNumbers = document.getElementById('incNumbers').checked;
  const incSymbols = document.getElementById('incSymbols').checked;

  let chars = '';
  if (incUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (incLower) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (incNumbers) chars += '0123456789';
  if (incSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (!chars) {
    document.getElementById('passOutput').value = 'กรุณาเลือกอย่างน้อย 1 ตัวเลือก';
    return;
  }

  let password = '';
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    password += chars.charAt(array[i] % chars.length);
  }
  document.getElementById('passOutput').value = password;
}

// ==========================================
// 3. Thai Passphrase to EN Password
// ==========================================
const thaiToEnMap = {
  '_': '%', 'ภ': '4', 'ถ': '5', 'ุ': '6', 'ึ': '7', 'ค': '8', 'ต': '9', 'จ': '0', 'ข': '-', 'ช': '=',
  '๛': '~', '๑': '!', '๒': '@', '๓': '#', '๔': '$', 'ู': '^', '฿': '&', '๕': '*', '๖': '(', '๗': ')', '๘': '_', '๙': '+',
  'ๆ': 'q', 'ไ': 'w', 'ำ': 'e', 'พ': 'r', 'ะ': 't', 'ั': 'y', 'ี': 'u', 'ร': 'i', 'น': 'o', 'ย': 'p', 'บ': '[', 'ล': ']', 'ฃ': '\\',
  'ํ': 'Q', 'ฆ': 'W', 'ฏ': 'E', 'โ': 'R', 'ฌ': 'T', '็': 'Y', '๋': 'U', 'ษ': 'I', 'ศ': 'O', 'ซ': 'P', 'ฅ': '{', 'ฤ': '}',
  'ฟ': 'a', 'ห': 's', 'ก': 'd', 'ด': 'f', 'เ': 'g', '้': 'h', '่': 'j', 'า': 'k', 'ส': 'l', 'ว': ';', 'ง': '\'',
  'ฤ': 'A', 'ฆ': 'S', 'ฏ': 'D', 'โ': 'F', 'ฌ': 'G', '็': 'H', '๋': 'J', 'ษ': 'K', 'ศ': 'L', 'ซ': ':', 'ง': '"',
  'ผ': 'z', 'ป': 'x', 'แ': 'c', 'อ': 'v', 'ิ': 'b', 'ื': 'n', 'ท': 'm', 'ม': ',', 'ใ': '.', 'ฝ': '/',
  'ผ': 'Z', 'ป': 'X', 'ฉ': 'C', 'ฮ': 'V', 'ฺ': 'B', '์': 'N', 'ฒ': 'M', 'ฬ': '<', 'ฃ': '>', 'ฝ': '?',
  ' ': ' '
};

const samplePhrases = [
  "กระโดดให้สูงขึ้นไป",
  "แมวสีขาวนอนบนโต๊ะ99",
  "ฝนตกหนักมากเมื่อวาน",
  "อยากไปเที่ยวทะเลจัง555",
  "กินข้าวผัดกุ้งอร่อยดี",
  "ทำงานอย่างมีความสุข2026",
  "บ้านของเราอบอุ่นมาก",
  "นอนหลับฝันดีคืนนี้"
];

function convertThaiPassphrase() {
  const input = document.getElementById('thaiTextInput').value;
  let output = '';
  for (let char of input) {
    output += thaiToEnMap[char] !== undefined ? thaiToEnMap[char] : char;
  }
  document.getElementById('thaiEnOutput').value = output;
}

function randomThaiPassphraseLocal() {
  console.log("🎲 [Local Fallback] กำลังสุ่มคำจากในเครื่อง...");
  const randomIndex = Math.floor(Math.random() * samplePhrases.length);
  const chosenPhrase = samplePhrases[randomIndex];
  document.getElementById('thaiTextInput').value = chosenPhrase;
  convertThaiPassphrase();
}

async function randomThaiPassphrase() {
  console.log("🔘 ปุ่ม 'สุ่มประโยคไทย' ถูกกดเรียบร้อย!");
  const inputField = document.getElementById('thaiTextInput');

  // ตรวจสอบว่า Key ถูกแทนที่จาก GitHub Secrets หรือยัง
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "__GEMINI_API_KEY__") {
    console.warn("⚠️ ไม่พบ GEMINI_API_KEY (หรือยังเป็น Placeholder) -> สลับไปใช้ Local Fallback");
    randomThaiPassphraseLocal();
    return;
  }

  console.log("🚀 กำลังส่งคำขอไปยัง Gemini API...");
  inputField.value = "🤖 AI กำลังคิดประโยคจำง่ายๆ...";

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: "สร้างประโยคหรือวลีภาษาไทยสั้นๆ 1 ประโยค (ความยาว 3-5 คำ) สำหรับทำ Passphrase จำง่าย อาจมีตัวเลขต่อท้าย เช่น 'กาแฟร้อนยามเช้า123', 'แมวส้มนอนบนโต๊ะ99' ตอบมาเฉพาะตัวประโยคภาษาไทยเท่านั้น ห้ามมีเครื่องหมายอัญประกาศ"
          }]
        }]
      })
    });

    const data = await response.json();
    console.log("📡 [Gemini API Response]:", data);

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const aiPhrase = data.candidates[0].content.parts[0].text.trim();
      console.log("✅ ได้รับประโยคจาก AI:", aiPhrase);
      inputField.value = aiPhrase;
      convertThaiPassphrase();
    } else {
      throw new Error("Invalid Response Structure");
    }
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการดึงข้อมูลจาก Gemini API:", error);
    randomThaiPassphraseLocal();
  }
}

// ==========================================
// 4. URL Encoder / Decoder
// ==========================================
function encodeURL() {
  const input = document.getElementById('urlInput').value;
  if (!input) {
    document.getElementById('urlOutput').value = '';
    return;
  }
  document.getElementById('urlOutput').value = encodeURIComponent(input);
}

function decodeURL() {
  const input = document.getElementById('urlInput').value.trim();
  if (!input) {
    document.getElementById('urlOutput').value = '';
    return;
  }
  try {
    document.getElementById('urlOutput').value = decodeURIComponent(input);
  } catch (e) {
    document.getElementById('urlOutput').value = 'Error: รูปแบบ URL ไม่ถูกต้อง';
  }
}

// ==========================================
// 5. Hash Generator
// ==========================================
async function generateHashes() {
  const text = document.getElementById('hashInput').value;
  if (!text) {
    document.getElementById('hashSHA256').value = '';
    document.getElementById('hashSHA512').value = '';
    return;
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  try {
    const buf256 = await crypto.subtle.digest('SHA-256', data);
    document.getElementById('hashSHA256').value = Array.from(new Uint8Array(buf256)).map(b => b.toString(16).padStart(2, '0')).join('');

    const buf512 = await crypto.subtle.digest('SHA-512', data);
    document.getElementById('hashSHA512').value = Array.from(new Uint8Array(buf512)).map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    console.error(e);
  }
}

// ==========================================
// Helper Functions
// ==========================================
function copyToClipboard(elementId) {
  const text = document.getElementById(elementId).value;
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    alert('คัดลอกเรียบร้อยแล้ว!');
  });
}

// Initial setup on window load
window.onload = function() {
  console.log("🌐 [DevTools Hub] Script loaded and initialized.");
  generatePassword();
  randomThaiPassphrase();
};
