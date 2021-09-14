import * as crypto from 'crypto';
import * as https from 'https';



export class OpenApi {

    private $gateway='https://shq-api.51fubei.com/gateway/agent';

    private $appSecret='';

    private vendorSn='';

    constructor(
        private readonly vendor_sn: string,
        private readonly appSecret: string
    ) {
        this.vendorSn = vendor_sn;
        this.$appSecret = appSecret;
	}

    /**
     * 生成提交结果参数
     * @param $commonData 公共参数
     * @param array $bizContent 业务参数
     * @return bool|string
     * @throws Exception
     */
    async actionApi($commonData,$bizContent={}){
        $commonData = Object.assign({
            'vendor_sn':this.vendorSn,
			'nonce':String(Date.now()+Math.floor(Math.random()*1000000)),
			"format": "json",
			"sign_method": "md5",
			"version": "1.0"
        },$commonData)
        $commonData['biz_content']=JSON.stringify($bizContent);
        $commonData['sign'] = this.getSign($commonData);
        try{
            const $result = await this.curlPostContents(this.$gateway,$commonData);
            console.log('$result',$result)
            return $result;
        }catch ($e){
            throw new Error($e);
        }
    }


    /**
     * 生成签名
     * @param $data
     * @return string
     */
    getSign($data,appSecret=this.$appSecret){
        const kvArr=Object.keys($data).map((key)=>key.toLowerCase())
        .sort()
        .map((key) => key+'='+$data[key]);


        console.log('kvArr',kvArr)

        //全部小写合并字符串
        let $str = kvArr.join('&')+appSecret;

        console.log('$str',$str)

        //获取待加密字符串
        return this.md5($str).toUpperCase();
    }



    md5(txt):string {
        return crypto.createHash('md5').update(txt).digest('hex');
    }

    /**
     * 提交提交结果
     * @param $url 网关地址
     * @param array $data 请求参数
     * @param int $timeout 超时时间
     * @return bool|string
     * @throws Exception
     */
    curlPostContents($url, $data = {}, $timeout=10){
        const data = JSON.stringify($data).replace(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g, (matched) => {
            return '\\u' + matched.charCodeAt(0).toString(16);
        });
        console.log('data',data)
        const url = new URL($url);

          const options = {
			protoco: url.protocol,
			hostname: url.host,
			path: url.pathname,
			method: 'POST',
			headers: {
                'Content-Type': 'application/json',
                // 'Content-Length': data.length
              },
			timeout: $timeout*1000
		};
        return new Promise((resolve,reject)=>{
            const req = https.request(options, res => {
                console.log(`状态码: ${res.statusCode}`)
              
                var _data= '' ;
                res.on( 'data' , function (chunk){
                   _data += chunk;
                });
                res.on( 'end' , function (){
                   resolve(JSON.parse(_data))
                 });
            })
                
                req.on('error', error => {
                    reject(error)
                })
              
                req.write(data)
                req.end()
        })
    }
}
