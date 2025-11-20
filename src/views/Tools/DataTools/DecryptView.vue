<template>
  <div class="decrypt-view">
    <h2>解密工具</h2>
    <el-form>
      <el-form-item label="待解密数据">
        <el-input type="textarea" v-model="encryptedData" placeholder="请输入需要解密的数据" :rows="4"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="decryptData">解密</el-button>
      </el-form-item>
    </el-form>
    
    <div class="result-section" v-if="decryptedResult">
      <h3>解密结果</h3>
      <Editor lang="json" v-model="decryptedResult" height="300px" :read-only="true"></Editor>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Editor from '/src/components/Editor.vue'
import CryptoJS from 'crypto-js'

const encryptedData = ref('')
const decryptedResult = ref('')

// 检查Base64字符串有效性
function isValidBase64(str) {
  try {
    // 检查长度是否为4的倍数
    if (str.length % 4 !== 0) {
      console.log("Base64验证失败: 长度不是4的倍数", str.length);
      return false;
    }
    
    // 检查字符集
    const validChars = /^[A-Za-z0-9+/=]*$/;
    if (!validChars.test(str)) {
      console.log("Base64验证失败: 包含无效字符");
      return false;
    }
    
    // 检查等号位置
    const equalIndex = str.indexOf('=');
    if (equalIndex !== -1) {
      const afterEqual = str.substring(equalIndex);
      if (!/^=+$/.test(afterEqual)) {
        console.log("Base64验证失败: 等号位置不正确");
        return false;
      }
      if (afterEqual.length > 2) {
        console.log("Base64验证失败: 等号过多");
        return false;
      }
    }
    
    return true;
  } catch (e) {
    console.log("Base64验证异常:", e);
    return false;
  }
}

// 解密函数
function decryptData() {
  try {
    let text = encryptedData.value;
    
    if (!text) {
      decryptedResult.value = JSON.stringify({error: "输入为空", message: "请输入需要解密的数据"}, null, 4);
      return;
    }
    
    console.log("原始输入:", text);
    console.log("原始输入(十六进制):", Array.from(text).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' '));
    
    // 1. 大小写转换 (swapcase)
    text = text.split('').map(c => {
      if (c >= 'a' && c <= 'z') {
        return c.toUpperCase();
      } else if (c >= 'A' && c <= 'Z') {
        return c.toLowerCase();
      }
      return c;
    }).join('');
    
    console.log("大小写转换后:", text);
    
    // 2. 逆序 [::-1]
    text = text.split('').reverse().join('');
    
    console.log("逆序后:", text);
    
    // 3. ASCII码-2
    let processedText = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const newCharCode = charCode - 2;
      // 确保字符码有效
      if (newCharCode >= 0) {
        processedText += String.fromCharCode(newCharCode);
      } else {
        processedText += String.fromCharCode(0); // 防止负数
      }
    }
    text = processedText;
    
    console.log("ASCII码-2后:", text);
    console.log("ASCII码-2后(十六进制):", Array.from(text).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' '));
    
    // 检查Base64有效性
    const isBase64Valid = isValidBase64(text);
    console.log("Base64格式检查结果:", isBase64Valid);
    
    if (!isBase64Valid) {
      decryptedResult.value = JSON.stringify({
        error: "Base64格式无效", 
        message: "处理后的字符串不是有效的Base64格式",
        steps: {
          original: encryptedData.value,
          case_converted: encryptedData.value.split('').map(c => {
            if (c >= 'a' && c <= 'z') {
              return c.toUpperCase();
            } else if (c >= 'A' && c <= 'Z') {
              return c.toLowerCase();
            }
            return c;
          }).join(''),
          reversed: encryptedData.value.split('').map(c => {
            if (c >= 'a' && c <= 'z') {
              return c.toUpperCase();
            } else if (c >= 'A' && c <= 'Z') {
              return c.toLowerCase();
            }
            return c;
          }).split('').reverse().join(''),
          ascii_minus_2: text
        },
        details: {
          length: text.length,
          chars: Array.from(text).map((c, i) => ({index: i, char: c, code: c.charCodeAt(0)})).slice(0, 20)
        }
      }, null, 4);
      return;
    }
    
    // 4. Base64解码
    let decodedData;
    try {
      const binaryString = atob(text);
      // 转换为Uint8Array
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      decodedData = bytes;
      
      console.log("Base64解码成功，字节长度:", bytes.length);
      console.log("前20个字节:", Array.from(bytes.slice(0, 20)).join(', '));
    } catch (e) {
      console.error("Base64 decode error:", e);
      decryptedResult.value = JSON.stringify({
        error: "Base64解码失败", 
        message: e.message,
        processed_text: text,
        text_details: {
          length: text.length,
          char_codes: Array.from(text).map(c => c.charCodeAt(0)).slice(0, 20)
        }
      }, null, 4);
      return;
    }
    
    // 5. AES解密
    let aesDecryptedText = '';
    try {
      // 将Uint8Array转换为WordArray
      const wordArray = CryptoJS.lib.WordArray.create(decodedData);
      
      // Base64解码密钥
      const key = CryptoJS.enc.Base64.parse('GvyIymDJv32xXYlkgYzptV==');
      
      // AES/ECB/PKCS7解密
      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: wordArray }, 
        key, 
        { 
          mode: CryptoJS.mode.ECB, 
          padding: CryptoJS.pad.Pkcs7 
        }
      );
      
      // 转换为UTF-8字符串
      aesDecryptedText = decrypted.toString(CryptoJS.enc.Utf8);
      console.log("AES解密结果:", aesDecryptedText);
    } catch (e) {
      console.error("AES decrypt error:", e);
      // 如果AES解密失败，继续使用Base64解码后的数据
      try {
        aesDecryptedText = new TextDecoder('utf-8').decode(decodedData);
      } catch (utf8Error) {
        console.log("UTF-8解码失败，使用Latin1解码");
        aesDecryptedText = String.fromCharCode.apply(null, decodedData);
      }
      console.log("使用解码后数据:", aesDecryptedText);
    }
    
    // 6. 将字符串转换为JSON对象
    try {
      const jsonData = JSON.parse(aesDecryptedText);
      decryptedResult.value = JSON.stringify(jsonData, null, 4);
    } catch (e) {
      console.error("JSON parse error:", e);
      // 如果不是JSON格式，直接显示解密后的文本
      decryptedResult.value = JSON.stringify({decoded_text: aesDecryptedText}, null, 4);
    }
  } catch (e) {
    console.error("Decrypt error:", e);
    decryptedResult.value = JSON.stringify({error: "解密过程出错", message: e.message}, null, 4);
  }
}
</script>


<style scoped lang="scss">
.decrypt-view {
  padding: 20px;
  
  h2 {
    margin-bottom: 20px;
  }
  
  h3 {
    margin: 20px 0 10px 0;
  }
  
  .result-section {
    margin-top: 20px;
  }
}
</style>