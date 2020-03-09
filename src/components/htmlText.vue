<template>
  <div id="htmlText">
    <p class='card-text'>
      <template v-for="(object, order) in entities">
        {{ substringByByte3(originText, object.indices_start - where, where) }}
        <router-link :x="where = object.indices_end" :to="`/` + (object.type === 'symbol' ? 'symbol' : 'hashtag') + `/` + object.text" v-if="object.expanded_url === ''" :key="tweet_id + `_` +order + `_entities`">{{ (object.type === 'symbol' ? '$' : '#') + object.text }}</router-link>
        <a :x="where = object.indices_end" :href="object.expanded_url" target="_blank" v-else :key="tweet_id + `_` +order + `_entities`">{{ object.text }}</a>
      </template>
    </p>
</div>
</template>

<script>
export default {
  name: 'htmlText',
  props: {
    originText: String,
    entities: Array,
    tweet_id: String
  },
  data() {
    return {
      where: 0,
    }
  },
  methods: {
    //修改自
    //https://juejin.im/post/5dd5e92c51882578f675abc7
    /* 通过文字二进制得到文字字节数 */
    getByteByBinary: function (binaryCode) {
  /**
   * 二进制 Binary system,es6表示时以0b开头
   * 八进制 Octal number system,es5表示时以0开头,es6表示时以0o开头
   * 十进制 Decimal system
   * 十六进制 Hexadecimal,es5、es6表示时以0x开头
   */
  let byteLengthDatas = [0, 1, 2, 3, 4];
  let len = byteLengthDatas[Math.ceil(binaryCode.length / 8)];
  return len;
},
/* 通过文字十六进制得到文字字节数 */
    getByteByHex: function (hexCode) {
  return this.getByteByBinary(parseInt(hexCode, 16).toString(2));
},

substringByByte3: function (str, maxLength, start = 0) {
  let result = "";
  let flag = false;
  let len = 0;
  let length = 0;
  let length2 = 0;
  for (let i = start; i < str.length; i++) {
    let code = str.codePointAt(i).toString(16);
    if (code.length > 4) {
      i++;
      if ((i + 1) < str.length) {
        flag = str.codePointAt(i + 1).toString(16) === "200d";
      }
    }
    if (flag) {
      len += this.getByteByHex(code);
      if (i === str.length - 1) {
        length += len;
        if (length <= maxLength) {
          result += str.substr(length2, i - length2 + 1);
        } else {
          break
        }
      }
    } else {
      if (len !== 0) {
        length += len;
        length += this.getByteByHex(code);
        if (length <= maxLength) {
          result += str.substr(length2, i - length2 + 1);
          length2 = i + 1;
        } else {
          break
        }
        len = 0;
        continue;
      }
      length += this.getByteByHex(code);
      if (length <= maxLength) {
        if (code.length <= 4) {
          result += str[i]
        } else {
          result += str[i - 1] + str[i]
        }
        length2 = i + 1;
      } else {
        break
      }
    }
  }
  return result;
}

}
}
</script>
