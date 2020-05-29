const axios = require("axios");

async function getExpression(keyword) {
    if (keyword === '') return [];
    const res = await axios({
        method: 'get',
        url: `https://pic.sogou.com/pics/json.jsp?query=${encodeURIComponent(
            `${keyword} 表情`,
        )}&st=5&start=0&xml_len=60&callback=callback&reqFrom=wap_result&`,
        headers: {
            accept: '*/*',
            'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
            'cache-control': 'no-cache',
            pragma: 'no-cache',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'same-origin',
            referrer: `https://pic.sogou.com/pic/emo/searchList.jsp?statref=search_form&uID=hTHHybkSPt37C46z&spver=0&rcer=&keyword=${encodeURIComponent(
                keyword,
            )}`,
            referrerPolicy: 'no-referrer-when-downgrade',
            'user-agent':
                'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        }
    });
    if (res.status !== 200) return {status: 400, msg: '搜索表情包失败, 请重试'}
    try {
        const parseDataResult = res.data.match(/callback\((.+)\)/);
        const data = JSON.parse(`${parseDataResult[1]}`);

        const images = data.items;
        return images.map(({ locImageLink, width, height }) => ({
            image: locImageLink,
            width,
            height,
        }));
    } catch (err) {
        assert(false, '搜索表情包失败, 数据解析异常');
    }

    return [];
}

module.exports = {
    getExpression
}
