
# AutoComplete

## 启动说明
```shell
npm start
```

### 使用说明

#### 添加单词/句子进字典
当输入框内不为空时，每次按下Enter时会将输入框的内容导入进字典并清空输入框

#### 单词联想
当字典为
```javascript
["hello", "hallo", "hhhhh"]
```
若输入的值为 h,
则输入框则会自动填充ello，并以以下形式呈现

<font color="white">h</font><font color="gray">ello</font>

#### 句子联想
当句子字典为
```javascript
["hello world"]
```
若输入hello时
则输入框则会自动填充 world，并以以下形式呈现
<font color="white">hello</font><font color="gray"> world</font>

### 注意事项
* 页面每次刷新或者项目重新部署时都会将字典清空
* 仅支持英文字母