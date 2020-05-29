import axios from '@/plugin/axios'

export function getLinkmansLastMessages (params) {
  return axios({
    url: '/m/getLinkmansLastMessages',
    method: 'post',
    data: params
  })
}

export function uploadFile (params) {
  return axios({
    url: '/upload/file',
    method: 'post',
    data: params
  })
}

export function uploadImage (params) {
  return axios({
    url: '/upload/image',
    method: 'post',
    data: params
  })
}

export function getExpression (params) {
  return axios({
    method: 'get',
    url: `https://pic.sogou.com/pics/json.jsp?query=${encodeURIComponent(
      `${params} 表情`
    )}&st=5&start=0&xml_len=60&callback=callback&reqFrom=wap_result&`,
    headers: {
      accept: '*/*',
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
      'cache-control': 'no-cache',
      pragma: 'no-cache',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-origin',
      referrer: `https://pic.sogou.com/pic/emo/searchList.jsp?statref=search_form&uID=hTHHybkSPt37C46z&spver=0&rcer=&keyword=${encodeURIComponent(
        params
      )}`,
      referrerPolicy: 'no-referrer-when-downgrade',
      'user-agent':
        'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
    }
  })
}
